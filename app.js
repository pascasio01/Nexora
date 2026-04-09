
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

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
  return clamp((getTimeWithoutDoingHours(task) / 72) * 10, 0, 10);
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

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;

  tasks.push(
    normalizeTask({
      id: Date.now(),
      text,
      urgency: Math.random() * 10,
      impact: Math.random() * 10,
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
      ).toFixed(2)} puntos.`
    : "";

  return `Es la prioridad #1 porque domina en ${factors[0].key} y mantiene el mayor score total.${lead}`;
}

function taskMeta(task) {
  return `Score ${task.scoring.total.toFixed(2)} · Urgencia ${task.urgency.toFixed(1)} · Impacto ${task.impact.toFixed(1)} · Tiempo ${formatHours(task.timeWithoutDoingHours)}`;
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

  mainEl.innerHTML = `
    <article class="card main-card">
      <h4 class="task-title">${mainTask.text}</h4>
      <p class="main-reason">${buildReason(mainTask, secondaries[0])}</p>
      <p class="meta">${taskMeta(mainTask)}</p>
      <button onclick="done(${mainTask.id})">Marcar como hecha ✓</button>
    </article>
  `;

  if (!secondaries.length) {
    secondaryEl.innerHTML = `<div class="empty">No hay tareas secundarias por ahora.</div>`;
    return;
  }

  secondaries.forEach(task => {
    const card = document.createElement("article");
    card.className = "card secondary-card";
    card.innerHTML = `
      <h4 class="task-title">${task.text}</h4>
      <p class="meta">${taskMeta(task)}</p>
      <button onclick="done(${task.id})">Hecha ✓</button>
    `;
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

render();

