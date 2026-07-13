<p align="center"><a href="https://kitsunetechnologies.org/work"><img src="https://raw.githubusercontent.com/KitsuneTech1/.github/main/assets/kitsune-banner.svg" alt="Built by Kitsune Technologies" width="760"></a></p>

# Desktop Detective

A browser murder-mystery where the crime scene is a suspect's laptop and the evidence is buried in their emails, chats, and files.

## What it is

Desktop Detective drops you into a fake "remote forensic access" session on a murder suspect's computer. You get a simulated desktop with a file explorer, an email inbox, a messaging app, a photo viewer, a calendar, a browser (history and bookmarks included), and a recycle bin with deleted files someone thought were gone. Everything in there is written for the case: real leads, contradicting alibis, and red herrings mixed in on purpose.

The loop is simple: open apps, read everything, take notes on what points where, then decide who did it and make your accusation. There's no puzzle mechanic beyond reading carefully and connecting dates, names, and motives across apps.

Right now there is one playable case, "The CEO's Last Meeting" (CASE #2024-001), a tech CEO poisoned with antifreeze in his coffee, six suspects, one killer. Two more case slots show on the main menu as locked ("Complete previous case to unlock") but aren't built yet, they're placeholders for future cases.

## Play it / Install

The game is static HTML/CSS/JS, no build step is required to run it. The app itself lives in the `desktop-detective/` folder.

**Option 1: just open the file**

```bash
open desktop-detective/index.html      # macOS
xdg-open desktop-detective/index.html  # Linux
start desktop-detective\index.html     # Windows
```

**Option 2: local web server (recommended, avoids browser file:// restrictions)**

```bash
cd desktop-detective
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

**Option 3: npm scripts from package.json**

```bash
cd desktop-detective
npm install
npm start
```

`npm start` runs `npx serve .` and serves the folder on a local port. The `build` script in package.json is a no-op placeholder (just echoes "Building... Done"), there's no real bundling step, the game runs directly from source. `npm run deploy` is wired to `gh-pages -d .` for publishing the folder straight to a `gh-pages` branch if you want to host it that way.

**Option 4: GitHub Pages**

Since there's no build step, you can point GitHub Pages straight at the `desktop-detective/` folder (Settings > Pages > deploy from branch, folder `/desktop-detective`), or copy its contents to the repo root or a `docs/` folder if your Pages setup expects that.

Note: the snipping tool (see below) pulls `html2canvas` from a CDN (`cdnjs.cloudflare.com`) via a script tag in `index.html`, so that one feature needs an internet connection even when everything else runs fully offline.

## How to play

1. From the main menu, pick a case. Only CASE #2024-001, "The CEO's Last Meeting," is currently playable.
2. Read the case briefing (victim, cause of death, time of death, your task) and click "Begin Investigation."
3. Double-click desktop icons to open apps: My Files, Email, Messages, Photos, Calendar, Browser, and Recycle Bin. Each one holds different pieces of the story, files and voicemail transcripts in My Files, email threads in Email, DM logs in Messages, security-cam and personal photos in Photos, a month of dated events in Calendar, and search/browsing history plus bookmarked sites in Browser. The Recycle Bin holds deleted files that were recovered.
4. Use the Investigator Tools bar at the bottom of the screen while you dig:
   - **Notes** opens a notepad (saved to your browser's local storage) for writing down what you find.
   - **Snip** lets you drag-select part of the screen and capture a screenshot of it, for pinning evidence into your notes.
5. When you're ready, click "Accuse" in the taskbar. This opens the accusation screen listing all six suspects with their relation to the victim.
6. Pick one suspect and click "Accuse This Person" to lock in your answer, or "Keep Investigating" to back out and look for more.
7. **Win:** accuse the actual killer and you get a "Case Closed" screen that lays out the full solution, motive, and method.
8. **Lose:** accuse anyone else and you get a "Wrong Accusation" screen naming who you falsely accused, plus a hint pointing you back toward the real trail. You can return to the menu and try again.

There's no evidence-count gate stopping you from accusing early. The case briefing mentions gathering at least 3 pieces of supporting evidence before accusing, but that's guidance for how to play well, not a hard requirement enforced by the game.

## License

PolyForm Noncommercial License 1.0.0. Copyright (c) 2026 Kitsune Technologies LLC.

In short: you can use, copy, modify, and distribute this for any noncommercial purpose (personal use, research, education, hobby projects, nonprofit and government use), with no anticipated commercial application. Commercial use is not covered by this license. Full text is in [LICENSE.md](LICENSE.md), or see the license at https://polyformproject.org/licenses/noncommercial/1.0.0.
