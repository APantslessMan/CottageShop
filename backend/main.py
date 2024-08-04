from datetime import datetime, timedelta, timezone, date

from flask import Flask, request, jsonify, make_response, render_template, send_from_directory, redirect
from jinja2 import Template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from werkzeug.utils import secure_filename

from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import SQLAlchemyError
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    create_refresh_token,
    get_jwt_identity, get_jwt
)
import json
# import sys
import logging
import uuid
from dotenv import load_dotenv
import smtplib
import os
from aiosmtplib import SMTP
import asyncio
load_dotenv()

allowed_origins = os.getenv('ALLOWED_ORIGINS').split(',')
COOKIE_SECURITY = True
COOKIE_TYPES = ["access_token_cookie", "refresh_token_cookie", "public_token_cookie"]
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__, static_url_path='', static_folder='build', template_folder='build')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'super-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = (
        f"postgresql+psycopg2://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
        f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
    )
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = COOKIE_SECURITY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')
app.config['UPLOAD_FOLDER'] = './build/assets/img/site/'


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


product_category_association = db.Table(
    'product_category_association', db.Column('product_id', db.Integer, db.ForeignKey('products.id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'), primary_key=True))


class CartItem(db.Model):
    __tablename__ = "cart_items"
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)

    user = db.relationship("User", backref="cart_items")
    product = db.relationship("Product", backref="cart_items")


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(250), unique=True, nullable=False)
    f_name = db.Column(db.String(250), unique=True, nullable=False)
    l_name = db.Column(db.String(250), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    password = db.Column(db.String(250), nullable=False)
    username = db.Column(db.String(250), unique=True, nullable=False)
    purchases = db.Column(db.String(250), nullable=True)
    role = db.Column(db.String(80), nullable=False, default='user')
    orders = db.relationship("Order", back_populates="user")
    cart = db.relationship("Product", secondary="cart_items", back_populates="users",
                           overlaps="user,cart_items,product")


class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(250), nullable=False, unique=True)
    products = db.relationship('Product', secondary='product_category_association', back_populates='categories')

class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(250), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(precision=10, scale=2), nullable=False)
    img_url = db.Column(db.String(250), nullable=True)
    stockparts = db.relationship('StockPart', secondary=product_stock_association, backref='products')
    users = db.relationship("User", secondary="cart_items", back_populates="cart", overlaps="cart_items,user,product")
    categories = db.relationship('Category', secondary=product_category_association, back_populates='products')

class StockPart(db.Model):
    __tablename__ = "stockparts"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    supplier = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(precision=10, scale=2), nullable=False)
    qty = db.Column(db.Numeric(precision=10, scale=2), nullable=False)


class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    items = db.Column(db.String(250), nullable=True)
    status = db.Column(db.String(80), nullable=False)
    payment_type = db.Column(db.String(80), nullable=False)
    date_requested = db.Column(db.String(80), nullable=False)
    comments = db.Column(db.String(250), nullable=True)
    ordered_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = relationship("User", back_populates="orders")


class Site(db.Model):
    __tablename__ = 'sites'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(250), nullable=False)
    toggle = db.Column(db.Boolean)
    prefs = db.Column(db.String(250), nullable=True)
    params = db.Column(db.JSON)


class Plugin(db.Model):
    __tablename__ = 'plugins'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(250), nullable=False)
    toggle = db.Column(db.String(250), nullable=False)
    prefs = db.Column(db.String(250), nullable=True)


with app.app_context():
    db.create_all()


###############################################################
#                         Util Functions                      #
###############################################################

# Splits File extension Set
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Returns OS specific filepaths
def img_path(directory):
    parts = directory.split(os.path.sep)
    if 'build' in parts:
        index_path = parts.index('build')
        parts = parts[index_path + 1:]
    new_filepath = os.path.join(*parts)
    return new_filepath


# Saves image file to UPLOAD_FOLDER, renames to "name_UUID_string.extension" and returns the filepath
def file_parse(name, file):
    unique_id = str(uuid.uuid4())
    original_filename = secure_filename(file.filename)
    file_extension = os.path.splitext(original_filename)[1]
    filename = f"{name.replace(' ','')}_{unique_id}{file_extension}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    img_url = img_path(file_path)

    return img_url


def get_from_cart(user_id):
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    items_list = []
    for item in cart_items:
        item_dict = {
            'product': item.product_id,
            'quantity': item.quantity,
        }
        items_list.append(item_dict)
    return items_list


def add_to_cart(user_id, product_id, quantity):
    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)

    db.session.commit()


def del_from_cart(user_id, product_id, quantity):
    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if cart_item:
        if cart_item.quantity <= quantity:
            cart_item.quantity -= quantity
            db.session.delete(cart_item)
            db.session.commit()
            return True
        elif cart_item.quantity > quantity:
            cart_item.quantity -= quantity

            db.session.commit()
            return True
        else:
            return False


def clear_cart(username):
    try:
        user = User.query.filter_by(username=username).first()

        if not user:
            return False
        cart_items = CartItem.query.filter_by(user_id=user.id).all()
        if cart_items:
            for item in cart_items:
                db.session.delete(item)
            db.session.commit()
            return True
        else:
            return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False


def set_cookies(email, username, role, f_name, l_name, phone_number):
    identity_dict = {'email': email, 'username': username, 'role': role, 'f_name': f_name, 'l_name': l_name,
                     'phone_number': phone_number }
    access_token = create_access_token(identity=identity_dict)
    refresh_token = create_access_token(identity=identity_dict)
    session_token = create_access_token(identity=identity_dict)
    response = make_response(jsonify(message="Logged in", role=role, email=email, f_name=f_name, l_name=l_name,
                                     phone_number=phone_number), 200)
    for i in COOKIE_TYPES:
        if "public" in i:
            response.set_cookie(i, value=session_token, expires=datetime.now(timezone.utc) + timedelta(days=30),
                                httponly=False, secure=COOKIE_SECURITY, samesite='Lax')
        elif "access" in i:
            response.set_cookie(i, value=access_token, expires=datetime.now(timezone.utc) + timedelta(minutes=15),
                                httponly=True, secure=COOKIE_SECURITY, samesite='Lax')
        elif "refresh" in i:
            response.set_cookie(i, value=refresh_token, expires=datetime.now(timezone.utc) + timedelta(days=30),
                                httponly=True, secure=COOKIE_SECURITY, samesite='Lax')
    return response





async def send_mail(order, cart_items, email, order_id, name):
    print(cart_items[0])

    email_order = {
        "items": cart_items,
        "contact": order.payment_type,
        "date": order.date_requested,
        "customer": email,
        "comments": order.comments
    }

    subject = f"Cottage Shop - Order Created for {order.date_requested}"

    email_info = Site.query.filter_by(name="email").first()
    params = email_info.params
    print(params)

    smtp_server = params['smtp_server']
    smtp_port = params['smtp_port']
    sender_email = params['sender_email']
    sender_password = params['sender_pass']
    receiver_email = email_order['customer']

    order_items = []
    order_total = 0.0

    for i in cart_items:
        print(i['id'])
        item = Product.query.filter_by(id=i['id']).first()
        item_list = {"item": item.name, "price": f"{item.price:.2f}", "quantity": i['quantity']}
        order_items.append(item_list)
        order_total += float(item.price) * float(i['quantity'])

    print(order_total)

    email_template = """
    <h1>Order Confirmation</h1>
    <p>Order ID: {{ order_id }}</p>
    <p>Customer: {{ name }} ({{ email_order.customer }})</p>
    <p>Contact type: {{ email_order.contact }}</p>
    <p>Date: {{ email_order.date }}</p>
    <p>Comments: {{ email_order.comments }}</p>
    <h2>Items:</h2>
    <ul>
    {% for item in order_items %}
        <li>{{ item.item }} - ${{ item.price }} x {{ item.quantity }}</li>
    {% endfor %}
    </ul>
    <p>Total: ${{ order_total }}</p>
    </br>
    <p>Payment can be made via E-Transfer to kccpetersen@gmail.com</p>
    """

    template = Template(email_template)
    body = template.render(order_id=order_id, name=name, email_order=email_order, order_items=order_items,
                           order_total=f"{order_total:.2f}")

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))

    recipients = [receiver_email, sender_email]

    try:
        async with SMTP(hostname=smtp_server, port=smtp_port) as server:

            await server.login(sender_email, sender_password)
            await server.sendmail(sender_email, recipients, msg.as_string())

        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")


# Note: Make sure to adjust your import paths and dependencies according to your project setup.


###############################################################
#                         API Routes                          #
###############################################################


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            identity = get_jwt_identity()
            if not identity['phone_number']:
                identity['phone_number'] = '111-111-1111'
            set_cookies(identity['email'], identity['username'],
                        identity['role'], identity['f_name'], identity['l_name'], identity['phone_number'])
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response


@app.route('/')
def root():
    # Fetch OG data from the database
    data = Site.query.filter_by(name='seo_meta').first()
    if data:
        og_data = data.params
        return render_template('index.html', **og_data)
    else:
        # Handle the case where no data is found
        return render_template('index.html')


@app.route('/manifest.json')
def manifest():
    data = Site.query.filter_by(name='seo_meta').first()

    manifest_data = data.params
    if len(manifest_data['title']) > 12:
        manifest_data['short_title'] = manifest_data['title'][:12]
    else:
        manifest_data['short_title'] = manifest_data['title']

    return render_template('manifest.json', **manifest_data)


@app.route('/image/<path:path>')
def send_icon(path):
    return send_from_directory('./build/assets/img/', path)


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    print(data)
    email = data['email'].lower()
    username = data['username'].lower()
    password = data['password']
    f_name = data['f_name']
    l_name = data['l_name']
    phone_number = 1
    role = data.get('role', 'user')  # Default role is 'user'
    print(data)
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 409
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 409

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
    new_user = User(username=username, email=email, password=hashed_password, role=role, f_name=f_name, l_name=l_name)
    db.session.add(new_user)
    db.session.commit()
    response = set_cookies(email, username, role, f_name, l_name, phone_number)
    return response, 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    loginid = data['login'].lower()
    password = data['password']
    user = User.query.filter((User.email == loginid) | (User.username == loginid)).first()
    if user and check_password_hash(user.password, password):
        response = set_cookies(user.email, user.username, user.role, user.f_name, user.l_name, user.phone_number)
        print(response)
        return response
    else:
        return jsonify({"message": "Invalid credentials"}), 401


@app.route('/api/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
#     identity = get_jwt_identity()
#     if not identity['phone_number']:
#         identity['phone_number'] = '111-111-1111'
#     response = set_cookies(identity['email'], identity['username'],
#                            identity['role'], identity['f_name'], identity['l_name'], identity['phone_number'])
    return 201


# deprecated
@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    refresh_user = get_jwt_identity()
    return jsonify(logged_in_as=refresh_user), 200


@app.route('/api/products', methods=['POST', 'GET'])
@jwt_required()
def get_products():
    # TODO: add error checking and return
    json_data = request.json
    if json_data:
        op_id = json_data.get('id')
        op = json_data.get('op')
        user_id = get_jwt_identity()
        if op != "list":
            if user_id['role'] == 'admin':
                session = db.session
                operation_product = session.get(Product, op_id)
                if operation_product:
                    if op == 'del':
                        session.delete(operation_product)
                        session.commit()
                        return jsonify({"message": "Product Deleted"}), 200
            else:
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


@app.route('/api/listproducts', methods=[ 'GET'])
def list_products():
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


@app.route('/api/cart', methods=['POST'])
@jwt_required()
def cart():
    username = get_jwt_identity()
    uname = username['username']
    user = User.query.filter_by(username=uname).first()
    if not user:
        return "User not found", 404
    if not request.json:
        cart_items = get_from_cart(user.id)
        print(jsonify(cart_items))
        return jsonify(cart_items), 201
    elif request.json:
        if request.json['op'] == "add":
            product_id = request.json['product']
            qty = request.json.get('quantity', 1)  # Default quantity is 1 if not provided
            add_to_cart(user.id, product_id, qty)

            return 'Item added to cart successfully', 201
        elif request.json['op'] == 'del':
            product_id = request.json['product']
            qty = request.json.get('quantity', 1)
            del_from_cart(user.id, product_id, qty)
            return 'Item deleted from cart successfully', 201
        elif request.json['op'] == 'clear':
            username = request.json['userName']
            clear_cart(username)
            return 'Item deleted from cart successfully', 201
        else:
            return jsonify({"message": "Invalid request"}), 401


@app.route('/api/cartitems', methods=['POST'])
def load_cart_items():
    data = request.json
    if data:
        items_list = []
        for ind, item in enumerate(data['items']):
            cart_items = Product.query.filter_by(id=item['product']).first()
            item_dict = {
                    "id": cart_items.id,
                    "name": cart_items.name,
                    "description": cart_items.description,
                    "price": cart_items.price,
                    "img_url": cart_items.img_url,
                    "quantity": data['items'][ind]['quantity'],

                }
            items_list.append(item_dict)
        return jsonify(items_list), 200


@app.route('/api/user')
@jwt_required(locations=['cookies'])
def get_user():
    identity = get_jwt_identity()
    if identity['role'] == 'admin':
        users = User.query.all()
        user_data = [
            {
                "id": user.id,
                "name": user.username,
                "email": user.email,
                "purchases": user.purchases,
                "role": user.role,
                "number": user.phone_number,
                "fullName": user.f_name + " " + user.l_name
            }
            for user in users
        ]
        return jsonify(user_data)
    else:
        return jsonify({"message": "User is not admin"}), 401


@app.route('/api/editproduct', methods=['POST'])
@jwt_required()
def edit_product():
    identity = get_jwt_identity()
    if identity['role'] == 'admin':
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
                    img_url = file_parse(name, file)

            if name and description and price:
                new_product = Product(name=name, description=description, price=price, img_url=img_url)
                db.session.add(new_product)
                db.session.commit()

                for item in stock_items:
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
    else:
        return jsonify({"error": "User is not admin"}), 401


@app.route('/api/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/api/useredit', methods=['POST'])
@jwt_required()
def edit_user():
    raw_data = request.get_data()
    data_string = raw_data.decode('utf-8')
    data_dict = json.loads(data_string)
    operation = data_dict['op']
    operation_id = data_dict['userid']
    user_id = get_jwt_identity()
    if user_id['role'] == 'admin':
        session = db.session
        operation_user = session.get(User, operation_id)
        if operation_user:
            if operation == 'del':
                clear_cart(operation_user.username)
                session.delete(operation_user)
                session.commit()
                return jsonify({"message": "User Deleted"}), 200
            elif operation == 'res':
                new_pass = "password"
                new_pass_hash = generate_password_hash(new_pass, method='pbkdf2:sha256', salt_length=8)
                operation_user.password = new_pass_hash
                session.commit()
                return jsonify({"message": "Password reset for user"}), 200
            elif operation == 'role_up':
                if operation_user != 'admin':
                    operation_user.role = 'admin'
                    session.commit()
                    return jsonify({"message": "User Upgraded"}), 200
                else:
                    return jsonify({"message": "User is already top role"}), 400
            elif operation == 'role_down':
                if operation_user != 'user':
                    operation_user.role = 'user'
                    session.commit()
                    return jsonify({"message": "User downgraded"}), 200
                elif operation == 'upd':
                    return jsonify({"message": "User Updated"}), 200
                else:
                    return jsonify({"message": "User is already bottom role"}), 400
            else:
                return jsonify({"message": "Invalid request"}), 400
        else:

            return jsonify({"message": "User not found"}), 404
    return jsonify({"message": "Unauthorized"}), 401


@app.route('/api/stock_items', methods=['GET'])
def get_stock_items():
    stock_items = StockPart.query.all()
    stock_items_list = [{"id": item.id, "name": item.name} for item in stock_items]
    return jsonify(stock_items_list)


@app.route('/api/editstock', methods=['POST'])
@jwt_required()
def edit_stock():
    identity = get_jwt_identity()
    if identity['role'] == 'admin':
        try:
            data = request.form
            # op = request.get_data()
            name = data.get('name')
            description = data.get('description')
            supplier = data.get('supplier')
            qty = data.get('qty')
            price = data.get('price')
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
    else:
        return jsonify({"error": "Unauthorized"}), 401


from flask import jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import SQLAlchemyError
import asyncio

@app.route('/api/submitorder', methods=['POST'])
@jwt_required()
def submit_order():
    try:
        email = request.form.get('email')
        phone_number = request.form.get('phoneNumber')
        name = request.form.get('firstName') + " " + request.form.get('lastName')
        contact_method = request.form.get('contactMethod')
        requested_date = request.form.get('requestedDate')
        comments = request.form.get('comments')
        cart_items = []
        for i in range(len(request.form) // 6):
            if request.form.get(f'cartItems[{i}][id]') is not None:
                item = {
                    'id': request.form.get(f'cartItems[{i}][id]'),
                    'quantity': request.form.get(f'cartItems[{i}][quantity]'),
                }
                cart_items.append(item)

        total = request.form.get('total')
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({'message': 'User not found', 'status': 'error'}), 404
        if user.phone_number != phone_number:
            user.phone_number = phone_number
            db.session.commit()

        new_order = Order(
            items=str(cart_items),
            status='Pending',
            payment_type=contact_method,
            date_requested=requested_date,
            ordered_by=user.id,
            comments=comments
        )
        db.session.add(new_order)
        db.session.flush()

        try:
            asyncio.run(send_mail(new_order, cart_items, email, new_order.id, name))
        except Exception as e:
            db.session.rollback()
            print(e)
            return jsonify({'message': 'Failed to send email', 'status': 'error'}), 500

        db.session.commit()
        return jsonify({'message': 'Order received', 'status': 'success'}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        print(e)
        return jsonify({'message': 'Failed to process order', 'status': 'error'}), 400



@app.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    identity = get_jwt_identity()
    if identity['role'] == 'admin':
        try:
            orders = Order.query.all()
            orders_list = [
                {
                    "id": order.id,
                    "items": order.items,
                    "status": order.status,
                    "payment_type": order.payment_type,
                    "date_requested": order.date_requested,
                    "comments": order.comments,
                    "ordered_by": order.ordered_by,
                }
                for order in orders
            ]
            print(orders_list)
            return jsonify(orders_list), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Unauthorized"}), 401

@app.route('/api/order/<int:order_id>')
@jwt_required()
def get_order(order_id):
    order = Order.query.get(order_id)
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
            if row.toggle:
                row_dict[row.name] = row.params
        categories = Category.query.all()
        cat_dict = {}
        for category in categories:
            cat_dict[category.name] = [product.id for product in category.products]

        row_dict["categories"] = cat_dict
        return jsonify(row_dict), 200
    return data, 200


@app.route('/api/site/cat', methods=['POST'])
@jwt_required()
def edit_cat():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({"message": "Unauthorized"}), 403

    data = request.json
    if not data or 'categories' not in data:
        return jsonify({"message": "Invalid data"}), 400

    try:
        db.session.execute(product_category_association.delete())
        Category.query.delete()
        db.session.commit()

        for category_name, product_ids in data['categories'].items():
            print(f"Processing category: {category_name} with products: {product_ids}")

            category = Category(name=category_name)
            db.session.add(category)
            db.session.commit()

            for product_id in product_ids:
                product = db.session.get(Product, product_id)
                if product:
                    assoc = product_category_association.insert().values(
                        category_id=category.id,
                        product_id=product.id
                    )
                    db.session.execute(assoc)

        db.session.commit()
        return jsonify({"message": "Save Successful"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"message": "An error occurred"}), 500


@app.route('/api/json/edit', methods=['POST'])
@jwt_required()
def edit_site():
    identity = get_jwt_identity()
    if identity['role'] == 'admin':
        try:
            data = request.form
            op = data.get('op')
            params_json = {}
            if op == "home_products":
                products_str = data.get('products')
                if products_str:
                    params_json = json.loads(products_str)
                    for listing in params_json:
                        to_string = listing['id']
                        listing['id'] = str(to_string)
                else:
                    params_json = []
            else:
                for i in data:
                    if i != 'op':
                        params_json.update({i: data[i]})
            if 'image' in request.files:
                file = request.files['image']
                if file and allowed_file(file.filename):
                    img_url = file_parse(op, file)
                    params_json.update({'img': img_url})
            section = Site.query.filter_by(name=op).first()
            section.params = params_json
            section.uuid = uuid.uuid4()
            db.session.commit()
            return jsonify({"message": "Save Successful"}), 201

        except Exception as e:
            db.session.rollback()  # Rollback transaction in case of error
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Unauthorized"}), 401


@app.route('/api/auth', methods=['GET'])
@jwt_required()
def check_authentication():
    user_id = get_jwt_identity()
    return jsonify({'message': 'Authentication successful', 'username': user_id['username'],
                    'role': user_id['role']}), 200


@app.route('/api/admin')
@jwt_required()
def admin():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify(message='Access denied'), 403
    return jsonify({"message": "Welcome, admin!"}), 200


@app.route('/api/logout', methods=['POST'])
def logout():
    response = make_response(jsonify(message="Logged out"))

    for i in COOKIE_TYPES:
        response.delete_cookie(i)
    return response


@app.route('/<path>')
@app.route('/<path:path>')
def index(path):
    if path.startswith('api') or path.startswith('image') or path.startswith('manifest.json'):
        pass
    else:
        return redirect('/')

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(host='10.10.18.11', port=5012, debug=True)
