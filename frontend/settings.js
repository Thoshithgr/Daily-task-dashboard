// Settings Page Script
// API_BASE_URL is defined in config.js
let currentUser = null;
let currentIntegrationId = null;
let isLoginMode = true;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadIntegrations();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Auth modal
    document.getElementById('authBtn').addEventListener('click', () => {
        isLoginMode = true;
        switchAuthMode(true);
        document.getElementById('authModal').classList.remove('hidden');
    });

    document.getElementById('loginTab').addEventListener('click', () => switchAuthMode(true));
    document.getElementById('registerTab').addEventListener('click', () => switchAuthMode(false));
    document.getElementById('loginSubmitBtn').addEventListener('click', handleLogin);
    document.getElementById('registerSubmitBtn').addEventListener('click', handleRegister);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Integration modal
    document.getElementById('addIntegrationBtn').addEventListener('click', () => {
        currentIntegrationId = null;
        document.getElementById('integrationModal').classList.remove('hidden');
        document.getElementById('integrationType').value = '';
        document.getElementById('integrationName').value = '';
        document.getElementById('configFields').innerHTML = '';
    });

    document.getElementById('cancelIntegrationBtn').addEventListener('click', () => {
        document.getElementById('integrationModal').classList.add('hidden');
    });

    document.getElementById('saveIntegrationBtn').addEventListener('click', saveIntegration);
    document.getElementById('testIntegrationBtn').addEventListener('click', testIntegration);
    
    // Dynamic config fields
    document.getElementById('integrationType').addEventListener('change', renderConfigFields);
}

// Auth functions
function switchAuthMode(isLogin) {
    isLoginMode = isLogin;
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const authTitle = document.getElementById('authTitle');

    if (isLogin) {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginTab.classList.add('bg-blue-600', 'text-white');
        loginTab.classList.remove('bg-gray-200');
        registerTab.classList.add('bg-gray-200');
        registerTab.classList.remove('bg-blue-600', 'text-white');
        authTitle.textContent = 'Login';
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        registerTab.classList.add('bg-blue-600', 'text-white');
        registerTab.classList.remove('bg-gray-200');
        loginTab.classList.add('bg-gray-200');
        loginTab.classList.remove('bg-blue-600', 'text-white');
        authTitle.textContent = 'Register';
    }
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            currentUser = data;
            localStorage.setItem('authToken', data.access_token);
            localStorage.setItem('currentUser', JSON.stringify(data));
            checkAuth();
            document.getElementById('authModal').classList.add('hidden');
            alert('Login successful!');
        } else {
            alert('Login failed: ' + (data.detail || 'Unknown error'));
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Check console for details.');
    }
}

async function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            currentUser = data;
            localStorage.setItem('authToken', data.access_token);
            localStorage.setItem('currentUser', JSON.stringify(data));
            checkAuth();
            document.getElementById('authModal').classList.add('hidden');
            alert('Registration successful!');
        } else {
            alert('Registration failed: ' + (data.detail || 'Unknown error'));
        }
    } catch (error) {
        console.error('Register error:', error);
        alert('Registration failed. Check console for details.');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    checkAuth();
    alert('Logged out successfully');
}

function checkAuth() {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('currentUser');
    
    if (token && userStr) {
        try {
            currentUser = JSON.parse(userStr);
            document.getElementById('userInfo').textContent = currentUser.name || currentUser.email;
            document.getElementById('authBtn').classList.add('hidden');
            document.getElementById('logoutBtn').classList.remove('hidden');
        } catch (e) {
            console.error('Error parsing user data:', e);
            currentUser = null;
        }
    } else {
        currentUser = null;
        document.getElementById('userInfo').textContent = '';
        document.getElementById('authBtn').classList.remove('hidden');
        document.getElementById('logoutBtn').classList.add('hidden');
    }
}

// Integration functions
async function loadIntegrations() {
    try {
        const response = await fetch(`${API_BASE_URL}/integrations/`);
        const integrations = await response.json();
        renderIntegrations(integrations);
    } catch (error) {
        console.error('Error loading integrations:', error);
    }
}

function renderIntegrations(integrations) {
    const integrationsList = document.getElementById('integrationsList');
    
    integrationsList.innerHTML = integrations.map(integration => `
        <div class="border rounded-lg p-4 ${integration.enabled ? 'bg-green-50 border-green-300' : 'bg-gray-50'}">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center mb-2">
                        <h4 class="text-xl font-bold">${integration.name}</h4>
                        <span class="ml-2 px-2 py-1 text-xs rounded ${getIntegrationTypeColor(integration.type)}">
                            ${integration.type.toUpperCase()}
                        </span>
                        <span class="ml-2 px-2 py-1 text-xs rounded ${integration.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${integration.enabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600">Configuration: ${Object.keys(integration.config || {}).length} field(s)</p>
                </div>
                <div class="space-x-2">
                    <button onclick="editIntegration(${integration.id})" class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Edit</button>
                    <button onclick="testIntegrationConnection(${integration.id})" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Test</button>
                    <button onclick="toggleIntegration(${integration.id}, ${!integration.enabled})" class="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700">
                        ${integration.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button onclick="deleteIntegration(${integration.id})" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function getIntegrationTypeColor(type) {
    const colors = {
        grafana: 'bg-purple-100 text-purple-800',
        jira: 'bg-blue-100 text-blue-800',
        slack: 'bg-pink-100 text-pink-800',
        webhook: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
}

function renderConfigFields() {
    const type = document.getElementById('integrationType').value;
    const configFields = document.getElementById('configFields');
    
    const configs = {
        grafana: [
            { name: 'url', label: 'Grafana URL', type: 'text', placeholder: 'https://grafana.example.com' },
            { name: 'api_key', label: 'API Key', type: 'password', placeholder: 'Your Grafana API key' }
        ],
        jira: [
            { name: 'url', label: 'Jira URL', type: 'text', placeholder: 'https://yourcompany.atlassian.net' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'your.email@company.com' },
            { name: 'api_token', label: 'API Token', type: 'password', placeholder: 'Your Jira API token' }
        ],
        slack: [
            { name: 'webhook_url', label: 'Webhook URL', type: 'url', placeholder: 'https://hooks.slack.com/services/...' },
            { name: 'channel', label: 'Channel', type: 'text', placeholder: '#alerts' }
        ],
        webhook: [
            { name: 'url', label: 'Webhook URL', type: 'url', placeholder: 'https://your-webhook-url.com/endpoint' },
            { name: 'method', label: 'HTTP Method', type: 'select', options: ['POST', 'PUT', 'PATCH'] },
            { name: 'headers', label: 'Custom Headers (JSON)', type: 'textarea', placeholder: '{"X-Custom-Header": "value"}' }
        ]
    };

    configFields.innerHTML = '';
    
    if (configs[type]) {
        configs[type].forEach(field => {
            if (field.type === 'select') {
                configFields.innerHTML += `
                    <div>
                        <label class="block text-sm font-medium mb-2">${field.label}</label>
                        <select name="${field.name}" class="w-full p-3 border rounded">
                            ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else if (field.type === 'textarea') {
                configFields.innerHTML += `
                    <div>
                        <label class="block text-sm font-medium mb-2">${field.label}</label>
                        <textarea name="${field.name}" placeholder="${field.placeholder}" class="w-full p-3 border rounded"></textarea>
                    </div>
                `;
            } else {
                configFields.innerHTML += `
                    <div>
                        <label class="block text-sm font-medium mb-2">${field.label}</label>
                        <input type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" class="w-full p-3 border rounded">
                    </div>
                `;
            }
        });
    }
}

async function saveIntegration() {
    const name = document.getElementById('integrationName').value;
    const type = document.getElementById('integrationType').value;
    const enabled = document.getElementById('integrationEnabled').checked;
    
    if (!name || !type) {
        alert('Please fill in all required fields');
        return;
    }

    // Collect config values
    const config = {};
    document.querySelectorAll('#configFields input, #configFields select, #configFields textarea').forEach(input => {
        if (input.value) {
            config[input.name] = input.value;
        }
    });

    try {
        let url = `${API_BASE_URL}/integrations/`;
        let method = 'POST';
        
        if (currentIntegrationId) {
            url = `${API_BASE_URL}/integrations/${currentIntegrationId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type, enabled, config })
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('integrationModal').classList.add('hidden');
            loadIntegrations();
            alert('Integration saved successfully!');
        } else {
            alert('Failed to save integration: ' + (data.detail || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error saving integration:', error);
        alert('Failed to save integration. Check console for details.');
    }
}

async function testIntegration() {
    // First save if new integration
    await saveIntegration();
    
    if (currentIntegrationId) {
        await testIntegrationConnection(currentIntegrationId);
    }
}

async function testIntegrationConnection(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/integrations/${id}/test`, {
            method: 'POST'
        });

        const data = await response.json();
        if (response.ok) {
            alert('Connection test successful!');
        } else {
            alert('Connection test failed: ' + (data.detail || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error testing integration:', error);
        alert('Connection test failed. Check console for details.');
    }
}

async function editIntegration(id) {
    currentIntegrationId = id;
    try {
        const response = await fetch(`${API_BASE_URL}/integrations/${id}`);
        if (!response.ok) throw new Error('Failed to fetch integration');
        
        const integration = await response.json();
        
        document.getElementById('integrationType').value = integration.type;
        document.getElementById('integrationName').value = integration.name;
        document.getElementById('integrationEnabled').checked = integration.enabled;
        renderConfigFields();
        
        // Fill in config values
        setTimeout(() => {
            Object.keys(integration.config || {}).forEach(key => {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = integration.config[key];
                }
            });
        }, 100);
        
        document.getElementById('integrationModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching integration:', error);
        alert('Failed to load integration');
    }
}

function toggleIntegration(id, enabled) {
    fetch(`${API_BASE_URL}/integrations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
    })
    .then(() => loadIntegrations());
}

function deleteIntegration(id) {
    if (confirm('Are you sure you want to delete this integration?')) {
        fetch(`${API_BASE_URL}/integrations/${id}`, {
        method: 'DELETE'
        })
        .then(() => loadIntegrations());
    }
}

