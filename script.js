// Clase base para manejar funcionalidades comunes de timer
class BaseTimer {
  constructor(displayElement, startButton, resetButton) {
    this.displayElement = displayElement;
    this.startButton = startButton;
    this.resetButton = resetButton;
    this.isRunning = false;
    this.isPaused = false;
    this.intervalId = null;

    this.bindEvents();
  }

  bindEvents() {
    this.startButton.addEventListener("click", () => this.toggleTimer());
    this.resetButton.addEventListener("click", () => this.reset());
  }

  formatTime(totalCentiseconds) {
    const hours = Math.floor(totalCentiseconds / 360000);
    const minutes = Math.floor((totalCentiseconds % 360000) / 6000);
    const seconds = Math.floor((totalCentiseconds % 6000) / 100);
    const centiseconds = totalCentiseconds % 100;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  }

  updateButtonText() {
    if (!this.isRunning && !this.isPaused) {
      this.startButton.textContent = "Iniciar";
    } else if (this.isRunning) {
      this.startButton.textContent = "Pausar";
    } else if (this.isPaused) {
      this.startButton.textContent = "Continuar";
    }
  }

  updateDisplay(paused = false) {
    if (paused) {
      this.displayElement.classList.add("paused");
    } else {
      this.displayElement.classList.remove("paused");
    }
  }

  toggleTimer() {
    if (!this.isRunning && !this.isPaused) {
      this.start();
    } else if (this.isRunning) {
      this.pause();
    } else if (this.isPaused) {
      this.resume();
    }
  }
}

// Cronómetro
class Stopwatch extends BaseTimer {
  constructor(displayElement, startButton, resetButton) {
    super(displayElement, startButton, resetButton);
    this.centiseconds = 0;
    this.updateDisplayText();
  }

  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.intervalId = setInterval(() => {
      this.centiseconds++;
      this.updateDisplayText();
    }, 10);
    this.updateButtonText();
    this.updateDisplay();
  }

  pause() {
    this.isRunning = false;
    this.isPaused = true;
    clearInterval(this.intervalId);
    this.updateButtonText();
    this.updateDisplay(true);
  }

  resume() {
    this.isRunning = true;
    this.isPaused = false;
    this.intervalId = setInterval(() => {
      this.centiseconds++;
      this.updateDisplayText();
    }, 10);
    this.updateButtonText();
    this.updateDisplay();
  }

  reset() {
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.intervalId);
    this.centiseconds = 0;
    this.updateDisplayText();
    this.updateButtonText();
    this.updateDisplay();
  }

  updateDisplayText() {
    this.displayElement.textContent = this.formatTime(this.centiseconds);
  }
}

// Cuenta atrás
class Countdown extends BaseTimer {
  constructor(displayElement, startButton, resetButton, timeInputManager) {
    super(displayElement, startButton, resetButton);
    this.timeInputManager = timeInputManager;
    this.totalCentiseconds = 0;
    this.remainingCentiseconds = 0;
    this.updateDisplayText();
  }

  start() {
    // Obtener el tiempo del input y normalizarlo
    const inputTime = this.timeInputManager.getTime();
    this.totalCentiseconds = this.normalizeTime(inputTime);

    if (this.totalCentiseconds === 0) {
      alert("Por favor, introduce un tiempo válido mayor que cero.");
      return;
    }

    this.remainingCentiseconds = this.totalCentiseconds;
    this.isRunning = true;
    this.isPaused = false;

    this.intervalId = setInterval(() => {
      this.remainingCentiseconds--;
      this.updateDisplayText();

      if (this.remainingCentiseconds <= 0) {
        this.finish();
      }
    }, 10);

    this.updateButtonText();
    this.updateDisplay();
  }

  pause() {
    this.isRunning = false;
    this.isPaused = true;
    clearInterval(this.intervalId);
    this.updateButtonText();
    this.updateDisplay(true);
  }

  resume() {
    this.isRunning = true;
    this.isPaused = false;
    this.intervalId = setInterval(() => {
      this.remainingCentiseconds--;
      this.updateDisplayText();

      if (this.remainingCentiseconds <= 0) {
        this.finish();
      }
    }, 10);
    this.updateButtonText();
    this.updateDisplay();
  }

  reset() {
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.intervalId);
    this.remainingCentiseconds = 0;
    this.updateDisplayText();
    this.updateButtonText();
    this.updateDisplay();
    this.timeInputManager.reset();
  }

  finish() {
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.intervalId);
    this.remainingCentiseconds = 0;
    this.updateDisplayText();
    this.updateButtonText();
    this.updateDisplay();
    alert("¡Tiempo agotado!");
  }

  normalizeTime(time) {
    let totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;

    // Normalizar minutos y segundos si exceden 60
    if (time.seconds >= 60) {
      const extraMinutes = Math.floor(time.seconds / 60);
      totalSeconds = time.hours * 3600 + (time.minutes + extraMinutes) * 60 + (time.seconds % 60);
    }

    if (time.minutes + Math.floor(time.seconds / 60) >= 60) {
      const totalMinutes = time.minutes + Math.floor(time.seconds / 60);
      const extraHours = Math.floor(totalMinutes / 60);
      totalSeconds = (time.hours + extraHours) * 3600 + (totalMinutes % 60) * 60 + (time.seconds % 60);
    }

    return totalSeconds * 100; // Convertir a centésimas
  }

  updateDisplayText() {
    this.displayElement.textContent = this.formatTime(this.remainingCentiseconds);
  }
}

// Gestor del input de tiempo personalizado
class TimeInputManager {
  constructor() {
    this.hoursElement = document.getElementById("hours-input");
    this.minutesElement = document.getElementById("minutes-input");
    this.secondsElement = document.getElementById("seconds-input");
    this.currentInput = "";
    this.maxLength = 6; // HHMMSS

    this.bindEvents();
    this.reset();
  }

  bindEvents() {
    // Eventos del teclado numérico
    document.querySelectorAll(".key-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const key = e.target.dataset.key;
        this.handleKeyInput(key);
      });
    });

    // Soporte para teclado físico
    document.addEventListener("keydown", (e) => {
      if (document.getElementById("countdown-section").classList.contains("active")) {
        if (e.key >= "0" && e.key <= "9") {
          this.handleKeyInput(e.key);
        } else if (e.key === "Backspace") {
          this.handleKeyInput("backspace");
        }
      }
    });
  }

  handleKeyInput(key) {
    if (key === "backspace") {
      this.currentInput = this.currentInput.slice(0, -1);
    } else if (key >= "0" && key <= "9" && this.currentInput.length < this.maxLength) {
      this.currentInput += key;
    }

    this.updateDisplay();
  }

  updateDisplay() {
    // Rellenar con ceros a la izquierda
    const padded = this.currentInput.padStart(6, "0");

    // Extraer horas, minutos y segundos
    const hours = padded.substring(0, 2);
    const minutes = padded.substring(2, 4);
    const seconds = padded.substring(4, 6);

    // Actualizar elementos
    this.hoursElement.textContent = hours;
    this.minutesElement.textContent = minutes;
    this.secondsElement.textContent = seconds;
  }

  getTime() {
    const padded = this.currentInput.padStart(6, "0");
    return {
      hours: parseInt(padded.substring(0, 2)),
      minutes: parseInt(padded.substring(2, 4)),
      seconds: parseInt(padded.substring(4, 6)),
    };
  }

  reset() {
    this.currentInput = "";
    this.updateDisplay();
  }
}

// Gestor principal de la aplicación
class TimerApp {
  constructor() {
    this.initializeElements();
    this.initializeTimers();
    this.bindModeSelector();
  }

  initializeElements() {
    // Elementos de navegación
    this.stopwatchBtn = document.getElementById("stopwatch-btn");
    this.countdownBtn = document.getElementById("countdown-btn");

    // Secciones
    this.stopwatchSection = document.getElementById("stopwatch-section");
    this.countdownSection = document.getElementById("countdown-section");

    // Elementos del cronómetro
    this.stopwatchDisplay = document.getElementById("stopwatch-display");
    this.stopwatchStartBtn = document.getElementById("stopwatch-start");
    this.stopwatchResetBtn = document.getElementById("stopwatch-reset");

    // Elementos de la cuenta atrás
    this.countdownDisplay = document.getElementById("countdown-display");
    this.countdownStartBtn = document.getElementById("countdown-start");
    this.countdownResetBtn = document.getElementById("countdown-reset");
  }

  initializeTimers() {
    // Inicializar gestor de input de tiempo
    this.timeInputManager = new TimeInputManager();

    // Inicializar cronómetro
    this.stopwatch = new Stopwatch(this.stopwatchDisplay, this.stopwatchStartBtn, this.stopwatchResetBtn);

    // Inicializar cuenta atrás
    this.countdown = new Countdown(this.countdownDisplay, this.countdownStartBtn, this.countdownResetBtn, this.timeInputManager);
  }

  bindModeSelector() {
    this.stopwatchBtn.addEventListener("click", () => {
      this.switchMode("stopwatch");
    });

    this.countdownBtn.addEventListener("click", () => {
      this.switchMode("countdown");
    });
  }

  switchMode(mode) {
    // Actualizar botones de navegación
    this.stopwatchBtn.classList.toggle("active", mode === "stopwatch");
    this.countdownBtn.classList.toggle("active", mode === "countdown");

    // Actualizar secciones
    this.stopwatchSection.classList.toggle("active", mode === "stopwatch");
    this.countdownSection.classList.toggle("active", mode === "countdown");

    // Pausar cualquier timer activo cuando se cambie de modo
    if (mode === "stopwatch" && (this.countdown.isRunning || this.countdown.isPaused)) {
      this.countdown.reset();
    } else if (mode === "countdown" && (this.stopwatch.isRunning || this.stopwatch.isPaused)) {
      this.stopwatch.reset();
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new TimerApp();
});
