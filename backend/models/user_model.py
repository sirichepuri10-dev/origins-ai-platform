class User:
    def __init__(self, name, skills, interest, level):
        self.name = name
        self.skills = skills
        self.interest = interest
        self.level = level

    def to_json(self):
        return {
            "name": self.name,
            "skills": self.skills,
            "interest": self.interest,
            "level": self.level
        }
