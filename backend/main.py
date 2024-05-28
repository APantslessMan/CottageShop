from datetime import datetime, timedelta, timezone
from flask import Flask, abort, jsonify, render_template, redirect, url_for, flash, request
from flask_bootstrap import Bootstrap5
from flask_ckeditor import CKEditor
from flask_gravatar import Gravatar
from flask_login import UserMixin, login_user, LoginManager, current_user, logout_user
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship, DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Text, ForeignKey
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
import json
import sys
import logging


# import smtplib
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = "secret-key"
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///cottage.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_REFRESH_COOKIE_PATH'] = '/'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
app.config['JWT_CSRF_IN_COOKIES'] = False

CORS(app, origins=['http://localhost:3000'], supports_credentials=True)
jwt = JWTManager(app)
db = SQLAlchemy(app)


###############################################################
#                   DataBase Schema                           #
###############################################################

product_stock_association = db.Table('product_stock_association',
    db.Column('product_id', db.Integer, db.ForeignKey('products.id')),
    db.Column('stockpart_id', db.Integer, db.ForeignKey('stockparts.id')),
    db.Column('quantity', db.Integer, nullable=False)
)


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(250), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    username = db.Column(db.String(250), unique=True, nullable=False)
    purchases = db.Column(db.String(250), nullable=True)
    role = db.Column(db.String(80), nullable=False, default='user')
    orders = db.relationship("Order", back_populates="user")


class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    img_url = db.Column(db.String(250), nullable=True)
    stockparts = db.relationship('StockPart', secondary=product_stock_association, backref='products')


class StockPart(db.Model):
    __tablename__ = "stockparts"
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=True)
    qty = db.Column(db.Integer, nullable=False)


class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True)
    items = db.Column(db.String(250), nullable=True)
    status = db.Column(db.String(80), nullable=False)
    ordered_by = db.Column(db.Integer, db.ForeignKey('users.id'))

    # Define association with User
    user = relationship("User", back_populates="orders")


class Site(db.Model):
    __tablename__ = 'sites'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    toggle = db.Column(db.String(250), nullable=False)
    prefs = db.Column(db.String(250), nullable=True)


class Plugin(db.Model):
    __tablename__ = 'plugins'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    toggle = db.Column(db.String(250), nullable=False)
    prefs = db.Column(db.String(250), nullable=True)


with app.app_context():
    db.create_all()


###############################################################
#                         API Routes                          #
###############################################################

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

    # Generate tokens
    access_token = create_access_token(identity={'email': email, 'username': username, 'role': role})
    refresh_token = create_refresh_token(identity={'email': email, 'username': username, 'role': role})

    # Create response
    response = jsonify({"message": "User registered successfully", "access_token": access_token})
    response.set_cookie("access_token_cookie", value=access_token, httponly=True,
                        expires=datetime.now(timezone.utc) + timedelta(minutes=15))
    response.set_cookie("refresh_token_cookie", value=refresh_token, httponly=True,
                        expires=datetime.now(timezone.utc) + timedelta(days=30))

    return response, 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    login = data['login']
    password = data['password']
    user = User.query.filter((User.email == login) | (User.username == login)).first()
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity={'email': user.email, 'username': user.username, 'role': user.role})
        refresh_token = create_refresh_token(
            identity={'email': user.email, 'username': user.username, 'role': user.role})

        response = make_response(jsonify(message="Logged in", role=user.role), 200)
        response.set_cookie("access_token_cookie", value=access_token, httponly=True,
                            expires=datetime.now(timezone.utc) + timedelta(minutes=15))
        response.set_cookie("refresh_token_cookie", value=refresh_token, httponly=True,
                            expires=datetime.now(timezone.utc) + timedelta(days=30))
        return response
    else:
        print("Password check failed")
        return jsonify({"message": "Invalid credentials"}), 401


@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    print(identity)
    access_token = create_access_token(identity=identity)
    response = make_response(jsonify(access_token=access_token), 200)
    response.set_cookie("access_token_cookie", value=access_token, httponly=True, expires=datetime.now(timezone.utc) + timedelta(minutes=15))
    print(response)
    return response


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    refresh_user = get_jwt_identity()
    return jsonify(logged_in_as=refresh_user), 200


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
@jwt_required()
def edit_user():
    raw_data = request.get_data()
    data_string = raw_data.decode('utf-8')
    data_dict = json.loads(data_string)
    operation = data_dict['op']
    operation_id = data_dict['userid']
    print('Operation:', operation)
    print('User ID:', operation_id)
    # requested = [request['op'], request['userid']]
    # user = User.query.get(requested[1])
    user_id = get_jwt_identity()
    if user_id['role'] == 'admin':
        session = db.session
        operation_user = session.get(User, operation_id)
        if operation_user:
            if operation == 'del':
                session.delete(operation_user)
                session.commit()
                print("deleting user")
                return jsonify({"message": "User Deleted"}), 200
            elif operation == 'res':
                new_pass = "password"
                new_pass_hash = generate_password_hash(new_pass, method='pbkdf2:sha256', salt_length=8)
                operation_user.password = new_pass_hash
                session.commit()
                return jsonify({"message": "Password reset for user"}), 200
                print("reset password for user")
            elif operation == 'role_up':
                if operation_user != 'admin':
                    operation_user.role = 'admin'
                    session.commit()
                    print("change role for user")
                    return jsonify({"message": "User Upgraded"}), 200
                else:
                    return jsonify({"message": "User is already top role"}), 400
            elif operation == 'role_down':
                if operation_user != 'user':
                    operation_user.role = 'user'
                    session.commit()
                    print("change role for user")
                    return jsonify({"message": "User downgraded"}), 200
                else:
                    return jsonify({"message": "User is already bottom role"}), 400
            else:
                print("invalid request")
            print("granted access")
            return jsonify({"message": "Invalid request"}), 400
        else:
            print("User not found")
            return jsonify({"message": "User not found"}), 404
    return jsonify({"message": "Unauthorized"}), 401


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
    response = make_response(jsonify(message="Logged out"))
    response.delete_cookie("access_token_cookie")
    response.delete_cookie("refresh_token_cookie")
    return response


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(debug=True)
