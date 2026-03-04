from flask import Blueprint, request, jsonify
from services.github_service import GitHubService

github_bp = Blueprint('github', __name__)

@github_bp.route('/github/trending', methods=['POST'])
def get_trending():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Use the first skill or a primary interest to fetch trending repos
        skills = data.get('skills', [])
        primary_skill = skills[0] if skills else "python"
        
        # If no skills provided, fall back to interest
        interest = data.get('interest', 'AI')
        query = primary_skill if primary_skill != "python" else interest
        
        trending_repos = GitHubService.fetch_trending_projects(query)
        return jsonify({"trending_repos": trending_repos}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
