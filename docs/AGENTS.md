# Agent Guide: Desktop Detective

## Orientation

Desktop Detective is a static browser game. There is no server, no build pipeline, no database, and no API. Everything is HTML, CSS, and vanilla JavaScript in the `desktop-detective/` folder. The entry point is `desktop-detective/index.html`.

## How to run and test

### Start a local server

```bash
cd desktop-detective
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. This is the recommended way to test because `file://` can break localStorage or font loading.

### npm alternative

```bash
cd desktop-detective
npm install
npm start
```

This runs `npx serve .` and prints the local URL.

### Testing

There are no automated tests. Manual testing means:

1. Load the page and confirm the main menu shows three case slots (one playable, two locked).
2. Click the playable case, read the briefing, and click "Begin Investigation."
3. Double-click each desktop icon and verify the app window opens with content.
4. Drag, resize, minimize, maximize, and close windows to confirm window manager behavior.
5. Open the Notes tool, type something, close it, reopen it, and confirm the text persisted.
6. Use the Snip tool to capture a region and confirm the screenshot appears in Notes.
7. Click Accuse, select a suspect, and confirm the win or lose screen appears correctly.
8. Test the wrong-accusation flow: accuse a non-guilty suspect, verify the hint appears, return to menu, and confirm the case can be replayed.

## What an agent must know to work here safely

### Do not modify case-data.js casually

`desktop-detective/js/case-data.js` contains the entire narrative for CASE #2024-001. Changing suspect names, the `isGuilty` flag, or app content will break the mystery's internal consistency. The solution text and hints must stay aligned with the actual guilty suspect.

### Window manager is the backbone

`desktop-detective/js/window-manager.js` handles all window creation, z-index stacking, dragging, resizing, minimize/maximize/close, and taskbar buttons. Every app depends on it. If you add a new app, you must:

1. Create the app init function (e.g., `initMyNewApp(windowEl)`).
2. Register it in `windowManager.openApp()` by adding a case for the app name.
3. Add a desktop icon in `main.js` that calls `windowManager.openApp('mynewapp')`.

### Apps follow a consistent pattern

Each app in `desktop-detective/js/apps/` exports an init function that receives a window DOM element. The function:

1. Sets the window's inner HTML to the app's chrome (sidebar, toolbar, content area).
2. Populates content from `caseData.apps.<appName>`.
3. Attaches event listeners for navigation within the app (e.g., clicking an email thread, selecting a folder).

Follow this pattern when adding apps.

### Notes use localStorage

`desktop-detective/js/notes-app.js` reads and writes to `localStorage` with a key like `desktopDetective_notes_<caseId>`. If you change the case ID structure, update the key. Notes are the only persistent state in the game.

### Snipping tool depends on external CDN

`index.html` loads `html2canvas` from `cdnjs.cloudflare.com`. If the CDN is unavailable, the Snip button will fail silently or throw. Do not remove that script tag without replacing the snipping implementation.

### The two locked case slots are placeholders

The main menu shows three case slots. Only the first is functional. The other two are hardcoded in `main.js` with a "locked" class and a click handler that shows an alert. There is no data or logic behind them. If you add a second case, you will need to create a new case data object and wire it into `game-manager.js`.

### No build step

The `build` script in `package.json` is a no-op. `npm run deploy` uses `gh-pages` to publish the folder as-is. Do not introduce a build step without updating the deploy script and documentation.

## Common call shape (if exposing an API)

Desktop Detective does not expose an HTTP API or MCP server. It is a client-only application. If you add one, document the endpoints here.