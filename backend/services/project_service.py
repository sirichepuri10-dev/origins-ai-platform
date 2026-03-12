from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

import json

class ProjectService:
    def __init__(self, db_uri):
        try:
            self.client = MongoClient(db_uri, serverSelectionTimeoutMS=2000)
            self.db = self.client.get_database() if 'mongodb' in db_uri else self.client['origins_db']
            self.projects = self.db['projects']
            # Test connection
            self.client.admin.command('ping')
            self.db_available = True
        except Exception:
            self.db_available = False
            self.projects = None

    def get_all_projects(self):
        if self.db_available:
            try:
                return list(self.projects.find({}, {'_id': 0}))
            except Exception:
                pass
        
        # Fallback to local JSON
        try:
            base_dir = os.path.dirname(os.path.dirname(__file__))
            path = os.path.join(base_dir, 'database', 'seed_projects.json')
            with open(path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Fallback Error: {e}")
            return []

    def seed_projects(self, projects_list):
        if self.db_available:
            try:
                if self.projects.count_documents({}) == 0:
                    self.projects.insert_many(projects_list)
                    return True
            except Exception:
                return False
        return False
