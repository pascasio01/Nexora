
	let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = document.getElementById("taskInput").value;
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    urgency: Math.random() * 10,
    impact: Math.random() * 10,
    energy: Math.random() * 10,
    done: false
  });

  document.getElementById("taskInput").value = "";
  save();
  render();
}

function score(t) {
  return (
    t.urgency * 0.35 +
    t.impact * 0.30 +
    t.energy * 0.20
  );
}

function getTop() {
  return tasks
    .filter(t => !t.done)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);
}

function render() {
  const container = document.getElementById("top");
  container.innerHTML = "";

  const top = getTop();

  top.forEach(t => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
      ${t.text}
      <br>
      <small>Score: ${score(t).toFixed(2)}</small>
      <br>
      <button onclick="done(${t.id})">✓</button>
    `;
    container.appendChild(div);
  });
}

function done(id) {
  tasks = tasks.map(t => t.id === id ? {...t, done: true} : t);
  save();
  render();
}

render();


