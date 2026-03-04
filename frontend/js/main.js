document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recommendation-form');
    const formSection = document.getElementById('form-section');
    const loader = document.getElementById('loader');

    // Handle Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get Input Data
        const name = document.getElementById('name').value;
        const skillsRaw = document.getElementById('skills').value;
        const interest = document.getElementById('interest').value;
        const level = document.getElementById('level').value;

        // Process Skills
        const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s !== "");

        // Prepare User Data
        const userData = {
            name,
            skills,
            interest,
            level
        };

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
