document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    // --- Login Logic ---
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                showError(loginError, "Please fill in all fields.");
                return;
            }

            try {
                const data = await ApiService.login(email, password);
                
                // Store session
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_data', JSON.stringify(data.user));
                
                if (data.token === 'guest_token_limited') {
                    alert("DEMO MODE: Logged in as Guest. Note: Portfolio data is not persisted without a database.");
                }
                
                window.location.href = 'dashboard.html';
            } catch (err) {
                const message = err.message || "Invalid email or password.";
                showError(loginError, message);
                loginBtn.innerText = "Sign In";
            }
        });
    }

    // --- Register Logic ---
    if (registerBtn) {
        registerBtn.addEventListener('click', async () => {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!name || !email || !password) {
                showError(registerError, "Please fill in all fields.");
                return;
            }

            try {
                registerBtn.innerText = "Creating Account...";
                const data = await ApiService.register(name, email, password);
                
                if (data.token === 'guest_token_limited') {
                    localStorage.setItem('auth_token', data.token);
                    localStorage.setItem('user_data', JSON.stringify(data.user));
                    alert("DEMO MODE: Entering dashboard as guest (Database offline).");
                    window.location.href = 'dashboard.html';
                } else {
                    alert("Account created successfully! Please sign in.");
                    window.location.href = 'login.html';
                }
            } catch (err) {
                const message = err.message || "Registration failed. Please try again.";
                showError(registerError, message);
                registerBtn.innerText = "Create Account";
            }
        });
    }

    function showError(element, message) {
        if (!element) return;
        element.innerText = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
});
