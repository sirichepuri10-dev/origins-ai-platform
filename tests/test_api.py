import unittest
import json
import sys
import os

# Set backend path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import app

class TestOriginsAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_home(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn("Welcome", data["message"])

    def test_recommend_no_data(self):
        response = self.app.post('/recommend', 
                                 data=json.dumps({}),
                                 content_type='application/json')
        # Should return recommendations (with empty skills) or error based on logic
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
