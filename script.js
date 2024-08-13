let firstHalfTimer, firstHalfExtraTimer, secondHalfTimer, secondHalfExtraTimer, totalTimeTimer;
let firstHalfMilliseconds = 0, firstHalfExtraMilliseconds = 0, secondHalfMilliseconds = 0, secondHalfExtraMilliseconds = 0, totalMilliseconds = 0;
let isFirstHalf = true, firstHalfComplete = false, isPaused = false;

document.getElementById('startBtn').addEventListener('click', function() {
    if (isPaused) {
        if (firstHalfComplete) {
            if (firstHalfMilliseconds >= 45 * 60 * 1000) {
                startFirstHalfExtraTime();
            } else {
                startSecondHalf();
            }
        } else {
            startFirstHalf();
        }
        startTotalTime();
        isPaused = false;
    } else {
        if (isFirstHalf && !firstHalfComplete) {
            startFirstHalf();
        } else {
            startSecondHalf();
        }
        startTotalTime();
    }
});

document.getElementById('pauseBtn').addEventListener('click', function() {
    isPaused = true;
    pauseTotalTime();
    
    if (isFirstHalf && !firstHalfComplete) {
        pauseFirstHalf();
        firstHalfComplete = true; 
        isFirstHalf = false;
    } else if (!isFirstHalf && firstHalfComplete) {
        pauseSecondHalf();
    }
});

document.getElementById('stopBtn').addEventListener('click', function() {
    stopAllTimers();
});

document.getElementById('resetBtn').addEventListener('click', function() {
    resetAllTimers();
});

function startFirstHalf() {
    if (!firstHalfTimer) {
        firstHalfTimer = setInterval(function() {
            firstHalfMilliseconds += 10;
            document.getElementById('firstHalfTime').textContent = formatTime(firstHalfMilliseconds);
            if (firstHalfMilliseconds >= 45 * 60 * 1000) {
                firstHalfComplete = true;
                pauseFirstHalf();
                startFirstHalfExtraTime();
            }
        }, 10);
    }
}

function pauseFirstHalf() {
    clearInterval(firstHalfTimer);
    firstHalfTimer = null;
}

function startFirstHalfExtraTime() {
    if (!firstHalfExtraTimer) {
        firstHalfExtraTimer = setInterval(function() {
            firstHalfExtraMilliseconds += 10;
            document.getElementById('firstHalfExtraTime').textContent = formatTime(firstHalfExtraMilliseconds);
        }, 10);
    }
}

function pauseFirstHalfExtraTime() {
    clearInterval(firstHalfExtraTimer);
    firstHalfExtraTimer = null;
}

function startSecondHalf() {
    if (!secondHalfTimer) {
        secondHalfMilliseconds = 0; 
        secondHalfTimer = setInterval(function() {
            secondHalfMilliseconds += 10;
            document.getElementById('secondHalfTime').textContent = formatTime(secondHalfMilliseconds);
            if (secondHalfMilliseconds >= 45 * 60 * 1000) {
                pauseSecondHalf();
                startSecondHalfExtraTime();
            }
        }, 10);
    }
}

function pauseSecondHalf() {
    clearInterval(secondHalfTimer);
    secondHalfTimer = null;
}

function startSecondHalfExtraTime() {
    if (!secondHalfExtraTimer) {
        secondHalfExtraTimer = setInterval(function() {
            secondHalfExtraMilliseconds += 10;
            document.getElementById('secondHalfExtraTime').textContent = formatTime(secondHalfExtraMilliseconds);
        }, 10);
    }
}

function pauseSecondHalfExtraTime() {
    clearInterval(secondHalfExtraTimer);
    secondHalfExtraTimer = null;
}

function startTotalTime() {
    if (!totalTimeTimer) {
        totalTimeTimer = setInterval(function() {
            totalMilliseconds += 10;
            document.getElementById('totalTime').textContent = formatTime(totalMilliseconds);
        }, 10);
    }
}

function pauseTotalTime() {
    clearInterval(totalTimeTimer);
    totalTimeTimer = null;
}

function stopAllTimers() {
    pauseFirstHalf();
    pauseFirstHalfExtraTime();
    pauseSecondHalf();
    pauseSecondHalfExtraTime();
    pauseTotalTime();
}

function resetAllTimers() {
    stopAllTimers();

    firstHalfMilliseconds = 0;
    firstHalfExtraMilliseconds = 0;
    secondHalfMilliseconds = 0;
    secondHalfExtraMilliseconds = 0;
    totalMilliseconds = 0;
    isFirstHalf = true;
    firstHalfComplete = false;
    isPaused = false;

    document.getElementById('firstHalfTime').textContent = "00:00:00.000";
    document.getElementById('firstHalfExtraTime').textContent = "00:00:00.000";
    document.getElementById('secondHalfTime').textContent = "00:00:00.000";
    document.getElementById('secondHalfExtraTime').textContent = "00:00:00.000";
    document.getElementById('totalTime').textContent = "00:00:00.000";
}

function formatTime(milliseconds) {
    let hours = Math.floor(milliseconds / 3600000);
    let minutes = Math.floor((milliseconds % 3600000) / 60000);
    let seconds = Math.floor((milliseconds % 60000) / 1000);
    let millis = milliseconds % 1000;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}
