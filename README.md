# Starlit Choices

A responsive, branching K-pop story-mode experience created for presentation night.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://127.0.0.1:5173`).

## Included

- Three cliché-forward romance books: *Three After Midnight*, *My Best Friend’s Brother*, and *Boyfriend for the Wedding*
- 19 connected scenes with explicit time/location transitions and 2–3 endings per book
- Branching dialogue, relationship/clue/loyalty state, and visible choice callbacks
- Animated choice confirmation, scene arrivals, and phone-message sequences
- Sixteen fictional roles featuring members from BTS, BLACKPINK, Stray Kids, SEVENTEEN, ATEEZ, TWICE, NewJeans, and LE SSERAFIM
- Local cast-portrait folders with graceful initial-based fallbacks
- A cast index and per-book casting boards
- A “Create a book” story-bible form and in-reader Admin mode with browser-local saving
- Responsive mobile layouts, keyboard focus states, and reduced-motion support

## Creative and research note

This is fan-made fiction. Character roles draw lightly from public-facing creative traits, performances, songs, and interviews. They do not claim to depict the artists’ private personalities or real relationships.

The research basis included Weverse Magazine interviews with Jungkook, V, Mingyu, Joshua, Kazuha, and Yunjin; British Vogue's ATEEZ interview; Rolling Stone's BLACKPINK group profile; GQ Australia's Felix profile; and published coverage of San's acting work in *Imitation*.

To add portraits, place a PNG named `portrait.png` in each folder under `public/characters/`. Every folder contains a reminder file, and `public/characters/README.md` documents the recommended dimensions. Initials appear automatically until its PNG is added.
