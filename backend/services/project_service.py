from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

class ProjectService:
    def __init__(self, db_uri):
        self.client = MongoClient(db_uri)
        self.db = self.client['origins_db']
        self.projects = self.db['projects']

    def add_project(self, project_data):
        return self.projects.insert_one(project_data).inserted_id

    def get_all_projects(self):
        return list(self.projects.find({}, {'_id': 0}))

    def seed_projects(self, projects_list):
        if self.projects.count_documents({}) == 0:
            self.projects.insert_many(projects_list)
            return True
        return False
