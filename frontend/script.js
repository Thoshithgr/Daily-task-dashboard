// DailyOps Dashboard Script
// API_BASE_URL is defined in config.js

// DOM Elements
let tasks = [];
let alerts = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadAlerts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        document.getElementById('taskModal').classList.remove('hidden');
    });

    document.getElementById('cancelTaskBtn').addEventListener('click', () => {
        document.getElementById('taskModal').classList.add('hidden');
    });

    document.getElementById('saveTaskBtn').addEventListener('click', createTask);
    document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
    document.getElementById('endOfDayBtn').addEventListener('click', generateEndOfDayReport);
}

// Load tasks
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/`);
        tasks = await response.json();
        renderTasks();
        updateStats();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Render tasks
function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item p-4 border rounded flex justify-between items-center">
            <div>
                <h3 class="font-semibold">${task.title}</h3>
                <p class="text-gray-500 text-sm">${task.description || ''}</p>
                <span class="text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}">${task.priority}</span>
            </div>
            <div class="flex space-x-2">
                <button onclick="updateTaskStatus(${task.id}, 'done')" class="text-green-600 hover:text-green-700">✓</button>
                <button onclick="deleteTask(${task.id})" class="text-red-600 hover:text-red-700">✗</button>
            </div>
        </div>
    `).join('');
}

// Create task
async function createTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('taskPriority').value;

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, priority })
        });

        if (response.ok) {
            document.getElementById('taskModal').classList.add('hidden');
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
            loadTasks();
        }
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

// Update task status
async function updateTaskStatus(taskId, status) {
    const task = tasks.find(t => t.id === taskId);
    try {
        await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...task, status })
        });
        loadTasks();
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Delete task
async function deleteTask(taskId) {
    try {
        await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE'
        });
        loadTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Load alerts
async function loadAlerts() {
    try {
        const response = await fetch(`${API_BASE_URL}/alerts/grafana`);
        const data = await response.json();
        alerts = data.alerts || [];
        renderAlerts();
    } catch (error) {
        console.error('Error loading alerts:', error);
        alerts = [];
        renderAlerts();
    }
}

// Render alerts
function renderAlerts() {
    const alertsList = document.getElementById('alertsList');
    if (alerts.length === 0) {
        alertsList.innerHTML = '<p class="text-gray-500">No active alerts</p>';
    } else {
        alertsList.innerHTML = alerts.map(alert => `
            <div class="p-4 border rounded ${getAlertColor(alert.severity)}">
                <h3 class="font-semibold">${alert.name}</h3>
                <p class="text-sm">Status: ${alert.status} | Severity: ${alert.severity}</p>
            </div>
        `).join('');
    }
}

// Update stats
function updateStats() {
    document.getElementById('tasksCount').textContent = tasks.length;
    document.getElementById('alertsCount').textContent = alerts.length;
}

// Save notes
function saveNotes() {
    const notes = document.getElementById('notesArea').value;
    localStorage.setItem('dailyops_notes', notes);
    alert('Notes saved!');
}

// Generate end of day report
async function generateEndOfDayReport() {
    const tasksCompleted = tasks.filter(t => t.status === 'done').length;
    const report = {
        tasks_completed: tasksCompleted,
        total_tasks: tasks.length,
        alerts_resolved: 0
    };

    try {
        const response = await fetch(`${API_BASE_URL}/alerts/slack/end-of-day`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(report)
        });
        alert('End of day report sent to Slack!');
    } catch (error) {
        console.error('Error sending report:', error);
        alert('Could not send report. Check console for details.');
    }
}

// Helper functions
function getPriorityColor(priority) {
    const colors = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
}

function getAlertColor(severity) {
    const colors = {
        critical: 'bg-red-100 border-red-300',
        warning: 'bg-yellow-100 border-yellow-300',
        info: 'bg-blue-100 border-blue-300'
    };
    return colors[severity] || colors.info;
}

// Load saved notes on page load
window.addEventListener('load', () => {
    const savedNotes = localStorage.getItem('dailyops_notes');
    if (savedNotes) {
        document.getElementById('notesArea').value = savedNotes;
    }
});
