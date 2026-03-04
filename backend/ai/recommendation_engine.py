from .skill_gap_analyzer import SkillGapAnalyzer

class RecommendationEngine:
    @staticmethod
    def get_recommendations(user, all_projects):
        scored_projects = []
        user_skills = user.get('skills', [])
        user_interest = user.get('interest', '').lower()
        user_level = user.get('level', '').lower()

        for project in all_projects:
            # AI Skill Gap Analysis (60% weight)
            analysis = SkillGapAnalyzer.analyze(user_skills, project.get('skills', []))
            skill_score = analysis['match_score'] * 0.60

            # Interest Alignment (30% weight) - Smart Mapping
            category_map = {
                "artificial intelligence": ["ai", "machine learning", "nlp"],
                "web development": ["web dev", "frontend", "backend", "fullstack"],
                "cloud computing": ["cloud", "aws", "azure", "gcp"],
                "mobile development": ["mobile apps", "android", "ios", "flutter", "react native"],
                "game development": ["game dev", "unity", "unreal"],
                "cybersecurity": ["cybersecurity", "security", "penetration testing"]
            }
            
            project_cat = project.get('category', '').lower()
            is_match = project_cat == user_interest
            
            # Check mapping if no direct match
            if not is_match and user_interest in category_map:
                is_match = project_cat in category_map[user_interest]
                
            interest_score = 30 if is_match else 0

            # Difficulty Match (10% weight)
            difficulty_score = 10 if project.get('difficulty', '').lower() == user_level else 5

            total_score = skill_score + interest_score + difficulty_score

            scored_projects.append({
                **project,
                "score": round(total_score, 2),
                "analysis": analysis
            })

        # Sort by total score (descending)
        scored_projects.sort(key=lambda x: x['score'], reverse=True)

        return scored_projects[:5] # Top 5 recommendations
