class SkillExtractor:
    @staticmethod
    def analyze(user_skills, project_skills):
        user_skills_set = set([skill.lower() for skill in user_skills])
        project_skills_set = set([skill.lower() for skill in project_skills])

        matched_skills = user_skills_set.intersection(project_skills_set)
        missing_skills = project_skills_set.difference(user_skills_set)

        match_percentage = (len(matched_skills) / len(project_skills_set)) * 100 if project_skills_set else 0

        return {
            "match_percentage": round(match_percentage, 2),
            "matched_skills": list(matched_skills),
            "missing_skills": list(missing_skills)
        }
