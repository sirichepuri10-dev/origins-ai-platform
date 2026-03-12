from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, name, email, password, skills=None, interests=None, level="Beginner"):
        self.name = name
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.skills = skills if skills else []
        self.interests = interests if interests else []
        self.level = level

    @staticmethod
    def check_password(password_hash, password):
        return check_password_hash(password_hash, password)

    def to_json(self, include_id=False):
        data = {
            "name": self.name,
            "email": self.email,
            "skills": self.skills,
            "interests": self.interests,
            "level": self.level
        }
        return data
