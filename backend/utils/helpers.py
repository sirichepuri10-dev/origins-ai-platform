def format_skill_name(skill):
    return skill.strip().capitalize()

def calculate_score(skill_match, interest_match, difficulty_match):
    return round((skill_match * 0.6) + (interest_match * 0.3) + (difficulty_match * 0.1), 2)
