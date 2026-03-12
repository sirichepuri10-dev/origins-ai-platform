const API_BASE_URL = (window.location.origin === "null" || window.location.protocol === "file:") 
    ? "http://127.0.0.1:5000" 
    : window.location.origin;

const ApiService = {
    async getRecommendations(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/recommend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error("HTTP error! status: " + response.status);
            }

            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },

    async getRoadmap(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/roadmap`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    goal: userData.interest,
                    skills: userData.skills
                })
            });

            if (!response.ok) {
                throw new Error("HTTP error! status: " + response.status);
            }

            return await response.json();
        } catch (error) {
            console.error("Roadmap API Error:", error);
            throw error;
        }
    },

    async getTrendingGithub(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/github/trending`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error("HTTP error! status: " + response.status);
            }

            return await response.json();
        } catch (error) {
            console.error("GitHub API Error:", error);
            throw error;
        }
    },

    async seedDatabase() {
        try {
            const response = await fetch(`${API_BASE_URL}/seed`);
            return await response.json();
        } catch (error) {
            console.error("Seed Error:", error);
            throw error;
        }
    },

    // --- Authentication ---
    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Login failed");
        }
        return data;
    },

    async register(name, email, password) {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Registration failed");
        }
        return data;
    },

    // --- Resources ---
    async getResources(skill) {
        const url = skill ? `${API_BASE_URL}/api/resources?skill=${skill}` : `${API_BASE_URL}/api/resources`;
        const response = await fetch(url);
        return await response.json();
    },

    // --- Hackathons ---
    async getHackathons(skills = []) {
        const response = await fetch(`${API_BASE_URL}/api/hackathons`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skills })
        });
        return await response.json();
    },

    // --- Interview Preparation ---
    async getInterviewQuestions(tech) {
        const response = await fetch(`${API_BASE_URL}/api/interview?tech=${tech}`);
        return await response.json();
    },

    // --- Resume Builder ---
    async generateResume(userData, projectData) {
        const response = await fetch(`${API_BASE_URL}/api/resume/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: userData, project: projectData })
        });
        return await response.json();
    }
};
