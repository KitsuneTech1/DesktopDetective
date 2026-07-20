# Desktop Detective

A browser murder-mystery where the crime scene is a suspect's laptop and the evidence is buried in their emails, chats, and files.

## Why this exists

Desktop Detective is an early-stage experiment in narrative-driven investigation games that run entirely in the browser. There is one complete case, one case file format, and a desktop simulation that ties it together. The project is a foundation for writing and shipping more cases without changing the engine.

## Features

- Simulated desktop with draggable, resizable windows
- Seven interactive apps: file explorer, email client, chat app, photo viewer, calendar, browser (history and bookmarks), and recycle bin
- One complete case, "The CEO's Last Meeting" (CASE #2024-001), with six suspects and a single correct accusation
- Investigator tools: a persistent notepad saved to browser local storage, and a snipping tool for capturing screen regions
- Accusation screen with win and lose states, including a full solution reveal and a hint on wrong guesses
- Two locked case slots on the main menu as placeholders for future content
- Static HTML/CSS/JS, no build step required

## Quickstart

Open the file directly:

```bash
open desktop-detective/index.html      # macOS
xdg-open desktop-detective/index.html  # Linux
start desktop-detective\index.html     # Windows
```

Or serve it locally (recommended):

```bash
cd desktop-detective
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

With npm:

```bash
cd desktop-detective
npm install
npm start
```

`npm start` runs `npx serve .`. The `build` script is a no-op placeholder. `npm run deploy` publishes the folder to a `gh-pages` branch via the `gh-pages` package.

## Configuration

No environment variables are required. The game is static and reads no `.env` file. The snipping tool loads `html2canvas` from a CDN (`cdnjs.cloudflare.com`) via a script tag in `index.html`, so that feature needs an internet connection.

## License

MIT. See [LICENSE.md](LICENSE.md).