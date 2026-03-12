from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

import json

class RoadmapService:
    def __init__(self, db_uri):
        try:
            self.client = MongoClient(db_uri, serverSelectionTimeoutMS=2000)
            self.db = self.client.get_database() if 'mongodb' in db_uri else self.client['origins_db']
            self.roadmaps = self.db['roadmaps']
            # Test connection
            self.client.admin.command('ping')
            self.db_available = True
        except Exception:
            self.db_available = False
            self.roadmaps = None

    def get_roadmap(self, goal):
        if self.db_available:
            try:
                # Case insensitive match for the goal
                roadmap = self.roadmaps.find_one({"goal": {"$regex": f"^{goal}$", "$options": "i"}}, {'_id': 0})
                if not roadmap:
                    # Fallback for broadly similar goals
                    roadmap = self.roadmaps.find_one({"goal": {"$regex": goal, "$options": "i"}}, {'_id': 0})
                if roadmap:
                    return roadmap
            except Exception:
                pass
        
        # Fallback to local JSON
        try:
            base_dir = os.path.dirname(os.path.dirname(__file__))
            path = os.path.join(base_dir, 'database', 'seed_roadmaps.json')
            with open(path, 'r') as f:
                data = json.load(f)
                # Find matching goal in list
                for r in data:
                    if goal.lower() in r.get('goal', '').lower():
                        return r
                return data[0] if data else None
        except Exception as e:
            print(f"Roadmap Fallback Error: {e}")
            return None

    def seed_roadmaps(self, roadmaps_list):
        if self.db_available:
            try:
                if self.roadmaps.count_documents({}) == 0:
                    self.roadmaps.insert_many(roadmaps_list)
                    return True
            except Exception:
                return False
        return False
