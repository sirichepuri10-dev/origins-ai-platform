from flask import Blueprint, jsonify, request
from services.resume_service import ResumeService

resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/resume/generate', methods=['POST'])
def generate_resume():
    data = request.get_json()
    user_data = data.get('user', {})
    project_data = data.get('project', {})
    
    if not user_data or not project_data:
        return jsonify({"error": "User and project data are required"}), 400
    
    resume_content = ResumeService.generate_resume_content(user_data, project_data)
    return jsonify({"resume": resume_content}), 200
