class SkillGapAnalyzer:
    @staticmethod
    def analyze(user_skills, project_skills):
        user_skills_set = set([skill.lower().strip() for skill in user_skills])
        project_skills_set = set([skill.lower().strip() for skill in project_skills])

        matched = user_skills_set.intersection(project_skills_set)
        missing = project_skills_set.difference(user_skills_set)

        match_score = (len(matched) / len(project_skills_set)) * 100 if project_skills_set else 0

        return {
            "match_score": round(match_score, 2),
            "matched_skills": list(matched),
            "missing_skills": list(missing),
            "total_required": len(project_skills_set)
        }
