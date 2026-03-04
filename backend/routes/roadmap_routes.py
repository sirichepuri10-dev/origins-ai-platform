from flask import Blueprint, request, jsonify
from services.roadmap_service import RoadmapService
from ai.roadmap_generator import RoadmapGenerator
from config import Config

roadmap_bp = Blueprint('roadmap', __name__)
roadmap_service = RoadmapService(Config.MONGO_URI)

@roadmap_bp.route('/roadmap', methods=['POST'])
def get_roadmap():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        goal = data.get('goal', 'AI Engineer')
        skills = data.get('skills', [])
        
        # Load the base roadmap template
        roadmap_template = roadmap_service.get_roadmap(goal)

        if not roadmap_template:
            # Fallback for dynamic roadmap generation without an exact DB match
            roadmap_template = {"goal": goal, "steps": []}

        # Generate the dynamic roadmap with progress tracking
        # We wrap it in a list to satisfy the generator's template search or modify the generator
        dynamic_roadmap = RoadmapGenerator.generate_dynamic_roadmap(
            roadmap_template['goal'], 
            skills, 
            [roadmap_template]
        )

        return jsonify({"roadmap": dynamic_roadmap}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
