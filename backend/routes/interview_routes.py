from flask import Blueprint, jsonify, request
from services.interview_service import InterviewService

interview_bp = Blueprint('interview', __name__)

@interview_bp.route('/interview', methods=['GET'])
def get_interview_questions():
    tech = request.args.get('tech')
    if not tech:
        return jsonify({"error": "Technology parameter is required"}), 400
    
    questions = InterviewService.get_questions_by_tech(tech)
    return jsonify({"technology": tech, "questions": questions}), 200
