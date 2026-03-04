document.addEventListener('DOMContentLoaded', async () => {
    const recommendationsContainer = document.getElementById('recommendations-container');
    const roadmapSection = document.getElementById('roadmap-section');
    const roadmapTimeline = document.getElementById('roadmap-timeline');
    const roadmapTitle = document.getElementById('roadmap-title');
    const userData = JSON.parse(localStorage.getItem('user_data'));

    if (!userData) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // Fetch Recommendations
        const recData = await ApiService.getRecommendations(userData);
        renderRecommendations(recData.recommended_projects);

        // Fetch Roadmap based on Interest
        const roadmapData = await ApiService.getRoadmap(userData);
        if (roadmapData && roadmapData.roadmap) {
            renderRoadmap(roadmapData.roadmap, userData.skills);
        }

        // Fetch Trending GitHub Projects
        const githubContainer = document.getElementById('github-container');
        try {
            const githubData = await ApiService.getTrendingGithub(userData);
            renderGithub(githubData.trending_repos);
        } catch (githubErr) {
            githubContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Could not connect to GitHub API.</p>';
        }
    } catch (err) {
        recommendationsContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Error loading data. Ensure the backend is running!</p>';
    }

    function renderGithub(repos) {
        const githubContainer = document.getElementById('github-container');
        githubContainer.innerHTML = '';

        if (!repos || repos.length === 0) {
            githubContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No trending projects found for your profile.</p>';
            return;
        }

        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';

            card.innerHTML = `
                <div class="match-score" style="color: var(--secondary); font-size: 0.9rem;">⭐ ${repo.stars.toLocaleString()}</div>
                <div class="project-difficulty" style="color: var(--primary);">${repo.language || 'Code'}</div>
                <h3 class="project-title" style="font-size: 1.2rem;">${repo.name}</h3>
                <p class="project-description" style="font-size: 0.85rem; height: 60px; overflow: hidden;">${repo.description}</p>
                <a href="${repo.url}" target="_blank" class="btn-primary" style="display: block; text-align: center; font-size: 0.8rem; padding: 0.6rem; text-decoration: none; background: rgba(255, 0, 255, 0.1); border: 1px solid var(--secondary); color: var(--secondary);">Explore Open Source</a>
            `;
            githubContainer.appendChild(card);
        });
    }

    function renderRecommendations(projects) {
        recommendationsContainer.innerHTML = '';
        if (!projects || projects.length === 0) {
            recommendationsContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No matching projects found. Match your skills!</p>';
            return;
        }

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            const analysis = project.analysis || { matched_skills: [], missing_skills: [] };

            let matchedPills = analysis.matched_skills.map(s => `<span class="pill matched">${s}</span>`).join('');
            let missingPills = analysis.missing_skills.map(s => `<span class="pill missing">${s}</span>`).join('');

            card.innerHTML = `
                <div class="match-score">${project.score}% Match</div>
                <div class="project-difficulty difficulty-${project.difficulty.toLowerCase()}">${project.difficulty}</div>
                <h3 class="project-title">${project.name}</h3>
                <p class="project-description">${project.description}</p>
                <div class="skill-pills">
                    ${matchedPills}
                    ${missingPills}
                </div>
                <a href="${project.github_link}" target="_blank" class="btn-primary" style="display: block; text-align: center; font-size: 0.9rem; padding: 0.8rem; text-decoration: none;">View Project</a>
            `;
            recommendationsContainer.appendChild(card);
        });
    }

    function renderRoadmap(roadmap, userSkills) {
        const userSkillsSet = new Set(userSkills.map(s => s.toLowerCase()));
        roadmapTitle.innerText = roadmap.goal;
        roadmapTimeline.innerHTML = '';

        roadmap.steps.forEach(step => {
            const stepSkills = step.skills || [];
            const matchedSkills = stepSkills.filter(s => userSkillsSet.has(s.toLowerCase()));
            const isCompleted = matchedSkills.length === stepSkills.length && stepSkills.length > 0;

            const stepEl = document.createElement('div');
            stepEl.className = `roadmap-step ${isCompleted ? 'completed' : ''}`;

            // Generate skill gap HTML for the roadmap step
            const skillsHtml = stepSkills.map(s => {
                const hasSkill = userSkillsSet.has(s.toLowerCase());
                return `<span class="pill ${hasSkill ? 'matched' : 'missing'}" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;">${s}</span>`;
            }).join('');

            stepEl.innerHTML = `
                <div class="step-num">${step.step}</div>
                <div class="step-topic">${step.topic}</div>
                <div class="step-desc">${step.desc}</div>
                <div class="skill-pills" style="margin-top: 1rem; border-top: 1px solid var(--glass-border); padding-top: 0.8rem;">
                    ${skillsHtml}
                </div>
            `;
            roadmapTimeline.appendChild(stepEl);
        });

        roadmapSection.style.display = 'block';
    }
});
