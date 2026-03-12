document.addEventListener('DOMContentLoaded', async () => {
    // Check if the page was refreshed. If so, clear data and go back to landing page.
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
        localStorage.removeItem('user_data');
        window.location.href = 'index.html';
        return;
    }

    const recommendationsContainer = document.getElementById('recommendations-container');
    const roadmapTimeline = document.getElementById('roadmap-timeline');
    const roadmapTitle = document.getElementById('roadmap-title');
    const githubContainer = document.getElementById('github-container');
    const resourcesContainer = document.getElementById('resources-container');
    const hackathonContainer = document.getElementById('hackathon-container');
    const interviewList = document.getElementById('interview-list');
    const interviewTechSelect = document.getElementById('interview-tech-select');
    const aiSmartTip = document.getElementById('ai-smart-tip');
    const updateBtn = document.getElementById('update-btn');
    const refineSkillsInput = document.getElementById('refine-skills');

    // User Profile Elements
    const userDisplayName = document.getElementById('user-display-name');
    const userDisplayLevel = document.getElementById('user-display-level');

    let userData = JSON.parse(localStorage.getItem('user_data'));
    let authToken = localStorage.getItem('auth_token');

    if (!authToken || !userData) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize UI
    userDisplayName.innerText = userData.name || "Developer";
    
    // Support both interest and interests (plural) from different origins
    const userInterest = userData.interest || (userData.interests && userData.interests[0]) || "AI";
    userData.interest = userInterest; // Normalize
    
    userDisplayLevel.innerText = `${userData.level || "Beginner"} Interested in ${userInterest}`;
    refineSkillsInput.value = (userData.skills || []).join(', ');

    async function loadDashboard() {
        try {
            // Loading States
            recommendationsContainer.innerHTML = '<div class="loading-spinner"></div>';
            githubContainer.innerHTML = '<div class="loading-spinner"></div>';
            roadmapTimeline.innerHTML = '<div class="loading-spinner"></div>';
            resourcesContainer.innerHTML = '<div class="loading-spinner"></div>';
            hackathonContainer.innerHTML = '<div class="loading-spinner"></div>';

            // 1. Fetch Recommendations
            try {
                const recData = await ApiService.getRecommendations(userData);
                if (recData && recData.recommended_projects) {
                    renderRecommendations(recData.recommended_projects);
                    generateAiTip(recData.recommended_projects);
                } else {
                    recommendationsContainer.innerHTML = '<p>No recommendations found.</p>';
                }
            } catch (e) { recommendationsContainer.innerHTML = '<p>Recommender Offline</p>'; }

            // 2. Fetch Roadmap
            try {
                const roadmapData = await ApiService.getRoadmap(userData);
                if (roadmapData && roadmapData.roadmap) {
                    renderRoadmap(roadmapData.roadmap, userData.skills || []);
                } else {
                    roadmapTimeline.innerHTML = '<p>No milestone data available.</p>';
                }
            } catch (e) { roadmapTimeline.innerHTML = '<p>Roadmap Tracker Offline</p>'; }

            // 3. GitHub Trending
            try {
                const githubData = await ApiService.getTrendingGithub(userData);
                renderGithub(githubData.trending_repos);
            } catch (err) { githubContainer.innerHTML = '<p>GitHub Connect Offline</p>'; }

            // 4. Resources
            try {
                const resourceData = await ApiService.getResources();
                renderResources(resourceData.resources || []);
            } catch (e) { resourcesContainer.innerHTML = '<p>Resources Offline</p>'; }

            // 5. Hackathons
            try {
                const hackathonData = await ApiService.getHackathons(userData.skills || []);
                renderHackathons(hackathonData.hackathons || []);
            } catch (e) { hackathonContainer.innerHTML = '<p>Hackathons Offline</p>'; }

            // 6. Interview Questions Initial
            loadInterviewQuestions(interviewTechSelect.value || (userData.skills && userData.skills[0]) || "Python");

        } catch (err) {
            console.error("Dashboard Load Failure:", err);
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
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <a href="${project.github_link}" target="_blank" class="btn-primary" style="flex: 1; text-align: center;">Repository</a>
                    <button class="btn-secondary resume-btn" style="flex: 1;">Get Resume</button>
                </div>
            `;
            const resumeBtn = card.querySelector('.resume-btn');
            resumeBtn.onclick = () => handleResumeGen(project);
            recommendationsContainer.appendChild(card);
        });
    }

    function renderRoadmap(roadmap, userSkills) {
        const userSkillsSet = new Set(userSkills.map(s => s.toLowerCase().trim()));
        roadmapTitle.innerText = `Full Roadmap: ${roadmap.goal}`;
        roadmapTimeline.innerHTML = '';

        roadmap.steps.forEach((step, index) => {
            const stepSkills = step.skills || [];
            const matchedSkills = stepSkills.filter(s => userSkillsSet.has(s.toLowerCase().trim()));
            const isCompleted = matchedSkills.length === stepSkills.length && stepSkills.length > 0;

            const stepEl = document.createElement('div');
            stepEl.className = `roadmap-step ${isCompleted ? 'completed' : ''}`;

            const skillsHtml = stepSkills.map(s => {
                const hasSkill = userSkillsSet.has(s.toLowerCase().trim());
                return `<span class="pill ${hasSkill ? 'matched' : 'missing'}" style="font-size: 0.7rem;">${s}</span>`;
            }).join('');

            stepEl.innerHTML = `
                <div class="step-num">${step.step || (index + 1)}</div>
                <div class="step-topic">${step.title || step.topic}</div>
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

    function renderResources(resources) {
        resourcesContainer.innerHTML = '';
        resources.forEach(res => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h3 class="project-title">${res.skill} Mastery</h3>
                <ul style="padding-left: 1.2rem; color: var(--text-muted); font-size: 0.9rem;">
                    ${res.links.map(link => `<li style="margin: 5px 0;"><a href="${link}" target="_blank" style="color: var(--secondary);">${link.replace('https://', '').split('/')[0]}</a></li>`).join('')}
                </ul>
            `;
            resourcesContainer.appendChild(card);
        });
    }

    function renderHackathons(hackathons) {
        hackathonContainer.innerHTML = '';
        hackathons.forEach(h => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h3 class="project-title">${h.name}</h3>
                <p class="project-description">${h.problem_statement}</p>
                <div class="skill-pills">
                    ${h.skills.map(s => `<span class="pill matched" style="opacity: 0.8">${s}</span>`).join('')}
                </div>
                <a href="${h.link}" target="_blank" class="btn-secondary" style="display: block; text-align: center; margin-top: 15px;">Register Now</a>
            `;
            hackathonContainer.appendChild(card);
        });
    }

    async function loadInterviewQuestions(tech) {
        interviewList.innerHTML = '<li>Loading queries...</li>';
        const data = await ApiService.getInterviewQuestions(tech);
        interviewList.innerHTML = '';
        if (data.questions && data.questions.length > 0) {
            data.questions.forEach(q => {
                const li = document.createElement('li');
                li.style.padding = '12px 0';
                li.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
                li.innerHTML = `<span style="color: var(--secondary); font-weight: bold; margin-right: 8px;">Q:</span> ${q}`;
                interviewList.appendChild(li);
            });
        }
    }

    async function handleResumeGen(project) {
        try {
            const data = await ApiService.generateResume(userData, project);
            const resume = data.resume;
            alert(`RESUME PREVIEW GENERATED:\n\n${resume.name}\n${resume.contact}\n\nSummary: ${resume.summary}\n\nKey Project: ${resume.experience[0].title}\nDescription: ${resume.experience[0].description}`);
        } catch (err) { alert("Failed to generate resume"); }
    }

    interviewTechSelect.onchange = () => loadInterviewQuestions(interviewTechSelect.value);

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

    // Sign Out Logic
    const resetProfileBtn = document.getElementById('reset-profile');
    if (resetProfileBtn) {
        resetProfileBtn.innerText = "Sign Out"; // Change text to be more accurate
        resetProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to sign out?')) {
                localStorage.removeItem('user_data');
                localStorage.removeItem('auth_token');
                window.location.href = 'index.html';
            }
        });
    }

    // Initial Load
    loadDashboard();
});
