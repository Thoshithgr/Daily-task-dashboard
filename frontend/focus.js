// FocusDesk Script
// API_BASE_URL is defined in config.js

let timerInterval = null;
let timeRemaining = 1500; // 25 minutes in seconds
let sessions = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSessions();
    updateTimerDisplay();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('startBtn').addEventListener('click', startTimer);
    document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
    document.getElementById('resetBtn').addEventListener('click', resetTimer);

    // Pomodoro presets
    document.querySelectorAll('.pomodoro-preset').forEach(btn => {
        btn.addEventListener('click', function() {
            const minutes = parseInt(this.dataset.minutes);
            timeRemaining = minutes * 60;
            updateTimerDisplay();
            document.querySelectorAll('.pomodoro-preset').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Timer functions
function startTimer() {
    if (timerInterval) return;
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            completeSession();
        }
    }, 1000);
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    pauseTimer();
    timeRemaining = 1500; // Reset to 25 minutes
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Complete focus session
async function completeSession() {
    pauseTimer();
    
    const minutes = 25; // or calculate from timeRemaining
    try {
        const response = await fetch(`${API_BASE_URL}/focus/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                duration: minutes,
                completed: true
            })
        });
        
        if (response.ok) {
            alert('Focus session completed! 🎉');
            loadSessions();
        }
    } catch (error) {
        console.error('Error saving session:', error);
    }
    
    resetTimer();
}

// Load sessions
async function loadSessions() {
    try {
        const response = await fetch(`${API_BASE_URL}/focus/sessions`);
        sessions = await response.json();
        renderSessions();
        updateStats();
    } catch (error) {
        console.error('Error loading sessions:', error);
    }
}

// Render sessions
function renderSessions() {
    const sessionsList = document.getElementById('sessionsList');
    if (sessions.length === 0) {
        sessionsList.innerHTML = '<p class="text-gray-500">No focus sessions yet. Start your first one!</p>';
    } else {
        sessionsList.innerHTML = sessions.slice(0, 5).map(session => `
            <div class="p-4 border rounded">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-semibold">${session.duration} minutes</h3>
                        <p class="text-sm text-gray-500">${new Date(session.created_at).toLocaleString()}</p>
                    </div>
                    <span class="text-green-600">✓ Completed</span>
                </div>
            </div>
        `).join('');
    }
}

// Update stats
function updateStats() {
    const todayMinutes = sessions
        .filter(s => new Date(s.created_at).toDateString() === new Date().toDateString())
        .reduce((sum, s) => sum + s.duration, 0);
    
    const completedToday = sessions.filter(s => 
        new Date(s.created_at).toDateString() === new Date().toDateString() && s.completed
    ).length;
    
    document.getElementById('todayFocus').textContent = `${todayMinutes}m`;
    document.getElementById('sessionsCompleted').textContent = completedToday;
    document.getElementById('weeklyStreak').textContent = calculateStreak();
}

// Calculate weekly streak (simplified)
function calculateStreak() {
    return 7; // TODO: Implement actual streak calculation
}
