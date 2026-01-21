const circle = document.querySelector('.circle');
const innerCircle = document.querySelector('.inner-circle');
const instructionText = document.getElementById('instruction');
const timerText = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

let isRunning = false;
let isPaused = false;
let currentPhase = 0;
let countdown;
let phaseTimeout;

const phases = [
    { name: 'Inhale', duration: 4000, class: 'inhale', text: 'Breathe In' },
    { name: 'Hold', duration: 4000, class: 'hold', text: 'Hold' },
    { name: 'Exhale', duration: 4000, class: 'exhale', text: 'Breathe Out' },
    { name: 'Hold', duration: 4000, class: 'hold', text: 'Hold' }
];

function startBreathing() {
    if (isRunning && !isPaused) return;

    if (isPaused) {
        isPaused = false;
        pauseBtn.textContent = 'Pause';
        continuePhase();
    } else {
        isRunning = true;
        currentPhase = 0;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        runPhase();
    }
}

function pauseBreathing() {
    if (!isRunning) return;

    isPaused = !isPaused;

    if (isPaused) {
        clearInterval(countdown);
        clearTimeout(phaseTimeout);
        pauseBtn.textContent = 'Resume';
        circle.style.animationPlayState = 'paused';
        innerCircle.style.animationPlayState = 'paused';
    } else {
        pauseBtn.textContent = 'Pause';
        continuePhase();
    }
}

function resetBreathing() {
    isRunning = false;
    isPaused = false;
    currentPhase = 0;

    clearInterval(countdown);
    clearTimeout(phaseTimeout);

    circle.className = 'circle';
    innerCircle.className = 'inner-circle';
    instructionText.textContent = 'Click Start to Begin';
    timerText.classList.remove('show');
    timerText.textContent = '4';

    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    pauseBtn.textContent = 'Pause';
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
        runPhase();
    }, remainingDuration);
}

// Event listeners
startBtn.addEventListener('click', startBreathing);
pauseBtn.addEventListener('click', pauseBreathing);
resetBtn.addEventListener('click', resetBreathing);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!isRunning || isPaused) {
            startBreathing();
        } else {
            pauseBreathing();
        }
    } else if (e.code === 'Escape') {
        resetBreathing();
    }
});
