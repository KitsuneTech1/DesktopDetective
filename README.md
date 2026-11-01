<p align="center"><a href="https://kitsunetechnologies.org/work"><img src="https://raw.githubusercontent.com/KitsuneTech1/.github/main/assets/kitsune-banner.svg" alt="Built by Kitsune Technologies" width="760"></a></p>

# Desktop Detective

A browser-based murder mystery where you investigate a suspect's computer for clues.

Play it in your browser, no install: **[kitsunetech1.github.io/DesktopDetective](https://kitsunetech1.github.io/DesktopDetective/)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow.svg)](https://github.com/KitsuneTech1/DesktopDetective)

## What it is

Desktop Detective puts you in a fake remote forensic access session on a murder suspect's computer. You get a simulated desktop with file explorer, email, messages, photos, calendar, browser history, and recycle bin. Everything is written for the case, mixing real leads, contradicting alibis, and red herrings.

The game is simple: open apps, read everything, take notes, connect the dots across files and dates, then accuse the killer. One playable case is included: "The CEO's Last Meeting" (CASE #2024-001), where a startup CEO is poisoned with antifreeze. Six suspects, one killer. Two more case slots are locked placeholders for future cases.

No build step. The game runs as static HTML/CSS/JS from the `desktop-detective/` folder.

## Quick Start

**Fastest way: open the file directly**

```bash
open desktop-detective/index.html      # macOS
xdg-open desktop-detective/index.html  # Linux
start desktop-detective\index.html     # Windows
```

**Or run a local server (avoids browser file:// restrictions)**

Python:
```bash
cd desktop-detective
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

Node (no extra dependencies):
```bash
cd desktop-detective
npm install
npm start
```

`npm start` uses Node's built-in http module and serves at `http://127.0.0.1:8000`.

**Run tests (Node only, no network access)**

```bash
cd desktop-detective
npm test --offline
```

**Deploy to GitHub Pages**

Point Pages at the `desktop-detective/` folder (Settings > Pages > deploy from branch, folder `/desktop-detective`), or copy its contents to repo root or a `docs/` folder. The snipping tool pulls `html2canvas` from cdnjs.cloudflare.com, so that feature needs internet even offline.

## How to Play

1. From the main menu, pick a case. Only CASE #2024-001 is currently playable.
2. Read the case briefing (victim, cause of death, time window, task) and click "Begin Investigation."
3. Double-click desktop icons to open apps: My Files (voicemail transcripts), Email, Messages, Photos (security cam and personal), Calendar (one month of events), Browser (history and bookmarks), and Recycle Bin (recovered deleted files).
4. Use the Investigator Tools bar at the bottom:
   - **Notes:** open a notepad (saved to browser storage) to track what you find.
   - **Snip:** drag-select part of the screen and capture it as evidence for your notes.
5. When ready, click "Accuse" in the taskbar to pick a suspect.
6. Choose your target and click "Accuse This Person" to lock in your answer, or "Keep Investigating" to back out.
7. Win or lose: correct accusation shows the full solution; wrong accusation hints at the real trail and lets you retry.

No evidence gate. The briefing suggests gathering 3 pieces of supporting evidence, but you can accuse at any time.

## License

MIT. Copyright (c) 2026 Kitsune Technologies LLC. Do what you like with it, commercially or otherwise, just keep the copyright notice. Full text in [LICENSE](LICENSE).

---

<p align="center"><sub>Part of <b>Buildtober 2026</b>: 31 open source projects in 31 days. Built by <a href="https://kitsunetechnologies.org/work">Kitsune Technologies</a>. More at <a href="https://github.com/KitsuneTech1">github.com/KitsuneTech1</a>.</sub></p>
