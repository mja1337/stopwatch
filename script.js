const HALF_DURATION = 45 * 60 * 1000;  // 45 minutes in milliseconds
let firstHalfStartTime = null;
let secondHalfStartTime = null;
let firstHalfElapsedTime = 0;
let secondHalfElapsedTime = 0;
let firstHalfComplete = false;
let secondHalfStarted = false;
let timerInterval = null;
let stopped = false;

document.getElementById('startBtn').addEventListener('click', function() {
    if (stopped) return;

    if (!firstHalfComplete && !secondHalfStarted) {
        if (firstHalfStartTime === null) {
            firstHalfStartTime = Date.now();
            document.getElementById('firstHalfStartTime').textContent = formatClockTime(new Date(firstHalfStartTime));
        } else {
            firstHalfStartTime = Date.now() - firstHalfElapsedTime;
        }
        startTimer();
    } else if (firstHalfComplete && !secondHalfStarted) {
        if (secondHalfStartTime === null) {
            secondHalfStartTime = Date.now();
            document.getElementById('secondHalfStartTime').textContent = formatClockTime(new Date(secondHalfStartTime));
        } else {
            secondHalfStartTime = Date.now() - secondHalfElapsedTime;
        }
        secondHalfStarted = true;
        startTimer();
    }
});

document.getElementById('pauseBtn').addEventListener('click', function() {
    if (stopped) return;
    clearInterval(timerInterval);
    updateElapsedTime();
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
    if (stopped) return;
    clearInterval(timerInterval);
    updateElapsedTime();
    stopped = true;

    // Show the download button
    document.getElementById('downloadBtn').style.display = 'inline-block';

    // Existing logic for stopping the timer
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
    resetAllTimers();
    stopped = false;
    document.getElementById('downloadBtn').style.display = 'none'; // Hide the download button after reset
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    const timerData = {
        firstHalf: {
            startTime: firstHalfStartTime,
            elapsedTime: firstHalfElapsedTime,
            complete: firstHalfComplete
        },
        secondHalf: {
            startTime: secondHalfStartTime,
            elapsedTime: secondHalfElapsedTime,
            started: secondHalfStarted,
            complete: stopped
        }
    };

    const now = new Date();
    const dateString = now.toISOString().slice(0, 19).replace(/-/g, '').replace(/:/g, '').replace('T', '-');
    const filename = `rbfc-stopwatch-data-${dateString}.txt`;

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(timerData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTime, 50);
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
        document.getElementById('secondHalfTime').textContent = formatTime(HALF_DURATION + 60000 + secondHalfElapsedTime); // Start from 46:00
    } else {
        document.getElementById('secondHalfTime').textContent = formatTime(HALF_DURATION * 2 + 60000); // Cap at 90:00
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

    // Hide the download button after reset
    document.getElementById('downloadBtn').style.display = 'none';
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
