class Project:
    def __init__(self, name, skills, difficulty, category, description, github_link=""):
        self.name = name
        self.skills = skills
        self.difficulty = difficulty
        self.category = category
        self.description = description
        self.github_link = github_link

    def to_json(self):
        return {
            "name": self.name,
            "skills": self.skills,
            "difficulty": self.difficulty,
            "category": self.category,
            "description": self.description,
            "github_link": self.github_link
        }
