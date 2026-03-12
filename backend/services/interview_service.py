import os
import json
from database.db import db

def load_from_json(key):
    try:
        base_dir = os.path.dirname(os.path.dirname(__file__))
        path = os.path.join(base_dir, 'database', 'seed_extra.json')
        if os.path.exists(path):
            with open(path, 'r') as f:
                data = json.load(f)
                return data.get(key, [])
    except Exception:
        pass
    return []

class InterviewService:
    @staticmethod
    def get_questions_by_tech(tech_name):
        if db is not None:
            try:
                record = db.interview_questions.find_one({"technology": {"$regex": f"^{tech_name}$", "$options": "i"}})
                if record:
                    return record.get('questions', [])
            except Exception:
                pass
                
        # Fallback
        all_q = load_from_json('interview_questions')
        for q in all_q:
            if q.get('technology', '').lower() == tech_name.lower():
                return q.get('questions', [])
        return []
