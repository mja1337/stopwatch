let startTime = null;
let elapsedTime = 0;
let totalElapsedTime = 0; // Tracks the total time across both halves
let timerInterval = null;
let firstHalfComplete = false;
let secondHalfStarted = false;
let firstHalfStartTime, firstHalfStopTime, secondHalfStartTime, secondHalfStopTime;

document.getElementById('startBtn').addEventListener('click', function() {
    if (!firstHalfComplete && !secondHalfStarted) {
        startTime = Date.now();
        firstHalfStartTime = new Date(startTime);
        document.getElementById('firstHalfStartTime').textContent = formatClockTime(firstHalfStartTime);
    } else if (firstHalfComplete && !secondHalfStarted) {
        startTime = Date.now();
        secondHalfStartTime = new Date(startTime);
        document.getElementById('secondHalfStartTime').textContent = formatClockTime(secondHalfStartTime);
        secondHalfStarted = true;
    }
    startTimer();
});

document.getElementById('pauseBtn').addEventListener('click', function() {
    clearInterval(timerInterval);
    totalElapsedTime += elapsedTime; // Add the current elapsed time to total
    if (!firstHalfComplete) {
        firstHalfStopTime = new Date();
        document.getElementById('firstHalfStopTime').textContent = formatClockTime(firstHalfStopTime);
        firstHalfComplete = true;
    } else if (secondHalfStarted) {
        secondHalfStopTime = new Date();
        document.getElementById('secondHalfStopTime').textContent = formatClockTime(secondHalfStopTime);
    }
});

document.getElementById('stopBtn').addEventListener('click', function() {
    clearInterval(timerInterval);
    totalElapsedTime += elapsedTime; // Add the current elapsed time to total
    if (!firstHalfComplete) {
        firstHalfStopTime = new Date();
        document.getElementById('firstHalfStopTime').textContent = formatClockTime(firstHalfStopTime);
        firstHalfComplete = true;
    } else if (secondHalfStarted) {
        secondHalfStopTime = new Date();
        document.getElementById('secondHalfStopTime').textContent = formatClockTime(secondHalfStopTime);
    }
});

document.getElementById('resetBtn').addEventListener('click', function() {
    clearInterval(timerInterval);
    resetAllTimers();
});

function startTimer() {
    timerInterval = setInterval(updateTime, 100);
}

function updateTime() {
    elapsedTime = Date.now() - startTime;
    if (!firstHalfComplete) {
        document.getElementById('firstHalfTime').textContent = formatTime(elapsedTime);
        if (elapsedTime >= 45 * 60 * 1000) {
            firstHalfComplete = true;
            clearInterval(timerInterval);
            startFirstHalfExtraTime();
        }
    } else if (secondHalfStarted) {
        document.getElementById('secondHalfTime').textContent = formatTime(elapsedTime);
        if (elapsedTime >= 45 * 60 * 1000) {
            clearInterval(timerInterval);
            startSecondHalfExtraTime();
        }
    }
    document.getElementById('totalTime').textContent = formatTime(totalElapsedTime + elapsedTime); // Show total elapsed time
}

function startFirstHalfExtraTime() {
    startTime = Date.now();
    timerInterval = setInterval(updateFirstHalfExtraTime, 100);
}

function updateFirstHalfExtraTime() {
    elapsedTime = Date.now() - startTime;
    document.getElementById('firstHalfExtraTime').textContent = formatTime(elapsedTime);
}

function startSecondHalfExtraTime() {
    startTime = Date.now();
    timerInterval = setInterval(updateSecondHalfExtraTime, 100);
}

function updateSecondHalfExtraTime() {
    elapsedTime = Date.now() - startTime;
    document.getElementById('secondHalfExtraTime').textContent = formatTime(elapsedTime);
}

function resetAllTimers() {
    startTime = null;
    elapsedTime = 0;
    totalElapsedTime = 0;
    firstHalfComplete = false;
    secondHalfStarted = false;
    firstHalfStartTime = null;
    firstHalfStopTime = null;
    secondHalfStartTime = null;
    secondHalfStopTime = null;

    document.getElementById('firstHalfStartTime').textContent = "--:--:--";
    document.getElementById('firstHalfTime').textContent = "00:00:00.000";
    document.getElementById('firstHalfExtraTime').textContent = "00:00:00.000";
    document.getElementById('firstHalfStopTime').textContent = "--:--:--";

    document.getElementById('secondHalfStartTime').textContent = "--:--:--";
    document.getElementById('secondHalfTime').textContent = "00:00:00.000";
    document.getElementById('secondHalfExtraTime').textContent = "00:00:00.000";
    document.getElementById('secondHalfStopTime').textContent = "--:--:--";

    document.getElementById('totalTime').textContent = "00:00:00.000";
}

function formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const millis = milliseconds % 1000;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

function formatClockTime(date) {
    return date.toTimeString().split(' ')[0]; // Returns HH:MM:SS from Date object
}
