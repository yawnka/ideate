# Starlit Choices

A responsive, branching K-pop story-mode experience created for presentation night.
Vanilla JavaScript, no framework, built with Vite.

## Run locally

Requires Node `^20.19` or `>=22.12` (Vite 7).

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. `npm run build` writes a production bundle to
`dist/`.

The port is fixed rather than allowed to drift: if something else is already on
5173, Vite stops with an error instead of quietly moving to 5174, which would
otherwise leave you looking at a different project's app.

The plain dev server has no vote backend, so audience voting falls back to a
simulated room — enough to work on the stories and rehearse the flow. To run
the real thing locally, see [Audience voting](#audience-voting).

## The books

| # | Book | Genre | Scenes | Endings |
|---|------|-------|--------|---------|
| 01 | *Three After Midnight* | Office Romance · Love Triangle | 21 | 4 |
| 02 | *The Best Friends Hangout* | Friends-to-Lovers · Beach Reunion | 31 | 3 |
| 03 | *Boyfriend for the Wedding* | Fake Dating · Second Chance | 11 | 3 |

63 scenes and 10 endings in total, with explicit time and location transitions
between beats. Fourteen fictional roles draw on members of BTS, BLACKPINK,
Stray Kids, SEVENTEEN, ATEEZ, TWICE, NewJeans, and LE SSERAFIM.

## Included

- Branching dialogue with chemistry meters, closing routes, and visible choice callbacks
- Audience voting from the room's phones, with live tallies and a manual fallback — see [Audience voting](#audience-voting)
- Save and resume: one in-progress run per book, with a "Continue reading" strip on the home and library pages
- Phone-message threads, simultaneous incoming calls, and animated choice confirmations
- A cast index and per-book casting boards, with a picker for each character's main portrait
- A "Create a book" story-bible form and an in-reader Admin mode for editing scenes, both saved in the browser
- Responsive mobile layouts, keyboard focus states, and reduced-motion support
- Runs without persistence when site data is blocked, rather than failing to load

## Audience voting

Choices can be put to the room instead of clicked by one reader. The projected
screen shows a QR code and live tallies; everyone votes from their own phone,
and the winning option is handed to the normal story engine, so chemistry
meters, routes and endings behave exactly as they do in solo play.

The reader's header carries a **◉ Live vote / ◎ Solo** toggle. Voting is on by
default; the choice persists across scenes and reloads. `?solo` and `?live` in
the URL override it.

### On the night

1. Open the deployed site and start a book.
2. A choice appears — voting is already open, and the countdown is *not*
   running. The room scans the QR (once for the whole evening) and taps.
3. Press **Start the 15s countdown** when everyone is in, or **Close voting
   now** as soon as the room has clearly decided.
4. The result holds on screen, then the story moves on.

Tell people to use cellular rather than venue wifi. Votes travel over ordinary
HTTPS polling — no WebSockets — precisely because captive portals and guest
networks routinely break socket upgrades while leaving plain requests alone,
and polling also recovers by itself when a phone sleeps or changes network.

If the network fails entirely, **Enter a tally by hand** lets the presenter
count raised hands and type the numbers in. The story continues as normal.

One vote per phone per round; tapping a different option moves that vote rather
than adding one.

### Running it locally

`npm run dev` serves no `/api/*`, so the app detects there is no vote server and
simulates an audience. That is deliberate — stories and pacing can be worked on
without any backend. For real phone voting on your own machine:

```bash
npm run vote:dev
```

That builds the site and runs the actual Worker at `http://localhost:8788`,
Durable Object included. Phones on the same network can reach it.

### Deploying

The site and the vote backend deploy together as one Cloudflare Worker:

```bash
npm run deploy
```

The first deploy needs `npx wrangler login` and asks you to pick a `workers.dev`
subdomain. Story edits do not reach the audience until you redeploy.

Free-tier notes: Durable Objects on the free plan must use SQLite storage, which
is what `wrangler.jsonc` declares through its `exports` field. An evening of
voting is a rounding error against the daily limits.

### How it fits together

| File | Role |
|------|------|
| `presentation.js` | The vote panel, round timing, and the manual tally |
| `vote.js` | Vote transport — one interface over the real backend and a simulated room |
| `qr.js` | Renders the join QR |
| `vote/index.html` | The phone-facing page, standalone and dependency-free |
| `worker/index.js` | Cloudflare Worker: serves the build and collects votes |
| `wrangler.jsonc` | Worker config — asset serving, `/api/*` routing, the Durable Object |

The QR encodes the *room* rather than the round, so phones stay on one page all
evening and pick up each new question by polling.

## Portraits

Drop any number of image files into a character's folder under `public/characters/`.
Filenames do not matter and several formats are supported; see
[`public/characters/README.md`](public/characters/README.md) for the details.
The dev server picks up new and removed files automatically. One portrait per
character is chosen at random each session, and the Cast index lets you pin a
specific one. Initials appear until a folder has images.

## Working on the stories

`src.js` holds the story data and the whole engine. The book data is built up in
layers: an initial `stories` array followed by several `Object.assign` passes
that replace earlier drafts. Only the final pass for each book is live, so the
scene ids listed above (`d0`, `f0`, `w0` and their neighbours) are the ones that
run. Editing an earlier draft has no effect — check which pass defines a scene
before changing it.

## Creative and research note

This is fan-made fiction. Character roles draw lightly from public-facing creative traits, performances, songs, and interviews. They do not claim to depict the artists’ private personalities or real relationships.

The research basis included Weverse Magazine interviews with Jungkook, V, Mingyu, Joshua, Kazuha, and Yunjin; British Vogue's ATEEZ interview; Rolling Stone's BLACKPINK group profile; GQ Australia's Felix profile; and published coverage of San's acting work in *Imitation*.
