# Desktop Detective

A browser-based murder-mystery game where you investigate a crime by digging through a simulated suspect's laptop.

## Why this exists

Desktop Detective is an experiment in narrative-driven investigation games that run entirely in the browser with no backend. The game presents a fake desktop environment filled with interconnected clues across emails, chat logs, files, photos, and browser history. One case is fully playable now, with room for more.

## Features

- Simulated desktop with draggable, resizable windows
- Seven interactive apps: file explorer, email client, messaging app, photo viewer, calendar, browser (history and bookmarks), and recycle bin
- One complete case: "The CEO's Last Meeting" with six suspects and a single killer
- Built-in notepad that saves to browser local storage
- Snipping tool for capturing evidence screenshots (requires internet for html2canvas CDN)
- Accusation system with win and lose screens, including hints on wrong guesses
- No build step: static HTML, CSS, and JavaScript

## Quickstart

Open the game directly in a browser:

```bash
open desktop-detective/index.html      # macOS
xdg-open desktop-detective/index.html  # Linux
start desktop-detective\index.html     # Windows
```

Or serve it locally (recommended, avoids file:// restrictions):

```bash
cd desktop-detective
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

Using npm:

```bash
cd desktop-detective
npm install
npm start
```

`npm start` runs `npx serve .` and serves the folder on a local port.

## Configuration

There are no environment variables or configuration files. The game is self-contained static content. The snipping tool loads `html2canvas` from `cdnjs.cloudflare.com` via a script tag in `index.html`, so that feature needs an internet connection. Everything else works offline.

## License

MIT. See [LICENSE.md](LICENSE.md).