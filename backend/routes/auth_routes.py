from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
import jwt
import datetime
from database.db import db
from config import Config
from models.user_model import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    # If DB is down, allow "Guest Mode" registration for exploration
    db_offline = (db is None)
    
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    if db_offline:
        return jsonify({
            "message": "User registered in GUEST MODE (DB Offline)",
            "user": {"name": name, "email": email, "skills": [], "interests": [], "level": "Beginner"},
            "token": "guest_token_limited"
        }), 201
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    users_col = db.users
    if users_col.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    new_user = User(name, email, password)
    user_data = new_user.to_json()
    user_data['password'] = new_user.password_hash 
    
    result = users_col.insert_one(user_data)
    
    # Generate token for auto-login
    token = jwt.encode({
        'user_id': str(result.inserted_id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, Config.SECRET_KEY, algorithm="HS256")

    return jsonify({
        "message": "User registered successfully",
        "token": token,
        "user": new_user.to_json()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    db_offline = (db is None)
    
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"error": "Missing email or password"}), 400

    if db_offline:
        return jsonify({
            "token": "guest_token_limited",
            "user": {
                "name": email.split('@')[0].capitalize(),
                "email": email,
                "skills": ["Python", "Web"],
                "interests": ["AI"],
                "level": "Beginner"
            },
            "message": "Logged in as Guest (DB Offline)"
        }), 200
    users_col = db.users
    user = users_col.find_one({"email": email})

    if user and User.check_password(user['password'], password):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm="HS256")
        
        return jsonify({
            "token": token,
            "user": {
                "name": user['name'],
                "email": user['email'],
                "skills": user.get('skills', []),
                "interests": user.get('interests', []),
                "level": user.get('level', 'Beginner')
            }
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401
