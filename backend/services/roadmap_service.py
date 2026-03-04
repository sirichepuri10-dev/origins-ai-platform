from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

class RoadmapService:
    def __init__(self, db_uri):
        self.client = MongoClient(db_uri)
        self.db = self.client['origins_db']
        self.roadmaps = self.db['roadmaps']

    def get_roadmap(self, goal):
        # Case insensitive match for the goal
        roadmap = self.roadmaps.find_one({"goal": {"$regex": f"^{goal}$", "$options": "i"}}, {'_id': 0})
        if not roadmap:
            # Fallback for broadly similar goals
            roadmap = self.roadmaps.find_one({"goal": {"$regex": goal, "$options": "i"}}, {'_id': 0})
        return roadmap

    def seed_roadmaps(self, roadmaps_list):
        if self.roadmaps.count_documents({}) == 0:
            self.roadmaps.insert_many(roadmaps_list)
            return True
        return False
