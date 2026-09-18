// Cloudflare Worker: serves the built app and collects audience votes.
//
// One Durable Object per story acts as the vote room. Everything is plain
// HTTP — no WebSockets — because venue wifi and captive portals routinely
// pass ordinary HTTPS while breaking socket upgrades, and polling recovers
// invisibly when a phone sleeps or switches to cellular.

import { DurableObject } from 'cloudflare:workers';

const json = (data, status = 200) => Response.json(data, {
  status,
  headers: { 'cache-control': 'no-store' }
});

export class VoteRoom extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    // Tallies are held in SQLite rather than plain instance fields: a DO can
    // be evicted between rounds, and losing the open round mid-presentation
    // is not a risk worth taking for the few writes this costs.
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS round (
      id TEXT PRIMARY KEY, chapter TEXT, options TEXT, closed INTEGER DEFAULT 0
    )`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS vote (
      round TEXT, voter TEXT, option INTEGER, PRIMARY KEY (round, voter)
    )`);
  }

  /** Opens a round, replacing any previous one. Called by the projector. */
  openRound(id, options, chapter = '') {
    this.sql.exec('DELETE FROM round');
    // Clear any votes previously recorded against this id. Round ids are
    // derived from the scene, so restarting a story — or replaying a scene
    // in rehearsal — would otherwise inherit the earlier run's tally.
    this.sql.exec('DELETE FROM vote WHERE round = ?', id);
    this.sql.exec(
      'INSERT INTO round (id, chapter, options, closed) VALUES (?, ?, ?, 0)',
      id, chapter, JSON.stringify(options)
    );
    return this.state();
  }

  closeRound(id) {
    this.sql.exec('UPDATE round SET closed = 1 WHERE id = ?', id);
    return this.state();
  }

  /** One vote per phone per round; a re-tap replaces the earlier choice. */
  castVote(round, voter, option) {
    const open = this.sql
      .exec('SELECT id, closed, options FROM round WHERE id = ?', round)
      .toArray()[0];
    if (!open) return { ok: false, reason: 'no-such-round' };
    if (open.closed) return { ok: false, reason: 'closed' };

    // Reject options that aren't on the ballot. Without this a bad index is
    // stored, counts toward the voter total, but matches no bar — so the
    // projected "N votes in" would disagree with the tally.
    const count = JSON.parse(open.options).length;
    if (!Number.isInteger(option) || option < 0 || option >= count) {
      return { ok: false, reason: 'bad-option' };
    }

    this.sql.exec(
      'INSERT INTO vote (round, voter, option) VALUES (?, ?, ?) ' +
      'ON CONFLICT (round, voter) DO UPDATE SET option = excluded.option',
      round, voter, option
    );
    return { ok: true };
  }

  /** What the phones poll for: the current question, if any. */
  state() {
    const r = this.sql.exec('SELECT * FROM round').toArray()[0];
    if (!r) return { round: null };
    return {
      round: r.id,
      chapter: r.chapter,
      options: JSON.parse(r.options),
      closed: !!r.closed
    };
  }

  /** What the projector polls for: live counts. */
  tally() {
    const r = this.sql.exec('SELECT * FROM round').toArray()[0];
    if (!r) return { round: null, tally: [], voters: 0 };
    const options = JSON.parse(r.options);
    const counts = new Array(options.length).fill(0);
    let voters = 0;
    for (const row of this.sql.exec('SELECT option, COUNT(*) AS n FROM vote WHERE round = ? GROUP BY option', r.id)) {
      // Only on-ballot options count, so `voters` always equals the sum of
      // the bars the audience can see.
      if (row.option >= 0 && row.option < counts.length) {
        counts[row.option] = row.n;
        voters += row.n;
      }
    }
    return { round: r.id, tally: counts, voters, closed: !!r.closed };
  }
}

// Each story gets its own room, so two books could run in parallel without
// their votes colliding.
const roomFor = (env, room) => env.VOTES.getByName(room || 'default');

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Assets are served by the asset layer; only /api/* reaches this code
    // (see run_worker_first in wrangler.jsonc).
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);

    try {
      // Phones poll this for the current question.
      if (url.pathname === '/api/round' && request.method === 'GET') {
        const stub = roomFor(env, url.searchParams.get('room'));
        return json(await stub.state());
      }

      // The projector opens a round.
      if (url.pathname === '/api/round' && request.method === 'POST') {
        const { room, round, options, chapter } = await request.json();
        if (!round || !Array.isArray(options)) return json({ error: 'bad-request' }, 400);
        const stub = roomFor(env, room);
        return json(await stub.openRound(round, options, chapter));
      }

      if (url.pathname === '/api/close' && request.method === 'POST') {
        const { room, round } = await request.json();
        return json(await roomFor(env, room).closeRound(round));
      }

      // A phone casts a vote.
      if (url.pathname === '/api/vote' && request.method === 'POST') {
        const { room, round, option, voter } = await request.json();
        if (typeof option !== 'number' || !voter || !round) {
          return json({ error: 'bad-request' }, 400);
        }
        const result = await roomFor(env, room).castVote(round, voter, option);
        return json(result, result.ok ? 200 : 409);
      }

      // The projector polls this for live counts.
      if (url.pathname === '/api/tally' && request.method === 'GET') {
        const stub = roomFor(env, url.searchParams.get('room'));
        return json(await stub.tally());
      }

      return json({ error: 'not-found' }, 404);
    } catch (err) {
      return json({ error: 'server-error', detail: String(err?.message || err) }, 500);
    }
  }
};
