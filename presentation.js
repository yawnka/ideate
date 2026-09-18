// Presentation mode: turns a story choice into a live audience vote.
//
// Deliberately additive. The reader renders its normal `.choices` buttons
// unless presentation mode is on, and a finished vote resolves to an option
// index that is handed straight to the existing choose(), so every piece of
// story logic (chemistry meters, route selection, endings) is untouched.

import { qrSvg } from './qr.js';
import { openRound, closeRound, getTally, getVoterCount, onUpdate, voteUrl, voteBackendName, setVoteBackend } from './vote.js';

export const ROUND_SECONDS = 15;

// How long the winning bar stays lit before the story's own consequence card
// takes over. Kept short because that card is the real payoff beat and holds
// for several seconds itself — two long pauses back to back is dead air.
export const RESULT_HOLD_MS = 1800;

// Real phone voting is the default wherever the vote API actually exists,
// so nobody has to remember a URL flag on the night. The plain Vite dev
// server has no /api/*, so it falls back to the stub automatically.
//
//   ?demo  force the simulated audience (rehearsing, or a dead network)
//   ?live  force real voting (e.g. while testing against `wrangler dev`)
(() => {
  const flags = new URLSearchParams(location.search);
  if (flags.has('demo')) return setVoteBackend('stub');
  if (flags.has('live')) return setVoteBackend('live');

  // Otherwise probe for the vote API itself rather than guessing from the
  // hostname or port: it answers on the Worker (deployed or `wrangler dev`)
  // and 404s through Vite's SPA fallback, which is exactly the distinction
  // that matters. Optimistically start live so the first round is never
  // stubbed, and drop back only if the probe says there is no API.
  setVoteBackend('live');
  fetch('/api/round?room=__probe', { cache: 'no-store' })
    .then(res => res.json())
    .then(data => { if (!('round' in data)) throw new Error('no api'); })
    .catch(() => setVoteBackend('stub'));
})();

let active = null;   // the in-flight round, if any
let unsubscribe = null;

export function isPresenting(state) { return !!state.presenting; }

/** Escapes text for safe interpolation into the vote markup. */
const esc = s => String(s).replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

/**
 * Markup for the vote panel, replacing the usual choice buttons.
 * `options` is the visibleChoices() result: [choice, originalIndex] pairs.
 */
export function votePanel(options, roundId, room) {
  // The QR encodes the ROOM and stays identical all evening, so the audience
  // scans once at the start rather than re-scanning at every scene.
  const url = voteUrl(room);
  const bars = options.map(([c, i], n) => `
    <div class="vote-row" data-vote-row="${n}">
      <b>${String.fromCharCode(65 + i)}</b>
      <div class="vote-bar-wrap">
        <span class="vote-label">${esc(c[0])}</span>
        <i class="vote-bar"><em style="width:0%"></em></i>
      </div>
      <strong class="vote-count">0</strong>
    </div>`).join('');

  return `
    <div class="vote-panel" data-vote-panel>
      <div class="vote-head">
        <div>
          <span class="vote-eyebrow">AUDIENCE VOTE</span>
          <h3>What should they do?</h3>
        </div>
        <div class="vote-timer" data-vote-timer>
          <span data-vote-seconds>${ROUND_SECONDS}</span>
          <small>seconds</small>
        </div>
      </div>
      <div class="vote-open-note" data-vote-open-note>
        <span>✦ Voting is open — the clock starts when you are ready.</span>
      </div>
      <div class="vote-body">
        <div class="vote-join">
          <div class="vote-qr">${qrSvg(url, { size: 190 })}</div>
          <p class="vote-url">${esc(url.replace(/^https?:\/\//, ''))}</p>
          <p class="vote-joined"><b data-vote-voters>0</b> votes in${voteBackendName() === 'stub' ? ' <i>· demo</i>' : ''}</p>
        </div>
        <div class="vote-bars">${bars}</div>
      </div>
      <div class="vote-result" data-vote-result hidden></div>
      <div class="vote-foot">
        <button class="vote-start primary" data-vote-start>Start the ${ROUND_SECONDS}s countdown →</button>
        <button class="vote-skip" data-vote-skip>Close voting now</button>
        <button class="vote-manual" data-vote-manual>Enter a tally by hand</button>
      </div>
    </div>`;
}

/**
 * Runs a vote round against the mounted panel, then calls `onResolved(index)`
 * with the winning ORIGINAL choice index.
 */
export function runRound(roundId, options, onResolved, meta = {}) {
  stopRound();

  const root = document.querySelector('[data-vote-panel]');
  if (!root) return;

  openRound(roundId, options.length, {
    room: meta.room,
    chapter: meta.chapter,
    labels: options.map(([c]) => c[0])
  });

  const secondsEl = root.querySelector('[data-vote-seconds]');
  const timerEl = root.querySelector('[data-vote-timer]');
  const votersEl = root.querySelector('[data-vote-voters]');
  const rows = [...root.querySelectorAll('[data-vote-row]')];

  let remaining = ROUND_SECONDS;
  let finished = false;
  let tick = null;   // null until the presenter starts the countdown

  const paint = () => {
    const tally = getTally();
    const total = tally.reduce((a, b) => a + b, 0);
    const leader = Math.max(...tally, 0);
    rows.forEach((row, n) => {
      const count = tally[n] || 0;
      // Bars are scaled against the leader, not the total, so an early
      // single vote doesn't slam a bar to full width.
      const pct = leader > 0 ? (count / leader) * 100 : 0;
      row.querySelector('.vote-bar em').style.width = `${pct}%`;
      row.querySelector('.vote-count').textContent = count;
      row.classList.toggle('leading', count > 0 && count === leader);
    });
    if (votersEl) votersEl.textContent = total;
  };

  unsubscribe = onUpdate((_, meta) => {
    if (meta?.offline) root.classList.add('vote-offline');
    paint();
  });
  paint();

  // The round opens for voting immediately — phones can join and tap — but
  // the clock does not run until the presenter starts it. Otherwise the
  // countdown is already draining while the room is still finding the QR.
  function startCountdown() {
    if (tick || finished) return;
    root.classList.add('vote-running');
    if (secondsEl) secondsEl.textContent = remaining;
    tick = setInterval(() => {
      remaining--;
      if (secondsEl) secondsEl.textContent = Math.max(0, remaining);
      // Scale the final warning to the round length (a third, capped at 10s)
      // so it lands in the same place if ROUND_SECONDS is ever retuned.
      if (remaining <= Math.min(10, Math.ceil(ROUND_SECONDS / 3))) {
        timerEl?.classList.add('urgent');
      }
      if (remaining <= 0) finish();
    }, 1000);
  }

  function finish() {
    if (finished) return;
    finished = true;
    clearInterval(tick);

    const tally = getTally();
    const total = tally.reduce((a, b) => a + b, 0);
    const best = Math.max(...tally);
    // A tie — or a silent room — is broken at random among the top options,
    // so the story always moves and never stalls on stage.
    const top = tally.map((v, i) => [v, i]).filter(([v]) => v === best).map(([, i]) => i);
    const winner = total === 0
      ? Math.floor(Math.random() * options.length)
      : top[Math.floor(Math.random() * top.length)];

    rows.forEach((row, n) => row.classList.toggle('won', n === winner));
    root.classList.add('vote-locked');

    // Announce the result, so the hold reads as a deliberate beat rather
    // than the screen having frozen.
    const banner = root.querySelector('[data-vote-result]');
    if (banner) {
      const label = options[winner][0][0];
      banner.innerHTML = `<small>THE ROOM CHOSE</small><strong>${esc(label)}</strong>`;
      banner.hidden = false;
    }

    closeRound();
    unsubscribe?.();
    unsubscribe = null;
    active = null;

    // Hold the result so the room can see what won and react to it.
    setTimeout(() => onResolved(options[winner][1]), RESULT_HOLD_MS);
  }

  root.querySelector('[data-vote-start]')?.addEventListener('click', startCountdown);
  // Ending the vote early implies starting it, so one button works whether
  // or not the clock was ever running.
  root.querySelector('[data-vote-skip]')?.addEventListener('click', finish);
  root.querySelector('[data-vote-manual]')?.addEventListener('click', () => {
    openManualTally(options, index => {
      clearInterval(tick);
      finished = true;
      closeRound();
      unsubscribe?.();
      unsubscribe = null;
      active = null;
      rows.forEach((row, n) => row.classList.toggle('won', n === index));
      root.classList.add('vote-locked');
      const banner = root.querySelector('[data-vote-result]');
      if (banner) {
        banner.innerHTML = `<small>THE ROOM CHOSE</small><strong>${esc(options[index][0][0])}</strong>`;
        banner.hidden = false;
      }
      setTimeout(() => onResolved(options[index][1]), RESULT_HOLD_MS);
    });
  });

  active = { finish };
}

export function stopRound() {
  closeRound();
  unsubscribe?.();
  unsubscribe = null;
  active = null;
}

/**
 * The wifi-failure escape hatch: the presenter counts hands and types the
 * numbers in. Worth the few lines — it turns a dead network into a hiccup
 * rather than a dead demo.
 */
function openManualTally(options, onPick) {
  const wrap = document.createElement('div');
  wrap.className = 'modal-wrap manual-tally';
  wrap.innerHTML = `
    <div class="modal">
      <button class="close" aria-label="Cancel">×</button>
      <h2>Count the room</h2>
      <p>Type how many hands went up for each option.</p>
      ${options.map(([c, i], n) => `
        <label>${String.fromCharCode(65 + i)} · ${esc(c[0])}
          <input type="number" min="0" value="0" data-manual="${n}" inputmode="numeric">
        </label>`).join('')}
      <button class="primary" data-manual-lock>Lock in the winner</button>
    </div>`;
  document.body.appendChild(wrap);
  wrap.querySelector('input')?.focus();

  const close = () => wrap.remove();
  wrap.querySelector('.close').onclick = close;
  wrap.onclick = e => { if (e.target === wrap) close(); };
  wrap.querySelector('[data-manual-lock]').onclick = () => {
    const counts = [...wrap.querySelectorAll('[data-manual]')].map(i => Number(i.value) || 0);
    const best = Math.max(...counts);
    const top = counts.map((v, i) => [v, i]).filter(([v]) => v === best).map(([, i]) => i);
    const winner = top[Math.floor(Math.random() * top.length)];
    close();
    onPick(winner);
  };
}
