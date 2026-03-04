# System Design - Origins AI Project Recommender

## Architecture Overview
Origins uses a classic Client-Server architecture with a RESTful API and a NoSQL database.

### Frontend
- **Vanilla JS & HTML5**: High-performance, no-framework approach for maximum speed.
- **Glassmorphic CSS**: Modern UI style with translucency and vibrant gradients.
- **LocalStorage Data Persistence**: Temporarily stores user profile to share context between Landing and Dashboard pages.

### Backend
- **Flask (Python)**: Light-weight, scalable API.
- **Blueprint Routing**: Segregates concerns (User, Project, Recommendation).
- **Service Layer Pattern**: Logic is decoupled from routes for better testability.

### Database
- **MongoDB**: Flexible document storage.
- **Projects Dataset**: 500+ diverse projects across AI, Web, Mobile, etc.
- **Roadmaps Dataset**: Comprehensive learning paths for specific career goals.
- **Skills Catalog**: Reference for skill normalization and grouping.

## Recommendation Logic
Scoring is calculated based on:
1. **Skill Match (60%)**: Intersection of user skills vs project required skills.
2. **Interest Alignment (30%)**: Matches project category with user interest.
3. **Difficulty Check (10%)**: Proximity of project difficulty to user level.

## API Endpoints
- `POST /recommend`: Main engine for matching.
- `GET /seed`: Initialization endpoint for DB setup.
- `GET /projects`: List all available projects.
- `POST /user`: Register or update user profiles.
