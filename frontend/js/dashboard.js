document.addEventListener('DOMContentLoaded', async () => {
    const recommendationsContainer = document.getElementById('recommendations-container');
    const roadmapTimeline = document.getElementById('roadmap-timeline');
    const roadmapTitle = document.getElementById('roadmap-title');
    const githubContainer = document.getElementById('github-container');
    const aiSmartTip = document.getElementById('ai-smart-tip');
    const updateBtn = document.getElementById('update-btn');
    const refineSkillsInput = document.getElementById('refine-skills');

    // User Profile Elements
    const userDisplayName = document.getElementById('user-display-name');
    const userDisplayLevel = document.getElementById('user-display-level');

    let userData = JSON.parse(localStorage.getItem('user_data'));

    if (!userData) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize UI
    userDisplayName.innerText = userData.name || "Developer";
    userDisplayLevel.innerText = `${userData.level} Interested in ${userData.interest}`;
    refineSkillsInput.value = userData.skills.join(', ');

    async function loadDashboard() {
        try {
            // Loading States
            recommendationsContainer.innerHTML = '<div class="loading-spinner"></div>';
            githubContainer.innerHTML = '<div class="loading-spinner"></div>';
            roadmapTimeline.innerHTML = '<div class="loading-spinner"></div>';

            // 1. Fetch Recommendations
            console.log("Fetching recommendations for:", userData);
            const recData = await ApiService.getRecommendations(userData);
            console.log("Recommendation Response:", recData);

            if (recData && recData.recommended_projects && recData.recommended_projects.length > 0) {
                renderRecommendations(recData.recommended_projects);
                generateAiTip(recData.recommended_projects);
            } else {
                recommendationsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No matching projects found. Try updating your skills in the sidebar!</p>';
            }

            // 2. Fetch Roadmap
            const roadmapData = await ApiService.getRoadmap(userData);
            if (roadmapData && roadmapData.roadmap) {
                renderRoadmap(roadmapData.roadmap, userData.skills);
            } else {
                roadmapTimeline.innerHTML = '<p>Roadmap generation unavailable.</p>';
            }

            // 3. GitHub Trending
            try {
                const githubData = await ApiService.getTrendingGithub(userData);
                renderGithub(githubData.trending_repos);
            } catch (err) {
                githubContainer.innerHTML = '<p>GitHub Service Offline.</p>';
            }
        } catch (err) {
            console.error("Dashboard Load Failure:", err);
            recommendationsContainer.innerHTML = `
                <div style="grid-column: 1/-1; padding: 3rem; background: rgba(239, 68, 68, 0.05); border-radius: 20px; border: 1px solid rgba(239, 68, 68, 0.2); text-align: center;">
                    <h3 style="color: #ef4444; margin-bottom: 0.5rem;">Connection Failed</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">The AI Engine couldn't be reached. Please check the backend logs.</p>
                    <div style="font-family: monospace; font-size: 0.75rem; margin-top: 1rem; color: #ef4444;">Error: ${err.message}</div>
                </div>
            `;
        }
    }

    function renderRecommendations(projects) {
        recommendationsContainer.innerHTML = '';
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
                <a href="${project.github_link}" target="_blank" class="btn-primary">View Project Repository</a>
            `;
            recommendationsContainer.appendChild(card);
        });
    }

    function renderRoadmap(roadmap, userSkills) {
        const userSkillsSet = new Set(userSkills.map(s => s.toLowerCase()));
        roadmapTitle.innerText = `Full Roadmap: ${roadmap.goal}`;
        roadmapTimeline.innerHTML = '';

        roadmap.steps.forEach(step => {
            const stepSkills = step.skills || [];
            const matchedSkills = stepSkills.filter(s => userSkillsSet.has(s.toLowerCase()));
            const isCompleted = matchedSkills.length === stepSkills.length && stepSkills.length > 0;

            const stepEl = document.createElement('div');
            stepEl.className = `roadmap-step ${isCompleted ? 'completed' : ''}`;

            const skillsHtml = stepSkills.map(s => {
                const hasSkill = userSkillsSet.has(s.toLowerCase());
                return `<span class="pill ${hasSkill ? 'matched' : 'missing'}" style="font-size: 0.7rem;">${s}</span>`;
            }).join('');

            stepEl.innerHTML = `
                <div class="step-num">${step.step}</div>
                <div class="step-topic">${step.topic}</div>
                <div class="step-desc">${step.desc}</div>
                <div class="skill-pills" style="margin-top: 1.2rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1rem;">
                    ${skillsHtml}
                </div>
            `;
            roadmapTimeline.appendChild(stepEl);
        });
    }

    function renderGithub(repos) {
        githubContainer.innerHTML = '';
        if (!repos || repos.length === 0) {
            githubContainer.innerHTML = '<p>No projects found matching your scope.</p>';
            return;
        }

        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="match-score" style="color: var(--secondary); font-size: 0.9rem;">⭐ ${repo.stars.toLocaleString()}</div>
                <div class="project-difficulty">${repo.language || 'Git Repo'}</div>
                <h3 class="project-title">${repo.name}</h3>
                <p class="project-description" style="height: 60px;">${repo.description || 'Quality project from GitHub curated for your skills.'}</p>
                <a href="${repo.url}" target="_blank" class="btn-primary" style="background: rgba(139, 92, 246, 0.1); color: var(--secondary); border: 1px solid var(--secondary); box-shadow: none;">Open Source Discover</a>
            `;
            githubContainer.appendChild(card);
        });
    }

    function generateAiTip(projects) {
        if (!projects || projects.length === 0) return;
        const topProject = projects[0];
        const missing = topProject.analysis.missing_skills;

        if (missing.length > 0) {
            aiSmartTip.innerText = `To unlock the "${topProject.name}" project, we suggest focusing on mastering "${missing[0]}" next. It's the biggest barrier between you and an expert-level portfolio.`;
        } else {
            aiSmartTip.innerText = "Fantastic! Your core skills perfectly match your top recommendations. Time to move to 'Advanced' complexity to keep growing.";
        }
    }

    // Re-Analysis Logic
    updateBtn.addEventListener('click', () => {
        const newSkills = refineSkillsInput.value.split(',').map(s => s.trim()).filter(s => s);
        userData.skills = newSkills;
        localStorage.setItem('user_data', JSON.stringify(userData));
        loadDashboard();

        // Visual feedback
        updateBtn.innerText = "Analyzing...";
        setTimeout(() => updateBtn.innerText = "Re-Analyze", 1500);
    });

    // Initial Load
    loadDashboard();
});
