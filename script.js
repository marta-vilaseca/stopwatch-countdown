const appContainer = document.querySelector("#app .container");
const btnStopwatch = document.getElementById("btn-stopwatch");
const btnCountdown = document.getElementById("btn-countdown");

/* HTML Structure checks */
if (!appContainer) {
  console.error("Container for the app not found! Make sure the HTML structure is correct.");
}

if (!btnStopwatch || !btnCountdown) {
  console.error("Buttons for switching modes not found! Make sure the HTML structure is correct.");
}

/* Initialize variables */
let timerId = null;
let currentTime = 0; // in milliseconds
let mode = "stopwatch";
let isRunning = false;

/* Helper Functions */
function formatTime(time) {
  const totalSeconds = Math.floor(time / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const centiseconds = String(Math.floor((time % 1000) / 10)).padStart(2, "0");
  return `${minutes}:${seconds}:${centiseconds}`;
}

function updateDisplay() {
  const display = document.getElementById("display");
  if (display) display.textContent = formatTime(currentTime);
}

function setButtonState(button, state) {
  button.classList.remove("start", "paused", "running");
  button.classList.add(state);

  switch (state) {
    case "start":
      button.textContent = "Start";
      button.title = "Start the stopwatch";
      break;
    case "paused":
      button.textContent = "Continue";
      button.title = "Continue the stopwatch";
      break;
    case "running":
      button.textContent = "Pause";
      button.title = "Pause the stopwatch";
      break;
  }
}

/* Timer Functions */
function startTimer() {
  if (isRunning) return; // Prevent multiple intervals
  isRunning = true;

  const interval = 10;

  timerId = setInterval(() => {
    if (mode === "stopwatch") {
      currentTime += interval;
      updateDisplay();
    } else if (mode === "countdown") {
      if (currentTime > 0) {
        currentTime -= interval;
        updateDisplay();
      }
      if (currentTime <= 0) {
        currentTime = 0; // Prevent negative values
        updateDisplay();
        stopTimer();
        alert("Countdown finished!");
      }
    }
  }, interval);
}

function stopTimer() {
  clearInterval(timerId);
  isRunning = false;
  timerId = null;
}

function resetTimer() {
  if (timerId) stopTimer();
  currentTime = 0;
  updateDisplay();
}

/* UI Setup - Stopwatch */
function setStopwatchUI() {
  appContainer.innerHTML = `
    <div id="display" class="display">00:00:00</div>
    <div id="controls" class="controls">
      <button id="btn-start" title="Start the stopwatch" class="start">Start</button>
      <button id="btn-reset" title="Reset the stopwatch" class="reset">Reset</button>
    </div>
  `;

  const startButton = document.getElementById("btn-start");

  startButton.onclick = () => {
    if (timerId === null) {
      startTimer();
      isRunning = true;
      setButtonState(startButton, "running");
      display.classList.remove("blink");
    } else if (isRunning) {
      stopTimer();
      isRunning = false;
      setButtonState(startButton, "paused");
      display.classList.add("blink");
    } else {
      startTimer();
      isRunning = true;
      setButtonState(startButton, "running");
      display.classList.remove("blink");
    }
  };

  const resetButton = document.getElementById("btn-reset");
  resetButton.onclick = () => {
    resetTimer();
    setButtonState(startButton, "start");
    display.classList.remove("blink");
  };
}

/* UI Setup - Countdown */
function setCountdownUI() {
  appContainer.innerHTML = `
    <div id="display" class="display">00:00:00</div>
    <input type="number" id="countdown-input" min="1" placeholder="Seconds" />
    <div id="controls" class="controls">
      <button id="btn-start" class="start" title="Start countdown">Start</button>
      <button id="btn-reset" class="reset" title="Reset countdown">Reset</button>
    </div>
  `;

  const display = document.getElementById("display");
  const input = document.getElementById("countdown-input");
  const startButton = document.getElementById("btn-start");
  const resetButton = document.getElementById("btn-reset");

  let hasStarted = false;

  input.focus();

  input.addEventListener("input", () => {
    const val = Number(input.value.trim());
    if (!isNaN(val) && val > 0 && val <= 3600) {
      display.textContent = formatTime(val * 1000);
    } else {
      display.textContent = "00:00:00";
    }
  });

  startButton.onclick = () => {
    if (!isRunning) {
      if (!hasStarted) {
        const val = Number(input.value.trim());
        if (isNaN(val) || val <= 0 || val > 3600) {
          alert("Please enter a valid number between 1 and 3600");
          return;
        }
        currentTime = val * 1000;
        hasStarted = true;
      }

      startTimer();
      isRunning = true;
      input.disabled = true;
      setButtonState(startButton, "running");
      display.classList.remove("blink");
    } else {
      stopTimer();
      isRunning = false;
      setButtonState(startButton, "paused");
      display.classList.add("blink");
    }
  };

  resetButton.onclick = () => {
    stopTimer();
    isRunning = false;
    timerId = null;
    hasStarted = false;
    currentTime = 0;
    input.disabled = false;
    input.value = "";
    display.textContent = "00:00:00";
    setButtonState(startButton, "start");
    display.classList.remove("blink");
  };
}

/* Mode Switching */
function switchToStopwatch() {
  mode = "stopwatch";
  setStopwatchUI();
  resetTimer();
}

function switchToCountdown() {
  mode = "countdown";
  setCountdownUI();
  resetTimer();
}

btnStopwatch.onclick = switchToStopwatch;
btnCountdown.onclick = switchToCountdown;

// Start in stopwatch mode
switchToStopwatch();
