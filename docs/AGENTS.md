# Agent guide for Desktop Detective

## Orientation

Desktop Detective is a static browser game. There is no server, no database, no build step, and no framework. The entire application is HTML, CSS, and vanilla JS inside the `desktop-detective/` directory. The entry point is `index.html`. All case content is a single JS object in `js/case-data.js`. The game simulates a desktop with draggable windows, each window being an app that renders its slice of the case data.

## How to run and test

Start a local server from the `desktop-detective/` directory:

```bash
cd desktop-detective
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. There are no automated tests. Manual testing means clicking through the case, opening every app, taking notes, using the snipping tool, and making an accusation.

## What an agent must know to work here safely

- **Do not add a build step.** The project is intentionally zero-build. The `build` script in `package.json` is a no-op placeholder. Keep it that way.
- **Case data is the single source of truth.** All narrative content lives in `js/case-data.js`. When adding a new case, follow the exact shape of `CASE_2024_001`. The game manager and app modules read from that shape.
- **The two locked case slots are placeholders.** They are hardcoded in `js/game-manager.js`. Unlocking them means adding real case data and updating the menu logic, not just flipping a flag.
- **localStorage is used for notes only.** The notes app saves text under a case-scoped key. Do not store game state or progress there unless you also update the game manager to read it.
- **The snipping tool needs the CDN.** `html2canvas` is loaded from `cdnjs.cloudflare.com` in `index.html`. If you vendor it, update the script tag.
- **No secrets exist.** There is no `.env` file, no API keys, no authentication. Do not introduce any.
- **The evidence board app is present but not wired in.** `js/apps/evidence-board.js` exists. It is not part of the main case flow for CASE #2024-001. If you integrate it, you will need to add evidence board data to the case object and create a window for it in the window manager.

## Common call shape

There is no API or MCP server. All interaction is through the DOM. The window manager is the central hub for creating app windows. The pattern for opening an app is:

1. A desktop icon or taskbar button calls `windowManager.createWindow(appName, title, contentElement)`.
2. The app module builds a DOM element and returns it.
3. The window manager wraps it in a draggable window chrome and adds it to the desktop.

If you need to programmatically trigger an accusation for testing, call the relevant method on the `gameManager` instance, which is created in `js/main.js`.