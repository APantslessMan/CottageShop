from datetime import datetime, timedelta, timezone

from flask import Flask, request, jsonify, make_response, render_template, send_from_directory, redirect

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship

from werkzeug.utils import secure_filename

from werkzeug.security import generate_password_hash, check_password_hash

from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    create_refresh_token,
    get_jwt_identity
)
import json
# import sys
import logging
import uuid
from dotenv import load_dotenv
# import smtplib # For email
import os

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
    password = db.Column(db.String(250), nullable=False)
    username = db.Column(db.String(250), unique=True, nullable=False)
    purchases = db.Column(db.String(250), nullable=True)
    role = db.Column(db.String(80), nullable=False, default='user')
    orders = db.relationship("Order", back_populates="user")
    cart = db.relationship("Product", secondary="cart_items", back_populates="users",
                           overlaps="user,cart_items,product")


class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(250), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(precision=10, scale=2), nullable=False)
    img_url = db.Column(db.String(250), nullable=True)
    stockparts = db.relationship('StockPart', secondary=product_stock_association, backref='products')
    users = db.relationship("User", secondary="cart_items", back_populates="cart", overlaps="cart_items,user,product")


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


def set_cookies(email, username, role, f_name, l_name):
    access_token = create_access_token(
        identity={'email': email, 'username': username, 'role': role, 'f_name': f_name, 'l_name': l_name})
    refresh_token = create_refresh_token(
        identity={'email': email, 'username': username, 'role': role, 'f_name': f_name, 'l_name': l_name})
    session_token = create_refresh_token(
        identity={'email': email, 'username': username, 'role': role, 'f_name': f_name, 'l_name': l_name})
    response = make_response(jsonify(message="Logged in", role=role, email=email, f_name=l_name, l_name=l_name), 200)
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


###############################################################
#                         API Routes                          #
###############################################################





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
    return send_from_directory('./build/assets/img', path)


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    print(data)
    email = data['email'].lower()
    username = data['username'].lower()
    password = data['password']
    f_name = data['f_name']
    l_name = data['l_name']
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
    response = set_cookies(email, username, role, f_name, l_name)
    return response, 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    loginid = data['login'].lower()
    password = data['password']
    user = User.query.filter((User.email == loginid) | (User.username == loginid)).first()
    if user and check_password_hash(user.password, password):
        response = set_cookies(user.email, user.username, user.role, user.f_name, user.l_name)
        print(response)
        return response
    else:
        return jsonify({"message": "Invalid credentials"}), 401


@app.route('/api/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    response = set_cookies(identity['email'], identity['username'],
                           identity['role'], identity['f_name'], identity['l_name'])
    return response


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
                "role": user.role
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


@app.route('/api/order_submit', methods=['POST'])
@jwt_required()
def submit_order():
    data = request.get_data()
    new_order = Order()


@app.route('/api/order')
@jwt_required()
def get_orders():
    orders = Order.query.all()
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
        return jsonify(row_dict), 200
    return data, 200


@app.route('/api/json/edit', methods=['POST'])
@jwt_required()
def edit_site():
    identity = get_jwt_identity()
    if identity['role'] == 'admin':
        try:

            data = request.form
            op = data.get('op')
            params_json = {}
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
    app.run(host='10.10.18.11', port=5000, debug=True)
