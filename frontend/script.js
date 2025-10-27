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
    updateAuthButton();
});

// Setup event listeners
function setupEventListeners() {
    // Task modal
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        document.getElementById('taskModal').classList.remove('hidden');
    });

    document.getElementById('cancelTaskBtn').addEventListener('click', () => {
        document.getElementById('taskModal').classList.add('hidden');
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskType').value = 'work';
        document.getElementById('taskPriority').value = 'medium';
    });

    document.getElementById('saveTaskBtn').addEventListener('click', createTask);
    document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
    document.getElementById('endOfDayBtn').addEventListener('click', generateEndOfDayReport);

    // Login modal
    document.getElementById('cancelLoginBtn').addEventListener('click', () => {
        document.getElementById('loginModal').classList.add('hidden');
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    });

    document.getElementById('loginBtn').addEventListener('click', login);

    // Register modal
    document.getElementById('cancelRegisterBtn').addEventListener('click', () => {
        document.getElementById('registerModal').classList.add('hidden');
        document.getElementById('registerName').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
    });

    document.getElementById('registerBtn').addEventListener('click', register);

    // Toggle between login and register
    document.getElementById('showRegisterBtn').addEventListener('click', () => {
        document.getElementById('loginModal').classList.add('hidden');
        document.getElementById('registerModal').classList.remove('hidden');
    });

    document.getElementById('showLoginBtn').addEventListener('click', () => {
        document.getElementById('registerModal').classList.add('hidden');
        document.getElementById('loginModal').classList.remove('hidden');
    });
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
                <div class="flex gap-2 mt-2">
                    <span class="text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}">${task.priority}</span>
                    ${task.category ? `<span class="text-xs px-2 py-1 rounded ${getCategoryColor(task.category)}">${task.category}</span>` : ''}
                </div>
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
    const taskType = document.getElementById('taskType').value;
    const priority = document.getElementById('taskPriority').value;

    if (!title) {
        alert('Please enter a task title');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                description, 
                priority,
                category: taskType,
                tags: [taskType]
            })
        });

        if (response.ok) {
            document.getElementById('taskModal').classList.add('hidden');
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
            document.getElementById('taskType').value = 'work';
            document.getElementById('taskPriority').value = 'medium';
            loadTasks();
        } else {
            alert('Failed to create task. Please try again.');
        }
    } catch (error) {
        console.error('Error creating task:', error);
        alert('Error creating task. Check console for details.');
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

// Login function
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('auth_token', data.access_token);
            localStorage.setItem('user_name', data.name);
            localStorage.setItem('user_email', data.email);
            
            document.getElementById('loginModal').classList.add('hidden');
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
            
            updateAuthButton();
            alert(`Welcome ${data.name}!`);
        } else {
            const error = await response.json();
            alert('Login failed: ' + (error.detail || 'Invalid credentials'));
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Error logging in. Check console for details.');
    }
}

// Register function
async function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('auth_token', data.access_token);
            localStorage.setItem('user_name', data.name);
            localStorage.setItem('user_email', data.email);
            
            document.getElementById('registerModal').classList.add('hidden');
            document.getElementById('registerName').value = '';
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPassword').value = '';
            
            updateAuthButton();
            alert(`Welcome ${data.name}! Registration successful.`);
        } else {
            const error = await response.json();
            alert('Registration failed: ' + (error.detail || 'Unable to register'));
        }
    } catch (error) {
        console.error('Error registering:', error);
        alert('Error registering. Check console for details.');
    }
}

// Update auth button
function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    const userName = localStorage.getItem('user_name');
    
    if (userName) {
        // Remove existing event listeners
        const newAuthBtn = authBtn.cloneNode(true);
        authBtn.parentNode.replaceChild(newAuthBtn, authBtn);
        
        newAuthBtn.textContent = `Logout (${userName})`;
        newAuthBtn.className = 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700';
        newAuthBtn.addEventListener('click', () => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_email');
            updateAuthButton();
            alert('Logged out successfully');
        });
    } else {
        // Remove existing event listeners
        const newAuthBtn = authBtn.cloneNode(true);
        authBtn.parentNode.replaceChild(newAuthBtn, authBtn);
        
        newAuthBtn.textContent = 'Login';
        newAuthBtn.className = 'bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100';
        newAuthBtn.addEventListener('click', () => {
            document.getElementById('loginModal').classList.remove('hidden');
        });
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

function getCategoryColor(category) {
    const colors = {
        work: 'bg-blue-100 text-blue-800',
        personal: 'bg-purple-100 text-purple-800',
        focus: 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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
