function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadState() {
  return JSON.parse(localStorage.getItem("day_" + todayKey())) || {
    breakfastDone: false,
    lunchDone: false,
    preWorkoutDone: false,
    workoutDone: false,
    postWorkoutDone: false,
    dinnerDone: false,
    tomorrowRecipe: "",
    notes: "",
    bathroom: 0
  };
}

function saveState() {
  localStorage.setItem("day_" + todayKey(), JSON.stringify(state));
}

let state = loadState();

// DATA
document.getElementById("todayLabel").textContent =
  new Date().toLocaleDateString("it-IT", { weekday: "long", day: "2-digit", month: "2-digit" });

// CHECKBOX
document.querySelectorAll("input[type=checkbox]").forEach(chk => {
  const key = chk.dataset.key;
  chk.checked = state[key];
  chk.addEventListener("change", () => {
    state[key] = chk.checked;
    saveState();
  });
});

// RICETTA DOMANI
const recipeInput = document.getElementById("tomorrowRecipeInput");
recipeInput.value = state.tomorrowRecipe;
recipeInput.addEventListener("input", () => {
  state.tomorrowRecipe = recipeInput.value;
  saveState();
});

// NOTE
const notes = document.getElementById("dailyNotes");
notes.value = state.notes;
notes.addEventListener("input", () => {
  state.notes = notes.value;
  saveState();
});

// BAGNO
const bathCounter = document.getElementById("bathCounter");
bathCounter.textContent = state.bathroom;

document.getElementById("btnBathPlus").addEventListener("click", () => {
  state.bathroom++;
  bathCounter.textContent = state.bathroom;
  saveState();
});

// TIMER
let seconds = 90;
let interval = null;

function renderTimer() {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  document.getElementById("timerDisplay").textContent = `${m}:${s}`;
}

renderTimer();

document.getElementById("btnStartTimer").addEventListener("click", () => {
  if (interval) return;
  interval = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(interval);
      interval = null;
      seconds = 0;
    }
    renderTimer();
  }, 1000);
});

document.getElementById("btnResetTimer").addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  seconds = 90;
  renderTimer();
});

// PROGRESSI
function loadProgress() {
  return JSON.parse(localStorage.getItem("progress")) || [];
}

function saveProgress(arr) {
  localStorage.setItem("progress", JSON.stringify(arr));
}

function renderLastProgress() {
  const arr = loadProgress();
  const box = document.getElementById("lastProgress");
  if (!arr.length) {
    box.textContent = "Nessun dato.";
    return;
  }
  const last = arr[arr.length - 1];
  const lean = last.bodyFat ? (last.weight * (1 - last.bodyFat / 100)).toFixed(1) : "—";
  box.innerHTML = `
    Data: ${last.date}<br>
    Peso: ${last.weight} kg<br>
    % grasso: ${last.bodyFat || "—"}<br>
    Massa magra (stima): ${lean} kg
  `;
}

renderLastProgress();

document.getElementById("btnSaveWeight").addEventListener("click", () => {
  const w = parseFloat(document.getElementById("weightInput").value);
  const bf = parseFloat(document.getElementById("bodyFatInput").value);

  if (!w) {
    alert("Inserisci un peso valido");
    return;
  }

  const arr = loadProgress();
  arr.push({ date: todayKey(), weight: w, bodyFat: bf });
  saveProgress(arr);
  renderLastProgress();
});

// TAB
document.querySelectorAll(".tabbar button").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab-content").forEach(sec => {
      sec.classList.toggle("active", sec.id === "tab-" + tab);
    });
  });
});

