const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:5000"
        : "https://origins-ai-backend.onrender.com");

const ApiService = {
    async _request(url, options = {}) {
        const response = await fetch(url, options);
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || `Error ${response.status}`);
            return data;
        } else {
            const text = await response.text();
            console.error(`Unexpected Response from ${url}:`, text.substring(0, 200));
            
            if (response.status === 404) {
                throw new Error("Server Error: API route not found (404). Please check backend logs.");
            } else if (response.status >= 500) {
                throw new Error("Server Error: The backend crashed (500). Please check backend logs.");
            }
            throw new Error(`Server Error: Received unexpected ${response.status} response.`);
        }
    },

    async getRecommendations(userData) {
        return this._request(`${API_BASE_URL}/api/recommend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
    },

    async getRoadmap(userData) {
        return this._request(`${API_BASE_URL}/api/roadmap`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ goal: userData.interest, skills: userData.skills })
        });
    },

    async getTrendingGithub(userData) {
        return this._request(`${API_BASE_URL}/api/github/trending`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
    },

    async seedDatabase() {
        return this._request(`${API_BASE_URL}/seed`);
    },

    async login(email, password) {
        return this._request(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
    },

    async register(name, email, password) {
        return this._request(`${API_BASE_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
    },

    async getResources(skill) {
        const url = skill ? `${API_BASE_URL}/api/resources?skill=${skill}` : `${API_BASE_URL}/api/resources`;
        return this._request(url);
    },

    async getHackathons(skills = []) {
        return this._request(`${API_BASE_URL}/api/hackathons`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skills })
        });
    },

    async getInterviewQuestions(tech) {
        return this._request(`${API_BASE_URL}/api/interview?tech=${tech}`);
    },

    async generateResume(userData, projectData) {
        return this._request(`${API_BASE_URL}/api/resume/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: userData, project: projectData })
        });
    }
};
