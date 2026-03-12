from flask import Blueprint, jsonify, request
from services.resource_service import ResourceService

resource_bp = Blueprint('resource', __name__)

@resource_bp.route('/resources', methods=['GET'])
def get_resources():
    skill = request.args.get('skill')
    if skill:
        links = ResourceService.get_resources_by_skill(skill)
        return jsonify({"skill": skill, "links": links}), 200
    
    all_resources = ResourceService.get_all_resources()
    return jsonify({"resources": all_resources}), 200
