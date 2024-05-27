from datetime import datetime, timedelta, timezone
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
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    create_refresh_token,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies, unset_jwt_cookies,
    get_csrf_token
)

import sys
import logging
from flask_wtf.csrf import csrf_exempt
# Optional: add contact me email functionality (Day 60)
# import smtplib
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = "secret-key"
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///cottage.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/'
app.config['JWT_REFRESH_COOKIE_PATH'] = '/token/refresh'
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
app.config['JWT_CSRF_IN_COOKIES'] = False

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

#
# @app.route('/token/auth', methods=['POST'])
# def login():
#     username = request.json.get('username', None)
#     password = request.json.get('password', None)
#     if username != 'test' or password != 'test':
#         return jsonify({'login': False}), 401
#
#     # Set the JWTs and the CSRF double submit protection cookies
#     # in this response
#     resp = jsonify({'login': True})
#
#     # Create the tokens we will be sending back to the user
#     access_token = create_access_token(identity=username)
#     refresh_token = create_refresh_token(identity=username)
#
#     # client side will have to use these values when posting with X-CSRF-TOKEN header
#     resp.headers['csrf_access_token'] = get_csrf_token(access_token)
#     resp.headers['csrf_refresh_token'] = get_csrf_token(refresh_token)
#
#     # we still need to set the cookies
#     set_access_cookies(resp, access_token)
#     set_refresh_cookies(resp, refresh_token)
#     return resp, 200
#
#
# @app.route('/token/refresh', methods=['POST'])
# @jwt_refresh_token_required
# def refresh():
#     # Create the new access token
#     current_user = get_jwt_identity()
#     access_token = create_access_token(identity=current_user)
#
#     # Set the access JWT and CSRF double submit protection cookies
#     # in this response
#     resp = jsonify({'refresh': True})
#     set_access_cookies(resp, access_token)
#
#     # client side will have to use these values when posting with X-CSRF-TOKEN header
#     resp.headers['csrf_access_token'] = get_csrf_token(access_token)
#     return resp, 200
#
#
# # Because the JWTs are stored in an httponly cookie now, we cannot
# # log the user out by simply deleting the cookie in the frontend.
# # We need the backend to send us a response to delete the cookies
# # in order to logout. unset_jwt_cookies is a helper function to
# # do just that.
# @app.route('/token/remove', methods=['POST'])
# def logout():
#     resp = jsonify({'logout': True})
#     unset_jwt_cookies(resp)
#     return resp, 200
#
#
# @app.route('/api/example', methods=['GET'])
# @jwt_required
# def protected():
#     username = get_jwt_identity()
#     return jsonify({'hello': 'from {}'.format(username)}), 200
#
#
# @app.route('/api/post_example', methods=['POST'])
# @jwt_required
# def protected_post():
#     username = get_jwt_identity()
#     msg = request.json['message']
#     return jsonify({username: msg}), 200

@app.route('/api/products')
def get_products():
    products = Products.query.all()
    products_data = [
        {"id": product.id, "name": product.name, "price": product.price}
        for product in products
    ]
    return jsonify(products_data)


@app.route('/api/user')
@jwt_required(locations=['cookies'])
def get_user():
    users = User.query.all()
    user_data = [
        {
            "id": user.id,
            "name": user.username,
            "email": user.email,
            "purchases": user.purchases,
            "role": user.role
        }
        for user in users
    ]
    return jsonify(user_data)


@app.route('/useredit', methods=['POST'])
@jwt_required(locations=['cookies'])
@csrf_exempt
def edit_user(userid):

    requested = [request['op'], request['userid']]
    user = User.query.get(requested[1])
    user_id = get_jwt_identity()
    if user_id['role'] == 'admin':
        if request == 'del':
            #db.session.delete(user)
            print("deleting user")
        elif request == 'res':
            print("reset password for user")
        elif request == 'role':
            print("change role for user")
        else:
            print("invalid request")
        print("granted access")
        return jsonify({"message": "User "}), 401
    return jsonify({"message": "User "}), 200


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
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 409
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
        expiry_days = 30
        expiry_time = datetime.now(timezone.utc) + timedelta(days=expiry_days)

        access_token = create_access_token(identity={'email': user.email, 'username': user.username, 'role': user.role})
        bakecookies = make_response(jsonify(message="Logged in", role=user.role, access_token=access_token), 200)
        bakecookies.set_cookie("access_token_cookie", value=access_token, httponly=True, expires=expiry_time)
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
    print(user_id)
    return jsonify({'message': 'Authentication successful', 'username': user_id['username']}), 200


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


@app.route('/logout', methods=['POST'])
def logout():
    response = make_response({"msg": "Logged out"})
    response.set_cookie('access_token_cookie', '', expires=0)
    return response


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(debug=True)
