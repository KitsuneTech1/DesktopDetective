# Agent Guide for Desktop Detective

## Orientation

Desktop Detective is a static browser game with no backend, no framework, and no build step. All logic is vanilla JavaScript split across modules in `desktop-detective/js/`. The entry point is `desktop-detective/index.html`. Game narrative data lives in `desktop-detective/js/case-data.js`.

## How to run and test

Serve the `desktop-detective/` directory with any static file server:

```bash
cd desktop-detective
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser. There are no automated tests. Manual testing means playing through the case: open apps, read content, take notes, make an accusation, verify win and lose screens.

## What an agent must know to work safely here

### 1. This is a narrative game, not a production app

All "bugs" related to story consistency are by design. Red herrings, contradicting alibis, and misleading clues are intentional. Do not "fix" narrative inconsistencies unless explicitly asked.

### 2. Case data is the single source of truth

`case-data.js` contains all game content. If you add a new case, follow the existing structure exactly. The `killer` field is an index into the `suspects` array. The `hints` object maps suspect indices to hint strings. The `solution` field is HTML shown on the win screen.

### 3. Window management is fragile

`window-manager.js` handles z-index, dragging, resizing, minimize, maximize, and close. Windows are absolutely positioned divs. Changing the desktop layout CSS can break window positioning. Test window behavior after any CSS changes to `desktop.css` or `apps.css`.

### 4. Notes are the only persisted state

`notes-app.js` uses `localStorage` with keys like `desktop-detective-notes-case-2024-001`. Everything else is in-memory and lost on refresh. If you add save/load for game progress, you will need to serialize the full game state.

### 5. The snipping tool depends on an external CDN

`index.html` loads `html2canvas` from `cdnjs.cloudflare.com`. If you modify the snipping feature, keep the CDN dependency in mind. Do not bundle it without updating the script tag.

### 6. No framework, no module system

Scripts are loaded via `<script>` tags in `index.html` and attach to the global `window` object. There is no import/export, no bundler, no package manager for runtime dependencies. `package.json` only exists for the `serve` and `gh-pages` dev scripts.

### 7. Adding a new case

To add a playable case:

1. Add a new case object to `case-data.js` following the existing structure.
2. Update `game-manager.js` to register the new case in the case selection flow.
3. Update the main menu markup in `index.html` to make the case slot clickable.
4. Populate all data fields: `fileSystem`, `emails`, `chats`, `photos`, `calendarEvents`, `browserHistory`, `bookmarks`, `recycleBin`, `suspects`, `killer`, `solution`, `hints`.

### 8. Common call shape

There is no API or MCP server. All interactions are DOM events. The main entry points for programmatic interaction are:

- `GameManager.startCase(caseId)` - Begins a case investigation
- `GameManager.makeAccusation(suspectIndex)` - Triggers win/lose flow
- `WindowManager.openWindow(appName, title, content)` - Opens a new window
- `NotesApp.saveNotes(text)` - Persists notes to localStorage
- `NotesApp.loadNotes()` - Reads notes from localStorage

These are attached to `window` and can be called from the browser console for testing.