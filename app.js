let tasks = JSON.parse(localStorage.getItem("nexora_tasks")) || [];
let selectedCat = "critical";

function save() {
  localStorage.setItem("nexora_tasks", JSON.stringify(tasks));
}

function toggleForm() {
  document.getElementById("formPanel").classList.toggle("hidden");
}

function selectCat(btn) {
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  selectedCat = btn.dataset.cat;
}

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  if (!text) return;

  const urgency = parseInt(document.getElementById("urgency").value);
  const impact = parseInt(document.getElementById("impact").value);
  const energy = parseInt(document.getElementById("energy").value);

  tasks.push({
    id: Date.now(),
    text,
    urgency,
    impact,
    energy,
    category: selectedCat,
    done: false,
    deferred: 0,
    createdAt: Date.now()
  });

  document.getElementById("taskInput").value = "";
  document.getElementById("formPanel").classList.add("hidden");
  document.getElementById("urgency").value = 5;
  document.getElementById("impact").value = 5;
  document.getElementById("energy").value = 5;
  document.getElementById("urgVal").textContent = "5";
  document.getElementById("impVal").textContent = "5";
  document.getElementById("enVal").textContent = "5";

  save();
  render();
}

// Enter key: add with current slider values
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("taskInput").addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
  });
});

function score(t) {
  const catBonus = t.category === "critical" ? 2 : t.category === "operative" ? 1 : 0;
  return (
    t.urgency * 0.40 +
    t.impact * 0.35 +
    (10 - t.energy) * 0.10 +
    catBonus
  );
}

function getTop() {
  return tasks
    .filter(t => !t.done)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);
}

function getAll() {
  return tasks
    .filter(t => !t.done)
    .sort((a, b) => score(b) - score(a));
}

function catLabel(cat) {
  return { critical: "CRÍTICO", operative: "OPERATIVO", creative: "CREATIVO" }[cat] || cat;
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function taskHTML(t, isTop) {
  let warn = "";
  if (t.deferred >= 2) {
    warn = `<div class="warn">La has movido ${t.deferred} veces. ¿La haces hoy o la eliminamos?</div>`;
  } else if (t.deferred === 1) {
    warn = `<div class="warn-soft">Pospuesta una vez.</div>`;
  }

  return `
    <div class="task cat-${t.category}${isTop ? " top-task" : ""}">
      <div class="task-header">
        <span class="cat-tag">${catLabel(t.category)}</span>
        <span class="score">${score(t).toFixed(1)}</span>
      </div>
      <div class="task-text">${escapeHTML(t.text)}</div>
      ${warn}
      <div class="task-actions">
        <button class="btn-exec" onclick="done(${t.id})">&#10003; EJECUTAR</button>
        <button class="btn-defer" onclick="defer(${t.id})">&#8594; POSPONER</button>
        <button class="btn-elim" onclick="eliminate(${t.id})">&#10007; ELIMINAR</button>
      </div>
    </div>
  `;
}

function render() {
  const topContainer = document.getElementById("top");
  const allContainer = document.getElementById("allTasks");
  const countEl = document.getElementById("count");

  const top = getTop();
  const all = getAll();

  topContainer.innerHTML = top.length
    ? top.map(t => taskHTML(t, true)).join("")
    : "<p class='empty'>Sin tareas. Sistema libre.</p>";

  const topIds = new Set(top.map(t => t.id));
  const rest = all.filter(t => !topIds.has(t.id));
  allContainer.innerHTML = rest.map(t => taskHTML(t, false)).join("");

  countEl.textContent = all.length ? `(${all.length})` : "";
}

function done(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: true } : t);
  save();
  render();
}

function defer(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, deferred: (t.deferred || 0) + 1 } : t);
  save();
  render();
}

function eliminate(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

render();
