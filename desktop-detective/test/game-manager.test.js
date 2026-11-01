const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectDir = path.join(__dirname, '..');
const caseData = require(path.join(projectDir, 'js', 'case-data.js'));
const tests = [];

function test(name, run) {
    tests.push([name, run]);
}

class FakeClassList {
    constructor(...names) {
        this.names = new Set(names);
    }

    add(...names) {
        names.forEach(name => this.names.add(name));
    }

    remove(...names) {
        names.forEach(name => this.names.delete(name));
    }

    contains(name) {
        return this.names.has(name);
    }
}

class FakeElement {
    constructor(id, ...classes) {
        this.id = id;
        this.classList = new FakeClassList(...classes);
        this.dataset = {};
        this.style = {};
        this.disabled = false;
        this.innerHTML = '';
        this.textContent = '';
        this.onclick = null;
        this.queryResults = new Map();
    }

    querySelector(selector) {
        return this.queryResults.get(selector) || null;
    }

    querySelectorAll(selector) {
        return this.queryResults.get(selector) || [];
    }

    setQueryResult(selector, value) {
        this.queryResults.set(selector, value);
    }
}

function loadGameManager(elements) {
    const source = fs.readFileSync(path.join(projectDir, 'js', 'game-manager.js'), 'utf8');
    const sandbox = {
        document: {
            getElementById(id) {
                return elements[id];
            },
            createElement() {
                return new FakeElement('created');
            },
            body: {
                appendChild() {}
            }
        },
        windowManager: {
            closeAllWindows() {}
        },
        FileExplorer: class {},
        EmailClient: class {},
        ChatApp: class {},
        PhotoViewer: class {},
        CalendarApp: class {},
        BrowserApp: class {},
        setTimeout() {}
    };

    const context = { ...sandbox, module: { exports: {} } };
    vm.createContext(context);
    vm.runInContext(`${source}\nmodule.exports = { GameManager };`, context);
    return context.module.exports.GameManager;
}

function createElements() {
    const elements = {
        'accusation-modal': new FakeElement('accusation-modal', 'hidden'),
        'suspect-list': new FakeElement('suspect-list'),
        'submit-accusation': new FakeElement('submit-accusation'),
        'cancel-accusation': new FakeElement('cancel-accusation'),
        desktop: new FakeElement('desktop'),
        'result-screen': new FakeElement('result-screen', 'hidden'),
        'result-icon': new FakeElement('result-icon'),
        'result-title': new FakeElement('result-title'),
        'result-text': new FakeElement('result-text'),
        'return-menu': new FakeElement('return-menu'),
        'main-menu': new FakeElement('main-menu', 'hidden')
    };

    elements['submit-accusation'].disabled = true;
    elements['suspect-list'].setQueryResult('.suspect-option', []);
    return elements;
}

test('case data has one playable case with a valid killer', () => {
    assert.equal(caseData.id, 'case1');
    assert.equal(caseData.suspects.length, 6);
    assert.equal(new Set(caseData.suspects.map(suspect => suspect.id)).size, 6);
    assert.ok(caseData.suspects.some(suspect => suspect.id === caseData.killer));
});

test('accusation modal resets selection state when reopened', () => {
    const elements = createElements();
    const GameManager = loadGameManager(elements);
    const manager = new GameManager();
    manager.currentCase = caseData;

    manager.openAccusationModal();
    assert.equal((elements['suspect-list'].innerHTML.match(/class="suspect-option"/g) || []).length, 6);
    const option = new FakeElement('tyler-option');
    option.dataset.suspect = caseData.killer;
    elements['suspect-list'].setQueryResult('.suspect-option', [option]);
    elements['suspect-list'].onclick({ target: { closest: () => option } });
    assert.equal(elements['submit-accusation'].disabled, false);

    elements['cancel-accusation'].onclick();
    manager.openAccusationModal();

    assert.equal(manager.selectedSuspect, null);
    assert.equal(elements['submit-accusation'].disabled, true);
});

test('correct accusation reaches the case closed screen and returns to menu', () => {
    const elements = createElements();
    const GameManager = loadGameManager(elements);
    const manager = new GameManager();
    manager.currentCase = caseData;
    manager.selectedSuspect = caseData.killer;

    manager.submitAccusation();

    assert.equal(elements['result-title'].textContent, 'CASE CLOSED');
    assert.equal(elements['desktop'].classList.contains('hidden'), true);
    assert.equal(elements['result-screen'].classList.contains('hidden'), false);

    elements['return-menu'].onclick();
    assert.equal(manager.currentCase, null);
    assert.equal(elements['main-menu'].classList.contains('hidden'), false);
});

test('wrong accusation identifies the innocent suspect', () => {
    const elements = createElements();
    const GameManager = loadGameManager(elements);
    const manager = new GameManager();
    manager.currentCase = caseData;
    manager.selectedSuspect = caseData.suspects.find(suspect => suspect.id !== caseData.killer).id;

    manager.submitAccusation();

    assert.equal(elements['result-title'].textContent, 'WRONG ACCUSATION');
    assert.match(elements['result-text'].innerHTML, /An innocent person was accused/);
});

test('all local script references in the entry point exist', () => {
    const html = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf8');
    const scriptSources = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)]
        .map(match => match[1])
        .filter(source => !/^https?:\/\//.test(source));

    assert.ok(scriptSources.length > 0);
    for (const scriptSource of scriptSources) {
        assert.equal(fs.existsSync(path.join(projectDir, scriptSource)), true, scriptSource);
    }
});

test('npm quickstart uses the bundled local server without dependencies', () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8'));
    assert.equal(packageJson.scripts.start, 'node scripts/serve.js');
    assert.equal(Object.hasOwn(packageJson, 'dependencies'), false);
    assert.equal(Object.hasOwn(packageJson, 'devDependencies'), false);
    assert.equal(fs.existsSync(path.join(projectDir, 'scripts', 'serve.js')), true);
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
