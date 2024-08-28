const HALF_DURATION = 45 * 60 * 1000;  // 5 * 1000 (5 seconds) for testing, change to 45 * 60 * 1000 for actual use

let firstHalfStartTime = null;
let secondHalfStartTime = null;
let firstHalfElapsedTime = 0;
let secondHalfElapsedTime = 0;
let firstHalfComplete = false;
let secondHalfStarted = false;
let timerInterval = null;
let stopped = false;  // New flag to lock timers when stopped

document.getElementById('startBtn').addEventListener('click', function() {
    if (stopped) return;  // Prevent starting if timers are stopped

    if (!firstHalfComplete && !secondHalfStarted) {
        if (firstHalfStartTime === null) {
            firstHalfStartTime = Date.now();
            document.getElementById('firstHalfStartTime').textContent = formatClockTime(new Date(firstHalfStartTime));
        } else {
            firstHalfStartTime = Date.now() - firstHalfElapsedTime; // Continue from where we left off
        }
        startTimer();
    } else if (firstHalfComplete && !secondHalfStarted) {
        if (secondHalfStartTime === null) {
            secondHalfStartTime = Date.now();
            document.getElementById('secondHalfStartTime').textContent = formatClockTime(new Date(secondHalfStartTime));
        } else {
            secondHalfStartTime = Date.now() - secondHalfElapsedTime; // Continue from where we left off
        }
        secondHalfStarted = true;
        startTimer();
    }
});

document.getElementById('pauseBtn').addEventListener('click', function() {
    if (stopped) return;  // Prevent pausing if timers are stopped
    clearInterval(timerInterval);
    updateElapsedTime();  // Capture the current elapsed time when paused
    if (!firstHalfComplete && !secondHalfStarted) {
        firstHalfElapsedTime = Date.now() - firstHalfStartTime;
        document.getElementById('firstHalfStopTime').textContent = formatClockTime(new Date());
        firstHalfComplete = true;
    } else if (secondHalfStarted) {
        secondHalfElapsedTime = Date.now() - secondHalfStartTime;
        document.getElementById('secondHalfStopTime').textContent = formatClockTime(new Date());
    }
});

document.getElementById('stopBtn').addEventListener('click', function() {
    if (stopped) return;  // Prevent further updates if already stopped
    clearInterval(timerInterval); // Stop the timer updates
    updateElapsedTime();  // Capture the final elapsed time when stopped
    stopped = true;  // Lock the timers
    if (!firstHalfComplete && !secondHalfStarted) {
        firstHalfElapsedTime = Date.now() - firstHalfStartTime;
        document.getElementById('firstHalfStopTime').textContent = formatClockTime(new Date());
        firstHalfComplete = true;
    } else if (secondHalfStarted) {
        secondHalfElapsedTime = Date.now() - secondHalfStartTime;
        document.getElementById('secondHalfStopTime').textContent = formatClockTime(new Date());
    }
});

document.getElementById('resetBtn').addEventListener('click', function() {
    clearInterval(timerInterval);
    resetAllTimers();
    stopped = false;  // Unlock timers after reset
});

function startTimer() {
    clearInterval(timerInterval); // Clear any existing interval before starting a new one
    timerInterval = setInterval(updateTime, 50); // Update every 50ms for smooth display
}

function updateTime() {
    const now = Date.now();

    if (!firstHalfComplete) {
        firstHalfElapsedTime = now - firstHalfStartTime;
        updateFirstHalfDisplay();
    } else if (secondHalfStarted) {
        secondHalfElapsedTime = now - secondHalfStartTime;
        updateSecondHalfDisplay();
    }
}

function updateFirstHalfDisplay() {
    if (firstHalfElapsedTime <= HALF_DURATION) {
        document.getElementById('firstHalfTime').textContent = formatTime(firstHalfElapsedTime);
    } else {
        document.getElementById('firstHalfExtraTime').textContent = formatTime(firstHalfElapsedTime - HALF_DURATION);
    }
}

function updateSecondHalfDisplay() {
    if (secondHalfElapsedTime <= HALF_DURATION) {
        document.getElementById('secondHalfTime').textContent = formatTime((HALF_DURATION + 60000) + secondHalfElapsedTime); // Start from 46:00
    } else {
        document.getElementById('secondHalfTime').textContent = formatTime(HALF_DURATION * 2 + 60000); // Cap the second half timer at 90:00 (45:00 + 45:00)
        document.getElementById('secondHalfExtraTime').textContent = formatTime(secondHalfElapsedTime - HALF_DURATION);
    }
}

function updateElapsedTime() {
    if (!firstHalfComplete) {
        updateFirstHalfDisplay();
    } else if (secondHalfStarted) {
        updateSecondHalfDisplay();
    }
}

function resetAllTimers() {
    firstHalfStartTime = null;
    secondHalfStartTime = null;
    firstHalfElapsedTime = 0;
    secondHalfElapsedTime = 0;
    firstHalfComplete = false;
    secondHalfStarted = false;

    document.getElementById('firstHalfStartTime').textContent = "--:--:--";
    document.getElementById('firstHalfTime').textContent = "00:00.000";
    document.getElementById('firstHalfExtraTime').textContent = "00:00.000";
    document.getElementById('firstHalfStopTime').textContent = "--:--:--";

    document.getElementById('secondHalfStartTime').textContent = "--:--:--";
    document.getElementById('secondHalfTime').textContent = formatTime(HALF_DURATION + 60000); // Start second half at 46:00
    document.getElementById('secondHalfExtraTime').textContent = "00:00.000";
    document.getElementById('secondHalfStopTime').textContent = "--:--:--";
}

function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const millis = milliseconds % 1000;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

function formatClockTime(date) {
    return date.toTimeString().split(' ')[0]; // Returns HH:MM:SS from Date object
}
