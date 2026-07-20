# Desktop Detective Technical Reference

## Architecture

Desktop Detective is a single-page static web application with no backend. All game logic runs in the browser.

### File structure

```
desktop-detective/
  index.html              # Entry point, loads all scripts and styles
  js/
    main.js               # Boot sequence, desktop icon setup, taskbar wiring
    game-manager.js       # Case selection, accusation flow, win/lose screens
    window-manager.js     # Window creation, dragging, resizing, z-index, minimize/maximize/close
    case-data.js          # All narrative content for CASE #2024-001
    apps/
      file-explorer.js    # My Files app: folder tree and file contents
      email-client.js     # Email app: inbox list and email thread view
      chat-app.js         # Messages app: contact list and DM conversation view
      photo-viewer.js     # Photos app: thumbnail grid and full-size viewer
      calendar.js         # Calendar app: month grid with dated events
      browser-history.js  # Browser app: search history and bookmarks
      evidence-board.js   # Evidence board (unused in current case)
    notes-app.js          # Investigator notepad with local storage persistence
    help-overlay.js       # Help overlay content
    pause-menu.js         # Pause menu (settings, return to menu)
  styles/
    desktop.css           # Desktop, taskbar, window chrome, icons
    apps.css              # App-specific interior styling
  package.json            # npm scripts for serving and deploying
```

### Data flow

1. `index.html` loads all scripts and styles, then calls `window.initDesktop()` from `main.js`.
2. `main.js` renders desktop icons and wires their double-click handlers to `windowManager.openApp()`.
3. `windowManager.openApp()` creates a window div and calls the corresponding app init function (e.g., `initFileExplorer()`), passing the window element.
4. Each app function populates its window with HTML generated from the data in `case-data.js`.
5. `game-manager.js` handles the accusation screen. When the player accuses a suspect, it compares against the correct answer defined in `case-data.js` and shows the win or lose screen.
6. `notes-app.js` reads and writes to `localStorage` under a key specific to the case.

## API / CLI / MCP Tools

Desktop Detective has no API, CLI, or MCP server. It is a client-only browser application.

## Configuration

No environment variables. No configuration files. The application is entirely static.

The snipping tool depends on `html2canvas` loaded from:
```
https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
```
This script tag is in `index.html`. The snipping feature will fail if the CDN is unreachable.

## Data model

All case content lives in `desktop-detective/js/case-data.js`. The file exports a single `caseData` object with this shape:

- `caseData.title` - Case display name
- `caseData.briefing` - HTML string shown on the case intro screen
- `caseData.suspects` - Array of objects with `id`, `name`, `relation`, and `isGuilty` (boolean)
- `caseData.solution` - HTML string shown on the win screen
- `caseData.hints` - Object mapping suspect IDs to hint strings shown on lose screens
- `caseData.apps` - Object containing all app content:
  - `fileExplorer` - Folder tree with files, each file has `name` and `content` (HTML string)
  - `emailClient` - Array of email thread objects with `subject`, `participants`, and `messages` (array of `{from, to, date, body}`)
  - `chatApp` - Array of contact objects with `name` and `messages` (array of `{sender, text, time}`)
  - `photoViewer` - Array of photo objects with `src`, `caption`, and `date`
  - `calendar` - Object with month/year and `events` array (`{date, title, description}`)
  - `browserHistory` - Object with `history` array and `bookmarks` array
  - `recycleBin` - Array of deleted file objects with `name` and `content`

Notes are stored in `localStorage` under a key derived from the case ID.

## Deploy

### GitHub Pages

Point GitHub Pages at the `desktop-detective/` folder (Settings > Pages > deploy from branch, folder `/desktop-detective`). No build step is needed.

### Any static host

Serve the contents of `desktop-detective/` from any static file server (Netlify, Vercel, S3, nginx, etc.). The entry point is `index.html`.

### npm deploy

```bash
cd desktop-detective
npm run deploy
```

This runs `gh-pages -d .` and publishes the folder to the `gh-pages` branch of the repository.

## Gotchas

- The snipping tool requires an internet connection to load `html2canvas` from CDN. Everything else works fully offline.
- Opening `index.html` directly via `file://` may cause issues with localStorage or font loading in some browsers. A local server is recommended.
- The evidence board app (`evidence-board.js`) exists in the codebase but is not wired into the current case. It is a placeholder for future use.
- Two locked case slots appear on the main menu but have no associated data or logic. They are UI placeholders.
- There is no evidence-count enforcement. The accusation screen is always accessible regardless of how much the player has explored.
- Notes are scoped to the current case in localStorage. Clearing browser data will delete them.