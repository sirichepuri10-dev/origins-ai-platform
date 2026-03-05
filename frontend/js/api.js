const API_BASE_URL = "https://origins-ai-backend.onrender.com";

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
            const response = await fetch(`${API_BASE_URL}/seed`); // Seed stays at root since it is in app.py directly
            return await response.json();
        } catch (error) {
            console.error("Seed Error:", error);
            throw error;
        }
    }
};
