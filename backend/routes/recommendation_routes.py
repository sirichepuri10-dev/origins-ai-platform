from flask import Blueprint, request, jsonify
from services.recommendation_service import RecommendationService
from services.project_service import ProjectService
from config import Config

recommendation_bp = Blueprint('recommendation', __name__)
project_service = ProjectService(Config.MONGO_URI)
recommendation_service = RecommendationService(project_service)

@recommendation_bp.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        user_data = {
            "skills": data.get('skills', []),
            "interest": data.get('interest', 'AI'),
            "level": data.get('level', 'Beginner')
        }

        recommendations = recommendation_service.get_recommendations(user_data)
        return jsonify({"recommended_projects": recommendations}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
