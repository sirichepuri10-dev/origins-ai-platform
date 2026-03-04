from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from routes.recommendation_routes import recommendation_bp
from routes.user_routes import user_bp
from routes.project_routes import project_bp
from routes.roadmap_routes import roadmap_bp
from routes.github_routes import github_bp
from services.project_service import ProjectService
from services.roadmap_service import RoadmapService
import json
import os

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

# Register Blueprints
app.register_blueprint(recommendation_bp)
app.register_blueprint(user_bp)
app.register_blueprint(project_bp)
app.register_blueprint(roadmap_bp)
app.register_blueprint(github_bp)

project_service = ProjectService(Config.MONGO_URI)
roadmap_service = RoadmapService(Config.MONGO_URI)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to Origins AI Project Recommendation API!"})

@app.route('/seed', methods=['GET'])
def seed():
    try:
        print("Seeding started...")
        # Load seed projects
        base_dir = os.path.dirname(__file__)
        seed_path_projects = os.path.join(base_dir, 'database', 'seed_projects.json')
        print(f"Checking projects at: {seed_path_projects}")
        
        if not os.path.exists(seed_path_projects):
            return jsonify({"error": f"Path not found: {seed_path_projects}"}), 404
            
        with open(seed_path_projects, 'r') as f:
            projects_data = json.load(f)
        
        # Load seed roadmaps
        seed_path_roadmaps = os.path.join(base_dir, 'database', 'seed_roadmaps.json')
        print(f"Checking roadmaps at: {seed_path_roadmaps}")
        
        if not os.path.exists(seed_path_roadmaps):
            return jsonify({"error": f"Path not found: {seed_path_roadmaps}"}), 404
            
        with open(seed_path_roadmaps, 'r') as f:
            roadmaps_data = json.load(f)
        
        print("Inserting data into MongoDB...")
        result_projects = project_service.seed_projects(projects_data)
        result_roadmaps = roadmap_service.seed_roadmaps(roadmaps_data)
        
        print(f"Result - Projects: {result_projects}, Roadmaps: {result_roadmaps}")
        return jsonify({
            "message": "Database seeded successfully!",
            "projects_status": result_projects,
            "roadmaps_status": result_roadmaps
        }), 201
    except Exception as e:
        print(f"SEED ERROR: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
