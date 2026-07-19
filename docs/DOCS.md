# Desktop Detective Technical Reference

## Architecture

Desktop Detective is a single-page application built with vanilla JavaScript, HTML, and CSS. There is no framework, no build step, and no server-side component. All game state lives in memory during a session, with only the player's notes persisted to `localStorage`.

### Key files

- `desktop-detective/index.html` - Entry point. Loads all scripts and styles, defines the desktop and taskbar markup.
- `desktop-detective/js/main.js` - Initializes the desktop, wires up icons, taskbar, and global event listeners.
- `desktop-detective/js/window-manager.js` - Handles window creation, dragging, resizing, z-index ordering, minimize/maximize/close.
- `desktop-detective/js/game-manager.js` - Controls case selection, accusation flow, win/lose screens, and transitions between menu, investigation, and end states.
- `desktop-detective/js/case-data.js` - Contains all narrative content for CASE #2024-001: emails, chat logs, files, photos, calendar events, browser history, recycle bin items, suspect profiles, and the solution.
- `desktop-detective/js/notes-app.js` - The investigator notepad. Reads and writes to `localStorage` under a case-specific key.
- `desktop-detective/js/help-overlay.js` - The help screen accessible from the taskbar.
- `desktop-detective/js/pause-menu.js` - The pause menu with resume, help, and quit options.
- `desktop-detective/js/apps/` - Individual app implementations:
  - `file-explorer.js` - Simulated file system with folders and files.
  - `email-client.js` - Inbox with threaded email view.
  - `chat-app.js` - Direct message conversations.
  - `photo-viewer.js` - Image gallery with captions.
  - `calendar.js` - Month-view calendar with dated events.
  - `browser-history.js` - Browsing history and bookmarks.
  - `evidence-board.js` - Visual evidence board (present in source but not wired into the current case flow).
- `desktop-detective/styles/desktop.css` - Desktop layout, icons, taskbar, window chrome.
- `desktop-detective/styles/apps.css` - Styles for individual app interiors.
- `desktop-detective/package.json` - Contains `start` (`npx serve .`), `build` (no-op placeholder), and `deploy` (`gh-pages -d .`) scripts.

### Data flow

1. `main.js` calls `GameManager` to show the main menu.
2. Player selects a case. `GameManager` loads case data from `case-data.js`.
3. Desktop icons are rendered. Double-clicking an icon calls `WindowManager` to open the corresponding app.
4. Each app reads its data from the loaded case object and renders it into the window.
5. Player takes notes via `NotesApp`, which persists to `localStorage`.
6. Player clicks "Accuse" in the taskbar. `GameManager` shows the accusation screen with suspect data.
7. On accusation, `GameManager` compares the selected suspect against the case's `killer` field and shows the appropriate end screen.

## API / CLI / MCP Tools

Desktop Detective has no API, no CLI, and no MCP server. It is a client-only browser application.

## Configuration

There are no environment variables, config files, or runtime flags. The application is entirely self-contained.

### External dependency

The snipping tool uses `html2canvas` loaded from CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
```

This is the only external resource. The snipping feature will fail silently if the CDN is unreachable. All other features work offline.

## Data model

### Case structure

Each case is a JavaScript object defined in `case-data.js` with this shape:

- `id` - Case identifier string (e.g., `"case-2024-001"`)
- `title` - Display title
- `briefing` - HTML string shown on the case intro screen
- `suspects` - Array of objects with `name`, `relation`, and `description`
- `killer` - Index into the `suspects` array identifying the guilty party
- `solution` - HTML string shown on the win screen explaining motive and method
- `hints` - Object mapping suspect indices to hint strings shown on wrong accusation
- `fileSystem` - Nested object representing folders and files for the file explorer
- `emails` - Array of email thread objects
- `chats` - Array of chat conversation objects
- `photos` - Array of photo objects with `src` and `caption`
- `calendarEvents` - Array of events with `date` and `description`
- `browserHistory` - Array of history entries with `title`, `url`, and `date`
- `bookmarks` - Array of bookmark objects
- `recycleBin` - Array of deleted file objects

### Notes persistence

Notes are saved to `localStorage` with a key derived from the case ID: `desktop-detective-notes-{caseId}`. The value is a plain text string.

## Deploy

### Static hosting

Copy the contents of `desktop-detective/` to any static web server. No build step is required.

### GitHub Pages

Point GitHub Pages at the `desktop-detective/` folder (Settings > Pages > deploy from branch, folder `/desktop-detective`). Alternatively, copy the folder contents to the repo root or a `docs/` folder.

### npm deploy script

`npm run deploy` runs `gh-pages -d .` from within `desktop-detective/`, publishing the folder to a `gh-pages` branch.

## Gotchas

- **Snipping tool needs internet.** The `html2canvas` library loads from CDN. If the player is offline, the snip button does nothing. There is no fallback or error message.
- **file:// restrictions.** Opening `index.html` directly may cause issues with `localStorage` or resource loading in some browsers. Use a local server for the intended experience.
- **No mobile support.** The desktop UI assumes a mouse and a screen width of at least 1024px. Windows will overflow or become unusable on small screens.
- **Single case only.** The main menu shows three case slots, but only CASE #2024-001 is implemented. The other two show a "locked" message and cannot be played.
- **No save/load for game progress.** Only notes persist. If the player refreshes or closes the browser during an investigation, they return to the main menu and must start the case over.
- **Evidence board is unused.** `evidence-board.js` exists in the source but is not integrated into the current game flow.
- **`npm run build` is a no-op.** It echoes a message and exits. There is no bundling, minification, or compilation step.