# 🚀 Origins 3.0 Elite – AI Developer Startup Platform

Origins is a Full-Stack AI-driven career platform that helps developers bridge the gap between their current skills and their dream career. It provides personalized project recommendations, dynamic skill gap analysis, and real-time open-source discovery.

## 🌟 Key Startup-Level Features
*   **🧠 AI Skill Gap Analyzer**: Automatically detects missing skills for every recommended project and evaluates profile readiness with a match score.
*   **🔎 GitHub Project Discovery**: Fetches live, trending open-source repositories from GitHub based on your developer profile (using GitHub REST API).
*   **🤖 Dynamic Career Roadmap**: Generates a personalized learning timeline that tracks your progress against core career milestones (AI, Web, Data Science, etc.).
*   **💡 Intelligent Recommendation Engine**: A weighted scoring algorithm (60% Skills, 30% Interest, 10% Experience) that sifts through 500+ projects.
*   **💎 Glassmorphic Dashboard**: A premium, high-converting UX with real-time feedback and state-of-the-art aesthetics.

## 🛠 Tech Stack
*   **Frontend**: HTML5, CSS3, JavaScript (ES6+), LocalStorage.
*   **Backend**: Python 3.10+, Flask (Blueprint-based Architecture).
*   **AI Engine**: Custom logic for skill extraction, scoring, and dynamic roadmapping.
*   **Database**: MongoDB (NoSQL) for high-performance project & roadmap delivery.
*   **Services**: Integration with external APIs (GitHub REST API).

---

## 🚀 Installation & Setup

### 1. Prerequisites
*   Python 3.10+
*   MongoDB running at `localhost:27017`
*   Internet connection (for GitHub Discovery)

### 2. Fast Launch
1.  **Install dependencies**:
    ```bash
    pip install -r backend/requirements.txt
    ```
2.  **Start the Platform**:
    ```bash
    python run.py
    ```
3.  **Bootstrap the Database**:
    Visit `http://localhost:5000/seed` once to load the 500+ project engine.

---

## 🧠 Professional System Architecture
```text
[User Device] ← (JSON) → [Flask API Layer]
                             ↓
        ┌────────────────────┴────────────────────┐
        ↓                    ↓                    ↓
 [AI Gap Analyzer]    [GitHub Explorer]    [Roadmap Engine]
        ↓                    ↓                    ↓
  [MongoDB Atlas]      [GitHub REST API]    [Progress Tracker]
```

## 🏆 Portfolio Impact
This project showcases high-level engineering skills:
- **API Orchestration**: Managing multiple data sources (Internal DB + External APIs).
- **Algorithmic Logic**: Implementing custom matching and recommendation systems.
- **Clean Code & Design**: Following the Service-Repository pattern and modern UI/UX principles.
- **Problem Solving**: Identifying and solving the "how to get started" problem for developers.
