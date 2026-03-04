from ai.recommendation_engine import RecommendationEngine

class RecommendationService:
    def __init__(self, project_service):
        self.project_service = project_service

    def get_recommendations(self, user_data):
        all_projects = self.project_service.get_all_projects()
        return RecommendationEngine.get_recommendations(user_data, all_projects)
