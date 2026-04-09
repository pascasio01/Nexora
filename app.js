
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const MAX_TIME_HOURS = 72;
const SCORE_DECIMALS = 2;
const METRIC_DECIMALS = 1;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function normalizeTask(task) {
  const createdAt = Number(task.createdAt) || Number(task.id) || Date.now();
  return {
    ...task,
    urgency: clamp(Number(task.urgency) || 5, 0, 10),
    impact: clamp(Number(task.impact) || 5, 0, 10),
    createdAt,
    done: Boolean(task.done)
  };
}

tasks = tasks.map(normalizeTask);

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTimeWithoutDoingHours(task) {
  const since = task.lastDoneAt || task.createdAt;
  return Math.max(0, (Date.now() - since) / 3600000);
}

function getTimeScore(task) {
  return clamp((getTimeWithoutDoingHours(task) / MAX_TIME_HOURS) * 10, 0, 10);
}

function score(task) {
  const urgencyContribution = task.urgency * 0.45;
  const impactContribution = task.impact * 0.35;
  const timeContribution = getTimeScore(task) * 0.2;

  return {
    total: urgencyContribution + impactContribution + timeContribution,
    urgencyContribution,
    impactContribution,
    timeContribution
  };
}

function sanitizeTaskText(text) {
  return text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = sanitizeTaskText(input.value);
  if (!text) return;

  tasks.push(
    normalizeTask({
      id: Date.now(),
      text,
      urgency: 5,
      impact: 5,
      createdAt: Date.now(),
      done: false
    })
  );

  input.value = "";
  save();
  render();
}

function getRankedPendingTasks() {
  return tasks
    .filter(task => !task.done)
    .map(task => {
      const scoring = score(task);
      return {
        ...task,
        scoring,
        timeWithoutDoingHours: getTimeWithoutDoingHours(task)
      };
    })
    .sort((a, b) => b.scoring.total - a.scoring.total);
}

function formatHours(hours) {
  if (hours < 24) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}d`;
}

function buildReason(mainTask, secondTask) {
  const factors = [
    { key: "urgencia", value: mainTask.scoring.urgencyContribution },
    { key: "impacto", value: mainTask.scoring.impactContribution },
    { key: "tiempo sin hacerla", value: mainTask.scoring.timeContribution }
  ].sort((a, b) => b.value - a.value);

  const lead = secondTask
    ? ` Supera a la siguiente tarea por ${(
        mainTask.scoring.total - secondTask.scoring.total
      ).toFixed(SCORE_DECIMALS)} puntos.`
    : "";

  return `Es la prioridad #1 porque tiene el mayor score total, con mayor peso actual en ${factors[0].key}.${lead}`;
}

function taskMeta(task) {
  return `Score ${task.scoring.total.toFixed(SCORE_DECIMALS)}. Urgencia ${task.urgency.toFixed(METRIC_DECIMALS)}. Impacto ${task.impact.toFixed(METRIC_DECIMALS)}. Tiempo ${formatHours(task.timeWithoutDoingHours)}.`;
}

function render() {
  const ranked = getRankedPendingTasks();
  const mainEl = document.getElementById("mainTask");
  const secondaryEl = document.getElementById("secondaryTasks");

  mainEl.innerHTML = "";
  secondaryEl.innerHTML = "";

  if (!ranked.length) {
    mainEl.innerHTML = `<div class="empty">No hay tareas pendientes. Agrega una nueva tarea.</div>`;
    return;
  }

  const mainTask = ranked[0];
  const secondaries = ranked.slice(1, 3);
  const mainCard = document.createElement("article");
  mainCard.className = "card main-card";

  const mainTitle = document.createElement("h4");
  mainTitle.className = "task-title";
  mainTitle.textContent = mainTask.text;

  const mainReason = document.createElement("p");
  mainReason.className = "main-reason";
  mainReason.textContent = buildReason(mainTask, secondaries[0]);

  const mainMeta = document.createElement("p");
  mainMeta.className = "meta";
  mainMeta.textContent = taskMeta(mainTask);

  const mainBtn = document.createElement("button");
  mainBtn.textContent = "Marcar como hecha ✓";
  mainBtn.addEventListener("click", () => done(mainTask.id));

  mainCard.append(mainTitle, mainReason, mainMeta, mainBtn);
  mainEl.appendChild(mainCard);

  if (!secondaries.length) {
    secondaryEl.innerHTML = `<div class="empty">No hay tareas secundarias por ahora.</div>`;
    return;
  }

  secondaries.forEach(task => {
    const card = document.createElement("article");
    card.className = "card secondary-card";

    const title = document.createElement("h4");
    title.className = "task-title";
    title.textContent = task.text;

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = taskMeta(task);

    const btn = document.createElement("button");
    btn.textContent = "Hecha ✓";
    btn.addEventListener("click", () => done(task.id));

    card.append(title, meta, btn);
    secondaryEl.appendChild(card);
  });
}

function done(id) {
  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, done: true, lastDoneAt: Date.now() }
      : task
  );
  save();
  render();
}

function setupEvents() {
  const input = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");

  addBtn.addEventListener("click", addTask);
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") addTask();
  });
}

setupEvents();
render();
