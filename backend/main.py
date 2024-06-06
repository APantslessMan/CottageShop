from datetime import datetime, timedelta, timezone

from flask import Flask, abort, jsonify, render_template, redirect, url_for, flash, request, send_from_directory
from flask_bootstrap import Bootstrap5
from flask_ckeditor import CKEditor
from flask_gravatar import Gravatar
from flask_login import UserMixin, login_user, LoginManager, current_user, logout_user
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship, DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Text, ForeignKey, Numeric, Boolean, JSON
from functools import wraps
from werkzeug.utils import secure_filename  # Correct import
from werkzeug.datastructures import FileStorage
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
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
import uuid
from dotenv import load_dotenv
# import smtplib
import os

load_dotenv()
allowed_origins = os.getenv('ALLOWED_ORIGINS')
app = Flask(__name__, static_url_path='', static_folder='build', template_folder='build')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'super-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = (
        f"postgresql+psycopg2://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
        f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
    )
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')
app.config['UPLOAD_FOLDER'] = './build/assets/img/site'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
CORS(app, origins=allowed_origins, supports_credentials=True)
jwt = JWTManager(app)
db = SQLAlchemy(app)

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])
###############################################################
#                   DataBase Schema                           #
###############################################################

product_stock_association = db.Table('product_stock_association',
                                     db.Column('product_id', db.Integer, db.ForeignKey('products.id')),
                                     db.Column('stockpart_id', db.Integer, db.ForeignKey('stockparts.id')),
                                     db.Column('quantity', db.Integer, nullable=False))

# cart_association = db.Table(
#     "cart_association",
#     db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
#     db.Column("product_id", db.Integer, db.ForeignKey("products.id"), primary_key=True),
#     db.Column("qty", db.Integer, nullable=False)
# )


class CartItem(db.Model):
    __tablename__ = "cart_items"
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)

    user = db.relationship("User", backref="cart_items")
    product = db.relationship("Product", backref="cart_items")

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(250), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    username = db.Column(db.String(250), unique=True, nullable=False)
    purchases = db.Column(db.String(250), nullable=True)
    role = db.Column(db.String(80), nullable=False, default='user')
    orders = db.relationship("Order", back_populates="user")
    cart = db.relationship("Product", secondary="cart_items", back_populates="users", overlaps="user,cart_items,product")


class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(precision=10, scale=2), nullable=False)
    img_url = db.Column(db.String(250), nullable=True)
    stockparts = db.relationship('StockPart', secondary=product_stock_association, backref='products')
    users = db.relationship("User", secondary="cart_items", back_populates="cart", overlaps="cart_items,user,product")


class StockPart(db.Model):
    __tablename__ = "stockparts"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    supplier = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(precision=10, scale=2), nullable=False)
    qty = db.Column(db.Numeric(precision=10, scale=2), nullable=False)


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
    toggle = db.Column(db.Boolean)
    prefs = db.Column(db.String(250), nullable=True)
    params = db.Column(db.JSON)


class Plugin(db.Model):
    __tablename__ = 'plugins'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    toggle = db.Column(db.String(250), nullable=False)
    prefs = db.Column(db.String(250), nullable=True)


with app.app_context():
    db.create_all()


###############################################################
#                         Util Functions                      #
###############################################################


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def img_path(directory):
    parts = directory.split(os.path.sep)
    if 'build' in parts:
        index_path = parts.index('build')
        parts = parts[index_path + 1:]
    new_filepath = os.path.join(*parts)
    return new_filepath


def add_to_cart(user_id, product_id, quantity):
    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)

    db.session.commit()
###############################################################
#                         API Routes                          #
###############################################################


@app.route("/")
def index():
    return render_template("index.html")
# @app.after_request
# def add_headers(response):
#     response.headers.add('Content-Type', 'application/json')
#     response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
#     response.headers.add('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     response.headers.add('Access-Control-Expose-Headers', 'Content-Type,Content-Length,Authorization,X-Pagination')
#     return response


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
    loginid = data['login']
    password = data['password']
    user = User.query.filter((User.email == loginid) | (User.username == loginid)).first()
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


@app.route('/products', methods=['POST', 'GET'])
@jwt_required()
def get_products():
    # TODO: add error checking and return
    json_data = request.json
    print(json_data)
    if json_data:
        op_id = json_data.get('id')
        op = json_data.get('op')
        print(json_data.get('op'))

        user_id = get_jwt_identity()
        if op != "list":
            if user_id['role'] == 'admin':
                print('in as admin')
                session = db.session
                operation_product = session.get(Product, op_id)
                print(operation_product)
                if operation_product:
                    if op == 'del':
                        session.delete(operation_product)
                        session.commit()
                        print("deleting product")
                        return jsonify({"message": "Product Deleted"}), 200
            else:
                print('not in admin')
                return jsonify({"message": "User is not admin"}), 401
        elif op == "list":
            products = Product.query.all()
            products_data = [
                {
                    "id": product.id,
                    "name": product.name,
                    "description": product.description,
                    "price": product.price,
                    "img_url": product.img_url

                }
                for product in products
            ]
            return jsonify(products_data), 200


@app.route('/cart', methods=['POST'])
@jwt_required()
def cart():
    username = get_jwt_identity()
    uname = username['username']
    user = User.query.filter_by(username=uname).first()
    if not user:
        return "User not found", 404
    print(user.id)
    product_id = request.json['product_id']
    qty = request.json.get('quantity', 1)  # Default quantity is 1 if not provided
    print(user.id, product_id, qty)
    add_to_cart(user.id, product_id, qty)

    return 'Item added to cart successfully', 200


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


@app.route('/editproduct', methods=['POST'])
@jwt_required()
def edit_product():
    try:
        data = request.form
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')
        img_url = data.get('img_url')
        stock_items = data.get('stockItems')
        stock_items = json.loads(stock_items)

        if 'image' in request.files:

            file = request.files['image']

            if file and allowed_file(file.filename):
                unique_id = str(uuid.uuid4())
                original_filename = secure_filename(file.filename)
                file_extension = os.path.splitext(original_filename)[1]
                filename = f"{name.replace(' ','')}_{unique_id}{file_extension}"
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                img_url = img_path(file_path)

        if name and description and price:
            new_product = Product(name=name, description=description, price=price, img_url=img_url)
            db.session.add(new_product)
            db.session.commit()

            for item in stock_items:
                print(item)
                stock_id = item['item']
                qty = item['quantity']
                stock_part = StockPart.query.get(stock_id)
                if stock_part:
                    assoc = product_stock_association.insert().values(
                        product_id=new_product.id,
                        stockpart_id=stock_id,
                        quantity=qty,
                    )
                    db.session.execute(assoc)

            db.session.commit()
            return jsonify({"message": "Product Change Successful"}), 201
        else:
            return jsonify({"error": "Invalid product data"}), 400

    except Exception as e:
        db.session.rollback()  # Rollback transaction in case of error
        return jsonify({"error": str(e)}), 500


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


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
                elif operation == 'upd':
                    print(operation_user)
                    return jsonify({"message": "User Updated"}), 200
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

@app.route('/stock_items', methods=['GET'])
def get_stock_items():
    stock_items = StockPart.query.all()
    stock_items_list = [{"id": item.id, "name": item.name} for item in stock_items]
    return jsonify(stock_items_list)


@app.route('/editstock', methods=['POST'])
@jwt_required()
def edit_stock():
    try:
        data = request.form
        op = request.get_data()
        print(op)
        name = data.get('name')
        description = data.get('description')
        supplier = data.get('supplier')
        qty = data.get('qty')
        price = data.get('price')
        print(name, description, supplier, qty, price)
        if name and price and qty:
            new_stock = StockPart(name=name, description=description, price=price, supplier=supplier, qty=qty)
            db.session.add(new_stock)
            db.session.commit()
            return jsonify({"message": "Stock Change Successful"}), 201
        else:
            return jsonify({"error": "Invalid product data"}), 400

    except Exception as e:
        db.session.rollback()  # Rollback transaction in case of error
        return jsonify({"error": str(e)}), 500


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


# Request basic site data, data is stored in Site DB, with name being <PAGE>_<Component> and data being
# stored in json column as { <item>: <data> }
@app.route('/api/json', methods=['POST'])
def get_json():
    data = request.json
    typed = data.get('type')
    if typed:
        rows = Site.query.filter(Site.name.like(f'{typed}_%')).all()
        row_dict = {}
        for row in rows:
            print(row.id)
            if row.toggle:
                row_dict[row.name] = row.params
                print(row)
        return jsonify(row_dict), 200
    return data, 200

@app.route('/role', methods=['GET'])
@jwt_required(locations=['cookies'])
def get_role():
    identity = get_jwt_identity()
    return jsonify({'role': identity['role']}), 200


@app.route('/auth', methods=['GET'])
@jwt_required()  # Requires authentication
def check_authentication():
    user_id = get_jwt_identity()
    print(user_id)
    return jsonify({'message': 'Authentication successful', 'username': user_id['username'], 'role': user_id['role']}), 200



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
