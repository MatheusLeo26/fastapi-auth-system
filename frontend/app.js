const API_URL = 'http://localhost:8000';
let token = localStorage.getItem('token');

// DOM Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toast = document.getElementById('toast');
const userDisplay = document.getElementById('user-display');
const itemsList = document.getElementById('items-list');

// Initialize
if (token) {
    loadDashboard();
}

// UI Utilities
function switchTab(tab) {
    const loginBtn = document.querySelectorAll('.tab-btn')[0];
    const regBtn = document.querySelectorAll('.tab-btn')[1];
    
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginBtn.classList.add('active');
        regBtn.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        loginBtn.classList.remove('active');
        regBtn.classList.add('active');
    }
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.className = 'toast hidden';
    }, 3000);
}

function showDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    dashboardSection.classList.add('fade-in');
}

function showAuth() {
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    authSection.classList.add('fade-in');
}

// API Calls
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const res = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            body: formData
        });
        
        const data = await res.json();
        if (res.ok) {
            token = data.access_token;
            localStorage.setItem('token', token);
            showToast('Logged in successfully!');
            document.getElementById('login-password').value = '';
            loadDashboard();
        } else {
            showToast(data.detail || 'Login failed', 'error');
        }
    } catch (err) {
        showToast('Server error', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const res = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await res.json();
        if (res.ok) {
            showToast('Registration successful! Please login.');
            switchTab('login');
        } else {
            showToast(data.detail || 'Registration failed', 'error');
        }
    } catch (err) {
        showToast('Server error', 'error');
    }
}

function handleLogout() {
    token = null;
    localStorage.removeItem('token');
    showAuth();
}

async function loadDashboard() {
    try {
        // Fetch User Info
        const userRes = await fetch(`${API_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!userRes.ok) {
            if(userRes.status === 401) handleLogout();
            return;
        }
        
        const userData = await userRes.json();
        userDisplay.textContent = `Welcome, ${userData.username}!`;
        
        showDashboard();
        fetchItems();
    } catch (err) {
        console.error(err);
    }
}

async function fetchItems() {
    try {
        const res = await fetch(`${API_URL}/items/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const items = await res.json();
        renderItems(items);
    } catch (err) {
        showToast('Failed to load items', 'error');
    }
}

function renderItems(items) {
    itemsList.innerHTML = '';
    if (items.length === 0) {
        itemsList.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1;">No items yet. Add one above!</p>';
        return;
    }
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card fade-in';
        div.innerHTML = `
            <div class="item-title">${item.title}</div>
            <div class="item-desc">${item.description || 'No description'}</div>
            <div class="item-actions">
                <button onclick="deleteItem(${item.id})" class="delete-btn">Delete</button>
            </div>
        `;
        itemsList.appendChild(div);
    });
}

async function handleAddItem(e) {
    e.preventDefault();
    const title = document.getElementById('item-title').value;
    const description = document.getElementById('item-desc').value;

    try {
        const res = await fetch(`${API_URL}/items/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description })
        });
        
        if (res.ok) {
            document.getElementById('item-title').value = '';
            document.getElementById('item-desc').value = '';
            showToast('Item added');
            fetchItems();
        } else {
            showToast('Failed to add item', 'error');
        }
    } catch (err) {
        showToast('Server error', 'error');
    }
}

async function deleteItem(id) {
    try {
        const res = await fetch(`${API_URL}/items/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            showToast('Item deleted');
            fetchItems();
        } else {
            showToast('Failed to delete item', 'error');
        }
    } catch (err) {
        showToast('Server error', 'error');
    }
}
