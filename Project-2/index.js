let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const categorySelect = document.getElementById('categorySelect');

    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        priority: prioritySelect.value,
        category: categorySelect.value,
        completed: false,
        createdAt: new Date().toLocaleDateString()
    };

    tasks.unshift(newTask);
    taskInput.value = '';
    renderTasks();
    updateStats();
}

function renderTasks() {
    const container = document.getElementById('tasksContainer');
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 4rem; margin-bottom: 20px;">
                    ${currentFilter === 'completed' ? '🎉' : currentFilter === 'pending' ? '📋' : '📝'}
                </div>
                <h3>${getEmptyStateMessage()}</h3>
                <p>${getEmptyStateSubtext()}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <div class="task-content">
                ${editingTaskId === task.id ? `
                    <input type="text" class="edit-input" value="${task.text}" id="editInput-${task.id}">
                ` : `
                    <div class="task-text">${task.text}</div>
                    <div class="task-meta">
                        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                        <span class="category-badge">${task.category}</span>
                        <span>${task.createdAt}</span>
                    </div>
                `}
            </div>
            <div class="task-actions">
                ${editingTaskId === task.id ? `
                    <button class="save-btn" onclick="saveEdit(${task.id})">Save</button>
                    <button class="cancel-btn" onclick="cancelEdit()">Cancel</button>
                ` : `
                    <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                `}
            </div>
        </div>
    `).join('');
}

function getFilteredTasks() {
    switch (currentFilter) {
        case 'pending': return tasks.filter(task => !task.completed);
        case 'completed': return tasks.filter(task => task.completed);
        case 'high': return tasks.filter(task => task.priority === 'high');
        default: return tasks;
    }
}

function getEmptyStateMessage() {
    if (currentFilter === 'pending') return 'No pending tasks!';
    if (currentFilter === 'completed') return 'No completed tasks yet!';
    if (currentFilter === 'high') return 'No high priority tasks!';
    return 'No tasks yet!';
}

function getEmptyStateSubtext() {
    if (currentFilter === 'pending') return 'Great job! You\'ve completed all your tasks.';
    if (currentFilter === 'completed') return 'Complete some tasks to see them here.';
    if (currentFilter === 'high') return 'No urgent tasks at the moment.';
    return 'Add your first task above to get started.';
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
    }
}

function editTask(id) {
    editingTaskId = id;
    renderTasks();
    setTimeout(() => {
        const editInput = document.getElementById(`editInput-${id}`);
        if (editInput) {
            editInput.focus();
            editInput.select();
        }
    }, 100);
}

function saveEdit(id) {
    const editInput = document.getElementById(`editInput-${id}`);
    const newText = editInput.value.trim();
    if (newText === '') {
        alert('Task cannot be empty!');
        return;
    }
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.text = newText;
        editingTaskId = null;
        renderTasks();
    }
}

function cancelEdit() {
    editingTaskId = null;
    renderTasks();
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        updateStats();
    }
}

function filterTasks(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderTasks();
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
});

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('edit-input')) {
        const taskId = parseInt(e.target.id.split('-')[1]);
        saveEdit(taskId);
    }
});

updateStats();
