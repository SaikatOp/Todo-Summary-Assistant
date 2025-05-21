const apiUrl = 'http://localhost:8080/api/tasks';

async function fetchTasks() {
  const res = await fetch(apiUrl);
  const tasks = await res.json();
  displayTasks(tasks);
  updateSummary(tasks);
}

function displayTasks(tasks) {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <span>${task.title}</span>
      <div>
        <button onclick="toggleComplete(${task.id}, ${!task.completed})">
          ${task.completed ? 'Undo' : 'Done'}
        </button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById('taskInput');
  const title = input.value.trim();
  if (!title) return;
  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  input.value = '';
  fetchTasks();
}

async function toggleComplete(id, status) {
  await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: status })
  });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  fetchTasks();
}

function updateSummary(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById('total').textContent = total;
  document.getElementById('completed').textContent = completed;
  document.getElementById('pending').textContent = pending;
}

fetchTasks();
