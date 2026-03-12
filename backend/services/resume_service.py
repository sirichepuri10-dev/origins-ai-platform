class ResumeService:
    @staticmethod
    def generate_resume_content(user_data, project_data):
        # generate a structured resume summary
        resume = {
            "name": user_data.get('name', 'User'),
            "contact": user_data.get('email', ''),
            "summary": f"A passionate developer interested in {', '.join(user_data.get('interests', []))}.",
            "skills": user_data.get('skills', []),
            "experience": [
                {
                    "title": f"Project: {project_data.get('name', 'N/A')}",
                    "description": project_data.get('description', ''),
                    "technologies": project_data.get('skills', []),
                    "role": "Lead Developer"
                }
            ]
        }
        return resume
