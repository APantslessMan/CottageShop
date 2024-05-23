from datetime import date
from flask import Flask, abort, jsonify, render_template, redirect, url_for, flash, request
from flask_bootstrap import Bootstrap5
from flask_ckeditor import CKEditor
from flask_gravatar import Gravatar
from flask_login import UserMixin, login_user, LoginManager, current_user, logout_user
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship, DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Text
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import sys
import logging
# Optional: add contact me email functionality (Day 60)
# import smtplib
import os
app = Flask(__name__)
app.config['SECRET_KEY'] = "secret-key"
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///cottage.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, origins=['http://localhost:3000'], supports_credentials=True)
jwt = JWTManager(app)
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(250), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    username = db.Column(db.String(250), unique=True, nullable=False)
    purchases = db.Column(db.String(250), nullable=True)
    role = db.Column(db.String(80), nullable=False, default='user')  # Add a role column
    orders = relationship("Orders", back_populates="user")

class Products(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    price = db.Column(db.String(250), nullable=False)
    img_url = db.Column(db.String(250), nullable=False)

class Orders(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    order_status = db.Column(db.String(250), nullable=False)
    user = relationship("User", back_populates="orders")

with app.app_context():
    db.create_all()

@app.route('/api/products')
def get_products():
    products = Products.query.all()
    products_data = [
        {"id": product.id, "name": product.name, "price": product.price}
        for product in products
    ]
    return jsonify(products_data)

@app.route('/api/user')
def get_user():
    users = User.query.all()
    user_data = [
        {
            "id": user.id,
            "name": user.name, 
            "email": user.email, 
            "purchases": user.purchases, 
        }
        for user in users
    ]
    return jsonify(user_data)


@app.route('/api/order')
def get_orders():
    orders = Orders.query.all()
    order_data = [
        {
            "id": order.id,
            "name": order.userid, 
            "email": order.productid, 
            "purchases": order.order_status, 
        }
        for order in orders
    ]
    return jsonify(order_data)

@app.route('/api/order/<int:order_id>')
def get_order(order_id):
    order = Orders.query.get(order_id)
    if order:
        return jsonify(
            {
                "id": order.id,
                "name": order.userid, 
                "email": order.productid, 
                "purchases": order.order_status, 
            }
        )
    return jsonify({"error": "Order not found"}), 404

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data['email']
    username = data['username']
    password = data['password']
    role = data.get('role', 'user')  # Default role is 'user'

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 409

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
    new_user = User(username=username, email=email, password=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()
    response = jsonify({"message": "User registered successfully"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000") 
    return response, 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    login = data['login']
    password = data['password']

    user = User.query.filter((User.email == login) | (User.username == login)).first()

    if user and check_password_hash(user.password, password):
  
        access_token = create_access_token(identity={'email': user.email, 'username': user.username, 'role': user.role})
        bakecookies = make_response(jsonify(message="Logged in", role=user.role), 200)
        bakecookies.set_cookie("access_token_cookie", access_token, httponly=True)
        return bakecookies
    else:
        print("Password check failed")
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/role', methods=['GET'])
@jwt_required(locations=['cookies'])
def get_role():
    identity = get_jwt_identity()
    return jsonify({'role': identity['role']}), 200

@app.route('/auth', methods=['GET'])
@jwt_required(locations=['cookies'])  # Requires authentication
def check_authentication():
    user_id = get_jwt_identity()
    return jsonify({'message': 'Authentication successful'}), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

# @app.route('/admin', methods=['GET'])
# @jwt_required()
# def admin():
#     current_user = get_jwt_identity()
#     if current_user['role'] != 'admin':
#         return jsonify({"message": "Admins only!"}), 403
#     return jsonify({"message": "Welcome, admin!"}), 200

@app.route('/admin')
@jwt_required()
def admin():
    claims = get_jwt_identity()
    if claims['role'] != 'admin':
        return jsonify(message='Access denied'), 403
    return jsonify({"message": "Welcome, admin!"}), 200

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(debug=True)