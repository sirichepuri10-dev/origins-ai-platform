from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from routes.recommendation_routes import recommendation_bp
from routes.user_routes import user_bp
from routes.project_routes import project_bp
from routes.roadmap_routes import roadmap_bp
from routes.github_routes import github_bp
from routes.auth_routes import auth_bp
from routes.resource_routes import resource_bp
from routes.interview_routes import interview_bp
from routes.hackathon_routes import hackathon_bp
from routes.resume_routes import resume_bp
from services.project_service import ProjectService
from services.roadmap_service import RoadmapService
from database.db import db
import json
import os

# Configure Flask to serve the frontend folder as static files
app = Flask(__name__, 
            static_folder='../frontend', 
            static_url_path='')
CORS(app)
app.config.from_object(Config)
app.url_map.strict_slashes = False

# Register Blueprints with /api prefix
app.register_blueprint(recommendation_bp, url_prefix='/api')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(project_bp, url_prefix='/api')
app.register_blueprint(roadmap_bp, url_prefix='/api')
app.register_blueprint(github_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(resource_bp, url_prefix='/api')
app.register_blueprint(interview_bp, url_prefix='/api')
app.register_blueprint(hackathon_bp, url_prefix='/api')
app.register_blueprint(resume_bp, url_prefix='/api')

project_service = ProjectService(Config.MONGO_URI)
roadmap_service = RoadmapService(Config.MONGO_URI)

@app.before_request
def log_request_info():
    if not request.path.startswith('/static'):
        print(f"📡 Request: {request.method} {request.path}")

@app.route('/health')
def health():
    return jsonify({"status": "ok", "db": "online" if db else "offline"})

@app.route('/')
def home():
    return app.send_static_file('index.html')

# Catch-all route to serve other frontend files
@app.route('/<path:path>')
def serve_static(path):
    # Don't handle /api/ paths here
    if path.startswith('api/'):
        print(f"⚠️ API Route not found in catch-all: /api/{path.replace('api/', '')}")
        return jsonify({"error": f"API Route /api/{path.replace('api/', '')} not found on this server"}), 404
        
    try:
        return app.send_static_file(path)
    except:
        return app.send_static_file('index.html') # SPA support

# Global error handler for JSON responses
@app.errorhandler(404)
def not_found(e):
    if request.path.startswith('/api/'):
        print(f"❌ 404 Not Found: {request.path}")
        return jsonify({"error": f"Route {request.path} not found"}), 404
    return e

@app.errorhandler(405)
def method_not_allowed(e):
    if request.path.startswith('/api/'):
        print(f"❌ 405 Method Not Allowed: {request.path}")
        return jsonify({"error": "Method not allowed"}), 405
    return e

@app.errorhandler(500)
def server_error(e):
    if request.path.startswith('/api/'):
        print(f"❌ 500 Server Error: {request.path}")
        return jsonify({"error": "Internal server error"}), 500
    return e

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
        
        print("Check if Database is available...")
        if db is None:
             print("⚠️ DB skipped - continuing with local fallback mode.")
             return jsonify({
                 "message": "Backend is running in LOCAL FALLBACK mode (MongoDB unavailable).",
                 "status": "Success (Local)",
                 "note": "All improvements (Hackathons, Resources, etc.) are loaded from local JSON. You can already see them on the dashboard!"
             }), 201

        # Load extra seed data (resources, hackathons, interview questions)
        seed_path_extra = os.path.join(base_dir, 'database', 'seed_extra.json')
        if os.path.exists(seed_path_extra):
            with open(seed_path_extra, 'r') as f:
                extra_data = json.load(f)
            
            if 'resources' in extra_data:
                db.resources.delete_many({})
                db.resources.insert_many(extra_data['resources'])
            if 'hackathons' in extra_data:
                db.hackathons.delete_many({})
                db.hackathons.insert_many(extra_data['hackathons'])
            if 'interview_questions' in extra_data:
                db.interview_questions.delete_many({})
                db.interview_questions.insert_many(extra_data['interview_questions'])

        print("Inserting data into MongoDB...")
        result_projects = project_service.seed_projects(projects_data)
        result_roadmaps = roadmap_service.seed_roadmaps(roadmaps_data)
        
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
