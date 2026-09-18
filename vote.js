// Audience voting transport.
//
// Two implementations behind one interface, so the presentation UI never
// knows which is running: `stub` fakes a room of phones locally, `live`
// talks to the Cloudflare Worker. Swap with `setVoteBackend('live')`.
//
// The contract is deliberately small:
//   openRound(roundId, optionCount) -> begin collecting, reset tallies
//   getTally()                      -> [n, n, ...] counts, index-aligned
//   getVoterCount()                 -> how many phones have joined
//   closeRound()                    -> stop collecting
//   onUpdate(fn)                    -> called whenever tallies change

const listeners = new Set();
let backend = 'stub';
let round = null;

// ---------------------------------------------------------------- stub ----
// Simulates an audience so the whole flow is demoable with no network.
// Voters trickle in with staggered timers rather than arriving at once,
// which is what makes the projected bars race the way a real room does.

const stub = {
  voters: 0,
  tally: [],
  timers: [],
  bias: [],

  open(optionCount, _roundId, _meta) {
    this.clear();
    this.tally = new Array(optionCount).fill(0);
    // A random popularity weight per option, so results differ each round
    // and occasionally land nail-bitingly close.
    this.bias = Array.from({ length: optionCount }, () => 0.25 + Math.random());
    this.voters = 18 + Math.floor(Math.random() * 45);

    const total = this.voters;
    const weightSum = this.bias.reduce((a, b) => a + b, 0);
    for (let i = 0; i < total; i++) {
      // Spread arrivals across the first ~70% of a 15s round.
      const at = 250 + Math.random() * 9000;
      this.timers.push(setTimeout(() => {
        let r = Math.random() * weightSum;
        let pick = 0;
        for (let k = 0; k < this.bias.length; k++) {
          r -= this.bias[k];
          if (r <= 0) { pick = k; break; }
        }
        this.tally[pick]++;
        emit();
      }, at));
    }
  },

  clear() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }
};

// ---------------------------------------------------------------- live ----
// Polls the Worker. Polling (not WebSockets) is deliberate: venue wifi and
// captive portals routinely pass plain HTTPS but break socket upgrades, and
// polling recovers invisibly when a phone locks or switches to cellular.

const live = {
  tally: [],
  voters: 0,
  poll: null,
  failures: 0,

  open(optionCount, roundId, meta = {}) {
    this.tally = new Array(optionCount).fill(0);
    this.voters = 0;
    this.failures = 0;
    clearInterval(this.poll);

    // Publish the question so phones can render the real option text.
    fetch('/api/round', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        room: meta.room,
        round: roundId,
        options: meta.labels || [],
        chapter: meta.chapter || ''
      })
    }).catch(() => {});

    this.poll = setInterval(() => this.fetchTally(roundId, optionCount, meta.room), 1000);
  },

  async fetchTally(roundId, optionCount, room) {
    try {
      const res = await fetch(`/api/tally?room=${encodeURIComponent(room || '')}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      // Ignore a stale response for a round we have already moved past.
      if (data.round && data.round !== roundId) return;
      this.tally = Array.from({ length: optionCount }, (_, i) => data.tally?.[i] || 0);
      this.voters = data.voters || 0;
      this.failures = 0;
      emit();
    } catch {
      // A blip is normal; only surface sustained failure so the presenter
      // knows to reach for the manual tally.
      if (++this.failures === 5) emit({ offline: true });
    }
  },

  close(roundId, room) {
    fetch('/api/close', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ room, round: roundId })
    }).catch(() => {});
  },

  clear() { clearInterval(this.poll); this.poll = null; }
};

// ------------------------------------------------------------ interface ----

function impl() { return backend === 'live' ? live : stub; }
function emit(meta = {}) { listeners.forEach(fn => fn(getTally(), meta)); }

export function setVoteBackend(name) {
  backend = name === 'live' ? 'live' : 'stub';
}

export function voteBackendName() { return backend; }

/**
 * Begins collecting votes.
 * `meta` carries what the phones need to render the question:
 * { room, labels: string[], chapter }.
 */
export function openRound(roundId, optionCount, meta = {}) {
  // Tear down the previous round locally WITHOUT telling the server to
  // close: the server is about to be handed a brand-new round, and racing a
  // close against that open would land the phones on a closed question.
  impl().clear();
  round = { id: roundId, options: optionCount, room: meta.room };
  impl().open(optionCount, roundId, meta);
  emit();
}

/** Stops the round and tells the server to stop accepting votes for it. */
export function closeRound() {
  if (round && backend === 'live') live.close(round.id, round.room);
  impl().clear();
  round = null;
}

export function getTally() {
  const t = impl().tally;
  return round ? Array.from({ length: round.options }, (_, i) => t[i] || 0) : [];
}

export function getVoterCount() { return impl().voters || 0; }

export function onUpdate(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// The phone-facing URL. Points at this same origin so the QR code works
// against the dev server today and the deployed Worker later. The hash is
// the ROOM, not the round: phones stay on one page all evening and pick up
// each new question by polling.
export function voteUrl(room) {
  return `${location.origin}/vote/#${encodeURIComponent(room)}`;
}
