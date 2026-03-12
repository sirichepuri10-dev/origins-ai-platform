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

class ResourceService:
    @staticmethod
    def get_resources_by_skill(skill_name):
        if db:
            try:
                resource = db.resources.find_one({"skill": {"$regex": f"^{skill_name}$", "$options": "i"}})
                if resource:
                    return resource.get('links', [])
            except Exception:
                pass
        
        # Fallback
        all_res = load_from_json('resources')
        for r in all_res:
            if r.get('skill', '').lower() == skill_name.lower():
                return r.get('links', [])
        return []

    @staticmethod
    def get_all_resources():
        if db:
            try:
                return list(db.resources.find({}, {'_id': 0}))
            except Exception:
                pass
        return load_from_json('resources')
