// DOM Elements
const sessionSelection = document.getElementById('sessionSelection');
const breathingInterface = document.getElementById('breathingInterface');
const sessionCards = document.querySelectorAll('.session-card');
const audioBtn = document.getElementById('audioBtn');

// Audio setup
let audioContext = null;
let audioEnabled = localStorage.getItem('boxBreathingAudio') !== 'false';

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function playTing(frequency = 800, duration = 0.15) {
    if (!audioEnabled || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Soft attack, quick decay for "ting" sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function toggleAudio() {
    audioEnabled = !audioEnabled;
    localStorage.setItem('boxBreathingAudio', audioEnabled);
    updateAudioButton();
}

function updateAudioButton() {
    if (audioEnabled) {
        audioBtn.classList.remove('muted');
        audioBtn.title = 'Sound on - click to mute';
    } else {
        audioBtn.classList.add('muted');
        audioBtn.title = 'Sound off - click to unmute';
    }
}

// Initialize audio button state
updateAudioButton();

const circle = document.querySelector('.circle');
const breathBox = document.querySelector('.breath-box');
const boxTracer = document.querySelector('.box-tracer');
const instructionText = document.getElementById('instruction');
const timerText = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

const cycleProgress = document.getElementById('cycleProgress');
const timeProgress = document.getElementById('timeProgress');

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
    { name: 'Inhale', duration: 4000, class: 'inhale', breathClass: 'inhale', text: 'Breathe In', tracerClass: 'trace-top', sound: { frequency: 600, duration: 0.2 } },
    { name: 'Hold', duration: 4000, class: 'hold first', breathClass: 'hold-full', text: 'Hold', tracerClass: 'trace-right', sound: { frequency: 800, duration: 0.15 } },
    { name: 'Exhale', duration: 4000, class: 'exhale', breathClass: 'exhale', text: 'Breathe Out', tracerClass: 'trace-bottom', sound: { frequency: 500, duration: 0.2 } },
    { name: 'Hold', duration: 4000, class: 'hold second', breathClass: 'hold-empty', text: 'Hold', tracerClass: 'trace-left', sound: { frequency: 700, duration: 0.15 } }
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

    // Initialize audio on user gesture
    initAudio();

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
        breathBox.style.animationPlayState = 'paused';
        boxTracer.style.animationPlayState = 'paused';
    } else {
        pauseBtn.textContent = 'Pause';
        circle.style.animationPlayState = 'running';
        breathBox.style.animationPlayState = 'running';
        boxTracer.style.animationPlayState = 'running';
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
    breathBox.className = 'breath-box';
    boxTracer.className = 'box-tracer';
    boxTracer.style.animationPlayState = '';
    instructionText.textContent = 'Get Ready';
    timerText.classList.remove('show');
    timerText.textContent = '4';

    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    pauseBtn.textContent = 'Pause';

    // Reset progress
    updateProgress();
}

function runPhase() {
    if (!isRunning || isPaused) return;

    const phase = phases[currentPhase];

    // Play phase transition sound
    playTing(phase.sound.frequency, phase.sound.duration);

    // Update UI
    instructionText.textContent = phase.text;
    timerText.classList.add('show');

    // Remove previous classes and add new ones
    circle.className = 'circle ' + phase.class;
    breathBox.className = 'breath-box ' + phase.breathClass;

    // Keep tracer visible, just swap the trace direction
    boxTracer.className = 'box-tracer active ' + phase.tracerClass;

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
    breathBox.style.animationPlayState = 'running';

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

        } else {
            timeProgress.textContent = `${elapsedMin}:${elapsedSec.toString().padStart(2, '0')}`;
        }
    } else {
        const totalMin = Math.floor(sessionDuration / 60);
        const totalSec = sessionDuration % 60;
        timeProgress.textContent = totalCycles > 0 ? `0:00 / ${totalMin}:${totalSec.toString().padStart(2, '0')}` : '0:00';
    }
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
    breathBox.className = 'breath-box';
    boxTracer.className = 'box-tracer';
}

// Event listeners
startBtn.addEventListener('click', startBreathing);
pauseBtn.addEventListener('click', pauseBreathing);
resetBtn.addEventListener('click', backToSessions);
audioBtn.addEventListener('click', toggleAudio);

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
