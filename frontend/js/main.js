document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recommendation-form');
    const formSection = document.getElementById('form-section');
    const loader = document.getElementById('loader');

    // Check if user is already logged in to pre-fill name
    const storedUser = JSON.parse(localStorage.getItem('user_data'));
    const authToken = localStorage.getItem('auth_token');
    if (storedUser && document.getElementById('name')) {
        document.getElementById('name').value = storedUser.name || "";
    }

    // Handle Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!authToken) {
            alert("Please sign in first to analyze your profile and access the dashboard.");
            window.location.href = 'login.html';
            return;
        }

        // Get Input Data
        const name = document.getElementById('name').value;
        const skillsRaw = document.getElementById('skills').value;
        const interest = document.getElementById('interest').value;
        const level = document.getElementById('level').value;

        // Process Skills
        const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s !== "");

        // Prepare User Data (Update existing data but keep token)
        const userData = { ...storedUser, name, skills, interest, level };

        // Store data and redirect
        localStorage.setItem('user_data', JSON.stringify(userData));

        // Show Loader before redirecting
        formSection.style.display = 'none';
        loader.style.display = 'block';

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1200);
    });
});
