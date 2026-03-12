from flask import Blueprint, jsonify, request
from services.hackathon_service import HackathonService

hackathon_bp = Blueprint('hackathon', __name__)

@hackathon_bp.route('/hackathons', methods=['POST'])
def get_hackathons():
    data = request.get_json() or {}
    skills = data.get('skills', [])
    
    if skills:
        matches = HackathonService.get_hackathons_by_skills(skills)
        return jsonify({"hackathons": matches}), 200
    
    all_hackathons = HackathonService.get_all_hackathons()
    return jsonify({"hackathons": all_hackathons}), 200
