document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const loginWrapper = document.getElementById('loginWrapper');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
    const eyeOffIcon = togglePasswordBtn.querySelector('.eye-off-icon');
    const pupils = document.querySelectorAll('.pupil');

    // Handle password focus to hide eyes (simulating privacy)
    passwordInput.addEventListener('focus', () => {
        // Only hide if the password is not currently visible
        if (passwordInput.getAttribute('type') === 'password') {
            loginWrapper.classList.add('hide-eyes');
        }
    });

    passwordInput.addEventListener('blur', () => {
        loginWrapper.classList.remove('hide-eyes');
    });

    // Make pupils slightly follow the email typing length
    emailInput.addEventListener('input', (e) => {
        const length = e.target.value.length;
        // Map string length to a small translation value, max 8px right
        const shiftX = Math.min(length * 0.4, 8); 
        
        pupils.forEach(pupil => {
            pupil.style.transform = `translateX(${shiftX}px)`;
        });
    });

    // Reset pupils on email blur
    emailInput.addEventListener('blur', () => {
        pupils.forEach(pupil => {
            pupil.style.transform = `translateX(0px)`;
        });
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        if (type === 'text') {
            eyeIcon.style.display = 'none';
            eyeOffIcon.style.display = 'block';
            // Unhide character eyes because the user chose to see the password!
            loginWrapper.classList.remove('hide-eyes');
        } else {
            eyeIcon.style.display = 'block';
            eyeOffIcon.style.display = 'none';
            // Hide character eyes if the input is currently focused
            if (document.activeElement === passwordInput) {
                loginWrapper.classList.add('hide-eyes');
            }
        }
    });

    // Handle Form submission (Login & Register)
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const submitBtn = document.getElementById('submit-btn');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const emailGroup = document.getElementById('email-group');
    const registerEmailInput = document.getElementById('register-email');
    const toggleModeLink = document.getElementById('toggle-mode-link');
    const toggleText = document.getElementById('toggle-text');

    let isLoginMode = true;

    // Toggle Login/Register Mode using Event Delegation
    toggleText.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'toggle-mode-link') {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            errorMessage.textContent = ''; // clear error
            
            if (isLoginMode) {
                formTitle.textContent = 'Welcome back';
                formSubtitle.textContent = 'Please enter your details.';
                submitBtn.textContent = 'Log in';
                emailGroup.style.display = 'none';
                registerEmailInput.removeAttribute('required');
                toggleText.innerHTML = `Don't have an account? <a href="#" id="toggle-mode-link">Sign up</a>`;
            } else {
                formTitle.textContent = 'Create an account';
                formSubtitle.textContent = 'Enter your details to register.';
                submitBtn.textContent = 'Sign up';
                emailGroup.style.display = 'block';
                registerEmailInput.setAttribute('required', 'true');
                toggleText.innerHTML = `Already have an account? <a href="#" id="toggle-mode-link">Log in</a>`;
            }
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = ''; // Clear previous errors
        
        const username = emailInput.value;
        const password = passwordInput.value;
        const API_URL = 'http://localhost:8000'; 

        try {
            if (isLoginMode) {
                // LOGIN
                const formData = new FormData();
                formData.append('username', username);
                formData.append('password', password);

                const res = await fetch(`${API_URL}/users/login`, {
                    method: 'POST',
                    body: formData
                });
                
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.access_token);
                    errorMessage.style.color = '#10b981';
                    errorMessage.textContent = 'Login successful! Redirecting...';
                    setTimeout(() => {
                        window.location.href = '/'; 
                    }, 1000);
                } else {
                    errorMessage.style.color = '#ef4444'; 
                    errorMessage.textContent = data.detail || 'Incorrect username or password';
                }
            } else {
                // REGISTER
                const email = registerEmailInput.value;
                const payload = {
                    username: username,
                    email: email,
                    password: password
                };

                const res = await fetch(`${API_URL}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                if (res.ok) {
                    errorMessage.style.color = '#10b981';
                    errorMessage.textContent = 'Account created successfully! You can now log in.';
                    // Switch back to login mode automatically
                    setTimeout(() => {
                        document.getElementById('toggle-mode-link').click();
                        passwordInput.value = ''; // clear password
                    }, 1500);
                } else {
                    errorMessage.style.color = '#ef4444'; 
                    errorMessage.textContent = data.detail || 'Failed to create account';
                }
            }
        } catch (err) {
            errorMessage.style.color = '#ef4444';
            errorMessage.textContent = 'Failed to connect to the server. Is it running?';
        }
    });
});
