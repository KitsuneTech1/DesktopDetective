// Main Entry Point

document.addEventListener('DOMContentLoaded', () => {
    // Boot sequence
    bootSequence();

    // Setup accuse button
    setupAccuseButton();
});

function bootSequence() {
    const bootScreen = document.getElementById('boot-screen');
    const mainMenu = document.getElementById('main-menu');
    const progressBar = document.querySelector('.boot-progress-bar');
    const bootStatus = document.querySelector('.boot-status');

    const messages = [
        'Connecting to seized device...',
        'Bypassing security protocols...',
        'Loading file system...',
        'Initializing forensic tools...',
        'Connection established.'
    ];

    let progress = 0;
    let messageIndex = 0;

    const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;

        if (progress % 20 === 0 && messageIndex < messages.length) {
            bootStatus.textContent = messages[messageIndex];
            messageIndex++;
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                bootScreen.classList.add('hidden');
                mainMenu.classList.remove('hidden');
            }, 500);
        }
    }, 50);
}

// Case selection
document.addEventListener('click', (e) => {
    const caseCard = e.target.closest('.case-card:not(.locked)');
    if (caseCard) {
        const caseId = caseCard.dataset.case;
        if (caseId === 'case1') {
            startCase(CASE_DATA);
        }
    }
});

function startCase(caseData) {
    const mainMenu = document.getElementById('main-menu');
    const desktop = document.getElementById('desktop');
    const briefing = document.getElementById('case-briefing');
    const briefingText = document.getElementById('briefing-text');

    mainMenu.classList.add('hidden');
    desktop.classList.remove('hidden');
    briefing.classList.remove('hidden');

    // Show case briefing
    briefingText.innerHTML = caseData.briefing;

    // Start investigation button
    document.getElementById('start-investigation').onclick = () => {
        briefing.classList.add('hidden');
        gameManager.loadCase(caseData);
        startClock();
    };
}

// Desktop icon clicks
document.getElementById('desktop-icons').addEventListener('dblclick', (e) => {
    const icon = e.target.closest('.desktop-icon');
    if (icon) {
        const appId = icon.dataset.app;
        gameManager.openApp(appId);
    }
});

// Clock
function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Accuse Button
function setupAccuseButton() {
    const accuseBtn = document.getElementById('start-button');
    if (accuseBtn) {
        accuseBtn.addEventListener('click', () => {
            if (gameManager.currentCase) {
                gameManager.openAccusationModal();
            }
        });
    }
}

// Add notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { transform: translate(-50%, 20px); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);


