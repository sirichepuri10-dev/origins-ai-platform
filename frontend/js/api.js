const API_URL = "http://localhost:5000";

const ApiService = {
    async getRecommendations(userData) {
        try {
            const response = await fetch(`${API_URL}/recommend`, {
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
            const response = await fetch(`${API_URL}/roadmap`, {
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
            const response = await fetch(`${API_URL}/github/trending`, {
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
            const response = await fetch(`${API_URL}/seed`);
            return await response.json();
        } catch (error) {
            console.error("Seed Error:", error);
            throw error;
        }
    }
};
