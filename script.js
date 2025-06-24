const appContainer = document.querySelector("#app .container");
const btnStopwatch = document.getElementById("btn-stopwatch");
const btnCountdown = document.getElementById("btn-countdown");

/* HTML Structure checks */
if (!appContainer || !btnStopwatch || !btnCountdown) {
  console.error("Essential DOM elements not found. Make sure the HTML structure is correct.");
}

/* Timer Controller */
const TimerController = {
  timerId: null,
  currentTime: 0,
  mode: "stopwatch",
  isRunning: false,
  interval: 10,

  // Callbacks that UI will set
  onTick: null,
  onStart: null,
  onStop: null,
  onReset: null,
  onFinish: null,

  start() {
    if (this.isRunning) return; // Prevent multiple intervals
    this.isRunning = true;

    if (this.onStart) this.onStart();

    this.timerId = setInterval(() => {
      if (this.mode === "stopwatch") {
        this.currentTime += this.interval;
      } else if (this.mode === "countdown") {
        this.currentTime -= this.interval;
        if (this.currentTime <= 0) {
          this.currentTime = 0;
          this.stop();
          if (this.onFinish) this.onFinish();
          return;
        }
      }
      if (this.onTick) this.onTick(this.currentTime);
    }, this.interval);
  },

  stop() {
    if (!this.isRunning) return;
    clearInterval(this.timerId);
    this.isRunning = false;
    this.timerId = null;

    if (this.onStop) this.onStop();
  },

  reset() {
    this.stop();
    this.currentTime = 0;

    if (this.onReset) this.onReset();
  },

  setTime(ms) {
    this.currentTime = ms;
    if (this.onTick) this.onTick(this.currentTime);
  },

  setMode(mode) {
    this.mode = mode;
    this.reset();
  },
};

/* Helper Functions */
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  const hoursStr = String(hours).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");
  const centisecondsStr = String(centiseconds).padStart(2, "0");

  return `${hoursStr}:${minutesStr}:${secondsStr}:<span class="centiseconds">${centisecondsStr}</span>`;
}

function normalizeTime(hours, minutes, seconds) {
  // Start with the input values
  let totalSeconds = seconds;
  let totalMinutes = minutes;
  let totalHours = hours;

  // Normalize seconds to minutes
  if (totalSeconds >= 60) {
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;
  }

  // Normalize minutes to hours
  if (totalMinutes >= 60) {
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;
  }

  return {
    hours: totalHours,
    minutes: totalMinutes,
    seconds: totalSeconds,
  };
}

/* HTML Template Functions */
function getDisplayHTML() {
  return `<div id="display" class="display">00:00:00:<span class="centiseconds">00</span></div>`;
}

function getControlsHTML() {
  return `
    <div id="controls" class="controls">
      <button id="btn-start" class="start">Start</button>
      <button id="btn-reset" class="reset">Reset</button>
    </div>
  `;
}

function getKeypadHTML() {
  return `
    <div id="keypad" class="keypad">
      <button>1</button><button>2</button><button>3</button>
      <button>4</button><button>5</button><button>6</button>
      <button>7</button><button>8</button><button>9</button>
      <button class="double-width">←</button><button>0</button>
    </div>
  `;
}

/* UI Helper Functions */
function updateDisplay(time) {
  const display = document.getElementById("display");
  if (display) display.innerHTML = formatTime(time);
}

function setButtonState(button, state) {
  if (!button) return; // Ensure button exists
  button.classList.remove("start", "paused", "running");
  button.classList.add(state);
  const buttonText = { start: "Start", paused: "Continue", running: "Pause" };
  button.textContent = buttonText[state];
  button.title = `${buttonText[state]} the timer`;
}

function setDisplayBlink(shouldBlink) {
  const display = document.getElementById("display");
  if (display) {
    if (shouldBlink) {
      display.classList.add("blink");
    } else {
      display.classList.remove("blink");
    }
  }
}

/* UI Setup - Stopwatch */
function setStopwatchUI() {
  appContainer.innerHTML = `
    ${getDisplayHTML()}
    ${getControlsHTML()}
  `;

  const startButton = document.getElementById("btn-start");
  const resetButton = document.getElementById("btn-reset");

  // Set up timer callbacks
  TimerController.onTick = updateDisplay;
  TimerController.onStart = () => {
    setButtonState(startButton, "running");
    setDisplayBlink(false);
  };
  TimerController.onStop = () => {
    setButtonState(startButton, "paused");
    setDisplayBlink(true);
  };
  TimerController.onReset = () => {
    setButtonState(startButton, "start");
    setDisplayBlink(false);
    updateDisplay(0);
  };
  TimerController.onFinish = null; // Not needed for stopwatch

  startButton.onclick = () => {
    if (!TimerController.isRunning && TimerController.timerId === null) {
      TimerController.start();
    } else if (TimerController.isRunning) {
      TimerController.stop();
    } else {
      TimerController.start();
    }
  };

  resetButton.onclick = () => {
    TimerController.reset();
  };
  // Initialize display
  updateDisplay(TimerController.currentTime);
}

/* UI Setup - Countdown */
function setCountdownUI() {
  appContainer.innerHTML = `
    ${getDisplayHTML()}
    ${getKeypadHTML()}
    ${getControlsHTML()}
  `;

  const keypad = document.getElementById("keypad");
  const startButton = document.getElementById("btn-start");
  const resetButton = document.getElementById("btn-reset");

  let inputBuffer = "";

  function updateInputDisplay() {
    // Pad input to 6 digits for HHMMSS format
    const padded = inputBuffer.padStart(6, "0").slice(-6);
    const hours = padded.slice(0, 2);
    const minutes = padded.slice(2, 4);
    const seconds = padded.slice(4, 6);
    const display = document.getElementById("display");
    if (display) {
      display.innerHTML = `${hours}:${minutes}:${seconds}:<span class="centiseconds">00</span>`;
    }
  }

  function clearInput() {
    inputBuffer = "";
    updateInputDisplay();
  }

  // Set up timer callbacks
  TimerController.onTick = updateDisplay;
  TimerController.onStart = () => {
    setButtonState(startButton, "running");
    setDisplayBlink(false);
  };
  TimerController.onStop = () => {
    setButtonState(startButton, "paused");
    setDisplayBlink(true);
  };
  TimerController.onReset = () => {
    setButtonState(startButton, "start");
    setDisplayBlink(false);
    clearInput();
  };
  TimerController.onFinish = () => {
    setButtonState(startButton, "start");
    setDisplayBlink(false);
    alert("Countdown finished!");
  };

  keypad.addEventListener("click", (e) => {
    if (TimerController.isRunning) return; // Don't allow input while running

    const key = e.target.textContent;

    if (key >= "0" && key <= "9") {
      if (inputBuffer.length < 6) {
        inputBuffer += key;
        updateInputDisplay();
      }
    } else if (key === "←") {
      inputBuffer = inputBuffer.slice(0, -1);
      updateInputDisplay();
    }
  });

  startButton.onclick = () => {
    if (!TimerController.isRunning) {
      const padded = inputBuffer.padStart(6, "0");
      const inputHours = parseInt(padded.slice(0, 2));
      const inputMinutes = parseInt(padded.slice(2, 4));
      const inputSeconds = parseInt(padded.slice(4, 6));

      // Normalize the time
      const normalized = normalizeTime(inputHours, inputMinutes, inputSeconds);
      const totalMs = normalized.hours * 3600000 + normalized.minutes * 60000 + normalized.seconds * 1000;

      if (totalMs <= 0) {
        alert("Enter a time greater than 00:00:00");
        return;
      }

      TimerController.setTime(totalMs);
      TimerController.start();
    } else {
      TimerController.stop();
    }
  };

  resetButton.onclick = () => {
    TimerController.reset();
  };

  // Initialize
  updateInputDisplay();
}

/* Mode Switching */
function switchToStopwatch() {
  TimerController.setMode("stopwatch");
  setStopwatchUI();
}

function switchToCountdown() {
  TimerController.setMode("countdown");
  setCountdownUI();
}

btnStopwatch.onclick = switchToStopwatch;
btnCountdown.onclick = switchToCountdown;

// Start in stopwatch mode
switchToStopwatch();
