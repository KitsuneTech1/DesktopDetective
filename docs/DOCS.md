# Desktop Detective technical reference

## Architecture

Desktop Detective is a single-page application built with vanilla HTML, CSS, and JavaScript. There is no framework, no build pipeline, and no server-side component. The entry point is `desktop-detective/index.html`, which loads styles from `styles/desktop.css` and `styles/apps.css`, and scripts from `js/main.js` and several app modules.

Key files and their roles:

- `desktop-detective/index.html` - shell markup for the desktop, taskbar, main menu, and accusation screen.
- `desktop-detective/js/main.js` - boot sequence: initializes the window manager, game manager, and desktop icons.
- `desktop-detective/js/window-manager.js` - creates, drags, resizes, focuses, minimizes, and closes windows. Every app window is managed here.
- `desktop-detective/js/game-manager.js` - handles case selection, accusation logic, win/lose screens, and the main menu flow.
- `desktop-detective/js/case-data.js` - contains all case content as a JavaScript object. Currently holds one case, `CASE_2024_001`.
- `desktop-detective/js/apps/file-explorer.js` - renders a tree of folders and files from case data.
- `desktop-detective/js/apps/email-client.js` - renders an inbox, sent items, and individual email threads.
- `desktop-detective/js/apps/chat-app.js` - renders direct-message conversation logs.
- `desktop-detective/js/apps/photo-viewer.js` - displays images with captions from case data.
- `desktop-detective/js/apps/calendar.js` - renders a month-view calendar with dated events.
- `desktop-detective/js/apps/browser-history.js` - shows search history and a bookmarks bar.
- `desktop-detective/js/apps/evidence-board.js` - a corkboard-style view for pinning evidence (currently referenced but not fully wired into the main case flow).
- `desktop-detective/js/notes-app.js` - a notepad that persists text to `localStorage`.
- `desktop-detective/js/help-overlay.js` - an overlay with keyboard shortcuts and instructions.
- `desktop-detective/js/pause-menu.js` - an in-game pause menu.
- `desktop-detective/package.json` - npm metadata, scripts (`start`, `build`, `deploy`), and a single dependency (`gh-pages` for deployment).
- `desktop-detective/package-lock.json` - lockfile for the `gh-pages` dependency.

## API / CLI / MCP tools

Desktop Detective does not expose an API, CLI, or MCP server. It is a client-side browser application with no backend. All interaction happens through the graphical desktop interface.

## Configuration

There are no environment variables. The application is fully static. The only external dependency is `html2canvas`, loaded at runtime from `cdnjs.cloudflare.com` via a `<script>` tag in `index.html`. If that CDN is unreachable, the snipping tool will fail silently.

## Data model

All case data lives in `desktop-detective/js/case-data.js` as a single exported object. The structure for the one existing case (`CASE_2024_001`) is:

- `id`, `title`, `briefing` (case overview text)
- `suspects` - array of objects with `name`, `relation`, and `guilty` (boolean, exactly one is `true`)
- `solution` - object with `killer`, `motive`, and `method` strings shown on the win screen
- `hint` - string shown on the lose screen
- `apps` - object containing data for each desktop app:
  - `files` - nested folder/file tree with `name`, `type` (`file` or `folder`), `content` (string), and `children` (array for folders)
  - `emails` - array of email thread objects with `subject`, `from`, `to`, `date`, `body`, and `folder` (`inbox` or `sent`)
  - `messages` - array of chat conversation objects with `participants`, and a `messages` array of `{from, text, time}`
  - `photos` - array of `{src, caption}`
  - `calendar` - object with `month`, `year`, and an `events` array of `{day, title, description}`
  - `browser` - object with `history` (array of `{query, date}`) and `bookmarks` (array of `{title, url}`)
  - `recycleBin` - array of deleted file objects with `name` and `content`

The notes app stores its content in `localStorage` under a key derived from the case ID, so notes persist across browser sessions but are scoped per case.

## Deploy

GitHub Pages is the intended deployment target. The `deploy` script in `package.json` runs `gh-pages -d .` from the `desktop-detective/` directory, which pushes the folder contents to a `gh-pages` branch. Alternatively, configure GitHub Pages to serve from the `/desktop-detective` folder on the main branch. No build step is required.

## Gotchas

- The snipping tool depends on `html2canvas` loaded from a CDN. It will not work offline unless you vendor that library.
- Opening `index.html` directly via `file://` may cause issues with `localStorage` or cross-origin restrictions in some browsers. A local server is recommended.
- The two locked case slots on the main menu are hardcoded placeholders. Adding a new case requires adding an entry to the case data object and updating the menu logic in `game-manager.js`.
- The evidence board app (`evidence-board.js`) exists in the codebase but is not fully integrated into the main case flow for CASE #2024-001.