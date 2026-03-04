from flask import Blueprint, jsonify

user_bp = Blueprint('user', __name__)

@user_bp.route('/user', methods=['POST'])
def add_user():
    # Placeholder for adding user to DB
    return jsonify({"message": "User added successfully (Mock)"}), 201
