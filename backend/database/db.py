from pymongo import MongoClient
import os
from config import Config

class Database:
    _client = None
    _db = None

    @classmethod
    def get_db(cls):
        if cls._db is None:
            try:
                cls._client = MongoClient(Config.MONGO_URI, 
                                          serverSelectionTimeoutMS=5000,
                                          tlsAllowInvalidCertificates=True)
                # Force a call to check if connection is valid
                cls._client.admin.command('ping')
                cls._db = cls._client.get_database()
            except Exception as e:
                print(f"⚠️ DATABASE CONNECTION ERROR: {e}")
                cls._db = None
        return cls._db

db = Database.get_db()
