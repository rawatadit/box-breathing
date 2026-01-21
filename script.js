// DOM Elements
const sessionSelection = document.getElementById('sessionSelection');
const breathingInterface = document.getElementById('breathingInterface');
const sessionCards = document.querySelectorAll('.session-card');

const circle = document.querySelector('.circle');
const innerCircle = document.querySelector('.inner-circle');
const instructionText = document.getElementById('instruction');
const timerText = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

const cycleProgress = document.getElementById('cycleProgress');
const timeProgress = document.getElementById('timeProgress');
const progressCircle = document.getElementById('progressCircle');

// Session configurations
const sessions = {
    quick: { name: 'Quick Calm', cycles: 7, duration: 2 * 60 },
    deep: { name: 'Deep Relaxation', cycles: 18, duration: 5 * 60 },
    focus: { name: 'Focus Session', cycles: 11, duration: 3 * 60 },
    custom: { name: 'Custom', cycles: 0, duration: 0 }
};

// State variables
let isRunning = false;
let isPaused = false;
let currentPhase = 0;
let currentCycle = 0;
let totalCycles = 0;
let sessionStartTime = 0;
let sessionDuration = 0;
let countdown;
let phaseTimeout;
let progressInterval;

const phases = [
    { name: 'Inhale', duration: 4000, class: 'inhale', text: 'Breathe In' },
    { name: 'Hold', duration: 4000, class: 'hold first', text: 'Hold' },
    { name: 'Exhale', duration: 4000, class: 'exhale', text: 'Breathe Out' },
    { name: 'Hold', duration: 4000, class: 'hold second', text: 'Hold' }
];

// Session Selection
sessionCards.forEach(card => {
    card.addEventListener('click', () => {
        const sessionType = card.dataset.session;

        if (sessionType === 'custom') {
            // For now, use default custom values
            totalCycles = 10;
            sessionDuration = 10 * 16; // 10 cycles * 16 seconds per cycle
        } else {
            const session = sessions[sessionType];
            totalCycles = session.cycles;
            sessionDuration = session.duration;
        }

        startSession();
    });
});

function startSession() {
    // Animate transition
    sessionSelection.classList.add('fade-out');

    setTimeout(() => {
        sessionSelection.style.display = 'none';
        breathingInterface.style.display = 'block';

        // Initialize session
        currentCycle = 0;
        sessionStartTime = Date.now();
        updateProgress();
    }, 500);
}

function backToSessions() {
    // Stop any running session
    resetBreathing();

    // Animate transition
    breathingInterface.classList.add('fade-out');

    setTimeout(() => {
        breathingInterface.style.display = 'none';
        breathingInterface.classList.remove('fade-out');
        sessionSelection.style.display = 'block';
        sessionSelection.classList.remove('fade-out');
    }, 500);
}

function startBreathing() {
    if (isRunning && !isPaused) return;

    if (isPaused) {
        isPaused = false;
        pauseBtn.textContent = 'Pause';
        continuePhase();
    } else {
        isRunning = true;
        currentPhase = 0;
        currentCycle = 1;
        sessionStartTime = Date.now();
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';

        // Start progress tracking
        progressInterval = setInterval(updateProgress, 100);

        runPhase();
    }
}

function pauseBreathing() {
    if (!isRunning) return;

    isPaused = !isPaused;

    if (isPaused) {
        clearInterval(countdown);
        clearTimeout(phaseTimeout);
        clearInterval(progressInterval);
        pauseBtn.textContent = 'Resume';
        circle.style.animationPlayState = 'paused';
        innerCircle.style.animationPlayState = 'paused';
    } else {
        pauseBtn.textContent = 'Pause';
        progressInterval = setInterval(updateProgress, 100);
        continuePhase();
    }
}

function resetBreathing() {
    isRunning = false;
    isPaused = false;
    currentPhase = 0;
    currentCycle = 0;

    clearInterval(countdown);
    clearTimeout(phaseTimeout);
    clearInterval(progressInterval);

    circle.className = 'circle';
    innerCircle.className = 'inner-circle';
    instructionText.textContent = 'Get Ready';
    timerText.classList.remove('show');
    timerText.textContent = '4';

    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    pauseBtn.textContent = 'Pause';

    // Reset progress
    updateProgress();
    updateProgressRing(0);
}

function runPhase() {
    if (!isRunning || isPaused) return;

    const phase = phases[currentPhase];

    // Update UI
    instructionText.textContent = phase.text;
    timerText.classList.add('show');

    // Remove previous classes
    circle.className = 'circle';
    innerCircle.className = 'inner-circle';

    // Add current phase class
    setTimeout(() => {
        circle.classList.add(phase.class);
        innerCircle.classList.add(phase.class);
    }, 50);

    // Start countdown
    let timeLeft = 4;
    timerText.textContent = timeLeft;

    countdown = setInterval(() => {
        timeLeft--;
        if (timeLeft >= 0) {
            timerText.textContent = timeLeft;
        }
    }, 1000);

    // Move to next phase
    phaseTimeout = setTimeout(() => {
        clearInterval(countdown);
        currentPhase = (currentPhase + 1) % phases.length;

        // Increment cycle when completing all 4 phases
        if (currentPhase === 0) {
            currentCycle++;
            updateProgress();

            // Check if session is complete
            if (totalCycles > 0 && currentCycle > totalCycles) {
                completeSession();
                return;
            }
        }

        runPhase();
    }, phase.duration);
}

function continuePhase() {
    // Get remaining time and continue the current phase
    const currentTime = parseInt(timerText.textContent);
    const phase = phases[currentPhase];

    // Resume animations
    circle.style.animationPlayState = 'running';
    innerCircle.style.animationPlayState = 'running';

    // Continue countdown
    let timeLeft = currentTime;

    countdown = setInterval(() => {
        timeLeft--;
        if (timeLeft >= 0) {
            timerText.textContent = timeLeft;
        }
    }, 1000);

    // Calculate remaining duration and continue
    const remainingDuration = (currentTime + 1) * 1000;

    phaseTimeout = setTimeout(() => {
        clearInterval(countdown);
        currentPhase = (currentPhase + 1) % phases.length;

        // Increment cycle when completing all 4 phases
        if (currentPhase === 0) {
            currentCycle++;
            updateProgress();

            // Check if session is complete
            if (totalCycles > 0 && currentCycle > totalCycles) {
                completeSession();
                return;
            }
        }

        runPhase();
    }, remainingDuration);
}

function updateProgress() {
    // Update cycle progress
    const cycleDisplay = totalCycles > 0
        ? `Cycle ${currentCycle} of ${totalCycles}`
        : `Cycle ${currentCycle}`;
    cycleProgress.textContent = cycleDisplay;

    // Update time progress
    if (isRunning && sessionStartTime) {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        const elapsedMin = Math.floor(elapsed / 60);
        const elapsedSec = elapsed % 60;

        if (sessionDuration > 0) {
            const totalMin = Math.floor(sessionDuration / 60);
            const totalSec = sessionDuration % 60;
            timeProgress.textContent = `${elapsedMin}:${elapsedSec.toString().padStart(2, '0')} / ${totalMin}:${totalSec.toString().padStart(2, '0')}`;

            // Update progress ring
            const progress = (elapsed / sessionDuration) * 100;
            updateProgressRing(Math.min(progress, 100));
        } else {
            timeProgress.textContent = `${elapsedMin}:${elapsedSec.toString().padStart(2, '0')}`;
            updateProgressRing(0);
        }
    } else {
        const totalMin = Math.floor(sessionDuration / 60);
        const totalSec = sessionDuration % 60;
        timeProgress.textContent = totalCycles > 0 ? `0:00 / ${totalMin}:${totalSec.toString().padStart(2, '0')}` : '0:00';
        updateProgressRing(0);
    }
}

function updateProgressRing(percentage) {
    const circumference = 880; // 2 * π * r (where r = 140)
    const offset = circumference - (percentage / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

function completeSession() {
    clearInterval(countdown);
    clearTimeout(phaseTimeout);
    clearInterval(progressInterval);

    isRunning = false;
    isPaused = false;

    instructionText.textContent = 'Session Complete!';
    timerText.classList.remove('show');

    startBtn.style.display = 'inline-block';
    startBtn.textContent = 'Start Again';
    pauseBtn.style.display = 'none';

    circle.className = 'circle';
    innerCircle.className = 'inner-circle';

    updateProgressRing(100);
}

// Event listeners
startBtn.addEventListener('click', startBreathing);
pauseBtn.addEventListener('click', pauseBreathing);
resetBtn.addEventListener('click', backToSessions);

// Keyboard shortcuts (only when in breathing interface)
document.addEventListener('keydown', (e) => {
    if (breathingInterface.style.display === 'none') return;

    if (e.code === 'Space') {
        e.preventDefault();
        if (!isRunning || isPaused) {
            startBreathing();
        } else {
            pauseBreathing();
        }
    } else if (e.code === 'Escape') {
        backToSessions();
    }
});
