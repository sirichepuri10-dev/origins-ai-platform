import sys
import os

# Set the path to the backend directory
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Import the main app instance
from backend.app import app

if __name__ == '__main__':
    # Add a check to suggest seeding the database if it's the first run
    print("🚀 Starting Origins AI Project Recommendation API...")
    print("💡 Don't forget to visit http://localhost:5000/seed to initialize your project data!")
    app.run(debug=True, port=5000)
