const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectDir = path.join(__dirname, '..');
const tests = [];

function test(name, run) {
    tests.push([name, run]);
}

test('server module can be imported without binding a port', () => {
    const server = require(path.join(projectDir, 'scripts', 'serve.js'));
    assert.equal(typeof server.createServer, 'function');
    assert.equal(typeof server.startServer, 'function');
});

test('server validates configured ports', () => {
    const { parsePort } = require(path.join(projectDir, 'scripts', 'serve.js'));
    assert.equal(parsePort(undefined), 8000);
    assert.equal(parsePort('0'), 0);
    assert.equal(parsePort('65535'), 65535);
    assert.throws(() => parsePort('not-a-port'), /PORT must be an integer/);
    assert.throws(() => parsePort(' '), /PORT must be an integer/);
    assert.throws(() => parsePort('1.5'), /PORT must be an integer/);
    assert.throws(() => parsePort('-1'), /PORT must be an integer/);
    assert.throws(() => parsePort('65536'), /PORT must be an integer/);
});

test('server rejects encoded traversal and invalid request paths', () => {
    const { isPathInside, resolveFilePath } = require(path.join(projectDir, 'scripts', 'serve.js'));
    const root = path.join(projectDir);

    assert.equal(isPathInside(root, path.join(root, 'index.html')), true);
    assert.equal(isPathInside(root, path.join(root, '..', 'README.md')), false);
    assert.equal(resolveFilePath('/index.html', root), path.join(root, 'index.html'));
    assert.equal(resolveFilePath('/..%5CREADME.md', root), null);
    assert.equal(resolveFilePath('/%2F%2F', root), null);
    assert.throws(() => resolveFilePath('/%00', root), /Invalid request path/);
    assert.throws(() => resolveFilePath('/%E0%A4%A', root), /Invalid request path/);
});

function loadPauseMenu(elements, windowManager, gameManager) {
    const source = fs.readFileSync(path.join(projectDir, 'js', 'pause-menu.js'), 'utf8');
    const context = {
        document: {
            addEventListener() {},
            createElement() {
                return { className: '', id: '', innerHTML: '', addEventListener() {} };
            },
            getElementById(id) {
                return elements[id];
            },
            body: { appendChild() {} }
        },
        window: {},
        windowManager,
        gameManager,
        module: { exports: {} }
    };

    vm.createContext(context);
    vm.runInContext(`${source}\nmodule.exports = { PauseMenu };`, context);
    return context.module.exports.PauseMenu;
}

class FakeClassList {
    constructor(...names) {
        this.names = new Set(names);
    }

    add(name) {
        this.names.add(name);
    }

    remove(name) {
        this.names.delete(name);
    }

    contains(name) {
        return this.names.has(name);
    }
}

test('pause menu quit closes windows and resets the game with lexical globals', () => {
    const elements = {
        desktop: { classList: new FakeClassList() },
        'main-menu': { classList: new FakeClassList('hidden') }
    };
    let closeAllWindowsCalls = 0;
    let resetCalls = 0;
    const windowManager = { closeAllWindows() { closeAllWindowsCalls++; }, windows: new Map() };
    const gameManager = { reset() { resetCalls++; } };
    const PauseMenu = loadPauseMenu(elements, windowManager, gameManager);
    const menu = Object.create(PauseMenu.prototype);
    menu.overlay = { classList: new FakeClassList() };
    menu.isPaused = true;

    menu.quitToMenu();

    assert.equal(closeAllWindowsCalls, 1);
    assert.equal(resetCalls, 1);
    assert.equal(elements.desktop.classList.contains('hidden'), true);
    assert.equal(elements['main-menu'].classList.contains('hidden'), false);
});

test('pause menu does not pause while the investigator notes window is open', () => {
    const elements = {
        desktop: { classList: new FakeClassList() },
        'snip-overlay': { classList: new FakeClassList('hidden') },
        'accusation-modal': { classList: new FakeClassList('hidden') },
        'notes-overlay': null
    };
    const windowManager = { windows: new Map([['investigator-notes', {}]]) };
    const PauseMenu = loadPauseMenu(elements, windowManager, {});
    const menu = Object.create(PauseMenu.prototype);
    menu.overlay = { classList: new FakeClassList('hidden') };
    menu.isPaused = false;

    menu.toggle();

    assert.equal(menu.isPaused, false);
    assert.equal(menu.overlay.classList.contains('hidden'), true);
});

test('corrupt notes storage normalises to safe note records', () => {
    const { NotesApp, normaliseNotes, escapeHtml } = require(path.join(projectDir, 'js', 'notes-app.js'));
    assert.deepEqual(normaliseNotes(null), []);
    assert.deepEqual(normaliseNotes({ id: 'wrong-shape' }), []);
    const notes = normaliseNotes([null, { id: 42, title: 7, content: null }]);
    assert.equal(notes.length, 1);
    assert.equal(notes[0].id, '42');
    assert.equal(notes[0].title, 'Untitled');
    assert.equal(notes[0].content, '');
    assert.equal(typeof notes[0].created, 'string');
    assert.equal(typeof notes[0].updated, 'string');
    assert.equal(escapeHtml('"<script>'), '&quot;&lt;script&gt;');

    const app = Object.create(NotesApp.prototype);
    app.notes = [{ id: 'note-1', title: '" onfocus="alert(1)', content: '' }];
    app.activeNoteId = 'note-1';
    app.capturedSnip = null;
    const rendered = app.renderNotesWindow();
    assert.doesNotMatch(rendered, /onfocus="alert\(1\)"/);
    assert.match(rendered, /&quot; onfocus=&quot;alert\(1\)/);
});

test('evidence board tolerates a missing optional taskbar counter', () => {
    const source = fs.readFileSync(path.join(projectDir, 'js', 'apps', 'evidence-board.js'), 'utf8');
    const context = {
        document: { getElementById() { return null; } },
        windowManager: { createWindow() {} },
        module: { exports: {} }
    };
    vm.createContext(context);
    vm.runInContext(`${source}\nmodule.exports = { EvidenceBoard };`, context);
    const board = new context.module.exports.EvidenceBoard([], 1, () => {});

    assert.equal(board.addEvidence('one', 'A clue', 'file.txt'), true);
    assert.equal(board.getCollectedEvidence().length, 1);
});

const failures = [];
for (const [name, run] of tests) {
    try {
        run();
        console.log(`PASS ${name}`);
    } catch (error) {
        failures.push({ name, error });
        console.error(`FAIL ${name}`);
        console.error(error.stack || error.message);
    }
}

console.log(`Tests: ${tests.length}, Passed: ${tests.length - failures.length}, Failed: ${failures.length}`);
if (failures.length > 0) {
    process.exitCode = 1;
}
