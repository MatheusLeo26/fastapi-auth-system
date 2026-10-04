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

    // Handle Login API Call
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = ''; // Clear previous errors
        
        const username = emailInput.value; // The input is now labeled Username
        const password = passwordInput.value;
        const API_URL = 'http://localhost:8000'; // Make sure the FastAPI app is running!

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            // Fetch to actual backend
            const res = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                body: formData
            });
            
            const data = await res.json();
            if (res.ok) {
                // Success! Save token and show success message
                localStorage.setItem('token', data.access_token);
                errorMessage.style.color = '#10b981'; // Green for success
                errorMessage.textContent = 'Login successful! Redirecting...';
                
                // In a real scenario, you'd redirect to the dashboard here.
                // Since this UI is separate, we'll just show the message.
                setTimeout(() => {
                    // window.location.href = '/'; 
                }, 1500);
            } else {
                errorMessage.style.color = '#ef4444'; // Red for error
                errorMessage.textContent = data.detail || 'Incorrect username or password';
            }
        } catch (err) {
            errorMessage.style.color = '#ef4444';
            errorMessage.textContent = 'Failed to connect to the server. Is it running?';
        }
    });

    // Add a simple alert for Sign up
    const signUpLink = document.querySelector('.form-footer a');
    if (signUpLink) {
        signUpLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert("This is just the UI preview! In the full integration, this would switch to the Register form.");
        });
    }
});
