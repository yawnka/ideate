# Starlit Choices

A responsive, branching K-pop story-mode experience created for presentation night.
Vanilla JavaScript, no framework, built with Vite.

## Run locally

Requires Node `^20.19` or `>=22.12` (Vite 7).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://127.0.0.1:5173`).
`npm run build` writes a production bundle to `dist/`.

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
- Save and resume: one in-progress run per book, with a "Continue reading" strip on the home and library pages
- Phone-message threads, simultaneous incoming calls, and animated choice confirmations
- A cast index and per-book casting boards, with a picker for each character's main portrait
- A "Create a book" story-bible form and an in-reader Admin mode for editing scenes, both saved in the browser
- Responsive mobile layouts, keyboard focus states, and reduced-motion support
- Runs without persistence when site data is blocked, rather than failing to load

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
