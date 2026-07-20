# Desktop Detective

A browser-based murder-mystery game where you investigate a crime by digging through a simulated suspect's laptop.

## Why this exists

Desktop Detective is an experiment in narrative-driven investigation games that run entirely in the browser with no backend. The goal is to make a mystery that rewards careful reading and cross-referencing across multiple simulated apps, rather than puzzle minigames or inventory combinations. The project is in early stages: one case is playable, and the structure is in place for more.

## Features

- Simulated desktop environment with draggable, resizable windows
- Seven interactive apps: file explorer, email client, messaging app, photo viewer, calendar, browser (history and bookmarks), and recycle bin
- One complete case, "The CEO's Last Meeting" (CASE #2024-001), with six suspects and a full narrative spread across all apps
- Built-in investigator tools: a notepad that persists to browser local storage, and a snipping tool for capturing evidence screenshots
- Accusation system with win and lose screens, including a full solution breakdown on a correct accusation
- Runs as static HTML/CSS/JS with no build step or server required

## Quickstart

### Open directly

```bash
open desktop-detective/index.html      # macOS
xdg-open desktop-detective/index.html  # Linux
start desktop-detective\index.html     # Windows
```

### Local web server (recommended)

```bash
cd desktop-detective
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

### npm scripts

```bash
cd desktop-detective
npm install
npm start
```

`npm start` runs `npx serve .` and serves the folder on a local port. There is no real build step; `npm run build` is a placeholder. `npm run deploy` publishes to a `gh-pages` branch via the `gh-pages` package.

## Configuration

No environment variables or configuration files are required. The game is static and self-contained. The snipping tool loads `html2canvas` from a CDN (`cdnjs.cloudflare.com`), so that feature needs an internet connection.

## License

MIT. See [LICENSE.md](LICENSE.md).