from flask import Blueprint, jsonify

project_bp = Blueprint('project', __name__)

@project_bp.route('/projects', methods=['GET'])
def get_projects():
    # Placeholder for getting all projects
    return jsonify({"projects": []}), 200
