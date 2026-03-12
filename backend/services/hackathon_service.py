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

class HackathonService:
    @staticmethod
    def get_hackathons_by_skills(user_skills):
        user_skills_set = set([s.lower() for s in user_skills])
        
        all_h = []
        if db:
            try:
                all_h = list(db.hackathons.find({}, {'_id': 0}))
            except Exception:
                pass
        
        if not all_h:
            all_h = load_from_json('hackathons')

        matches = []
        for h in all_h:
            h_skills = set([s.lower() for s in h.get('skills', [])])
            if user_skills_set.intersection(h_skills):
                matches.append(h)
        
        return matches if matches else all_h[:5]

    @staticmethod
    def get_all_hackathons():
        if db:
            try:
                return list(db.hackathons.find({}, {'_id': 0}))
            except Exception:
                pass
        return load_from_json('hackathons')
