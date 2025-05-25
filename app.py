import os
from functools import wraps
from flask import Flask, render_template, request, jsonify, url_for, redirect
from models import db, Order, Service, User, service_to_dict
from extensions import db, bcrypt, jwt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,set_access_cookies, unset_jwt_cookies, verify_jwt_in_request, get_jwt
from flask import make_response


app = Flask(__name__)


# === Configuration ===
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'my-very-secret-key-123'
app.config['SECRET_KEY'] = 'my-very-secret-key-123'
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_NAME']   = 'access_token_cookie'
app.config['JWT_COOKIE_SECURE'] = False  # True в проде (https)
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_CSRF_IN_COOKIES'] = True
app.config['JWT_CSRF_METHODS'] = ["PUT", "PATCH", "DELETE"]
app.config['JWT_ACCESS_CSRF_HEADER_NAME'] = "X-CSRF-TOKEN"

print("JWT_SECRET_KEY:", app.config['JWT_SECRET_KEY'])

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# === Create database and seed example data ===
with app.app_context():
    db.create_all()    

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # проверяем, что пришёл валидный JWT из куки
        verify_jwt_in_request()
        claims = get_jwt()
        if not claims.get('is_admin', False):
            # не админ — перенаправляем или 403
            return redirect(url_for('index')), 302
        return fn(*args, **kwargs)
    return wrapper

# === Admin Routes ===
@app.route('/admin')
@admin_required
def admin():
    return render_template('admin/index.html')

@app.route("/admin/tab/<tab>")
@admin_required
def admin_tab(tab):
    allowed_tabs = ['dashboard', 'hero', 'services', 'reviews', 'settings']
    if tab not in allowed_tabs:
        return "Вкладка не найдена", 404
    
    if tab == 'services': 
        from models import Service
        services = Service.query.order_by(Service.order).all()
        return render_template('admin/tabs/services.html', services=services)
    
    return render_template(f"admin/tabs/{tab}.html")

@app.route('/admin/services')
@admin_required
def admin_services():
    services = Service.query.all()
    return render_template('admin/services.html', services=services)

# === API: Create service ===
@app.route('/admin/api/services/create', methods=['POST'])
@admin_required
def api_create_service():
    data = request.json
    service = Service(
        title=data['title'],
        description=data['description'],
        duration=data['duration'],
        price=float(data['price']),
        advantages=data.get('advantages', ''),
        category=data.get('category', ''),
        icon=data.get('icon', ''),
        status=data.get('status', 'active'),
        order=int(data.get('order', 1))
    )
    db.session.add(service)
    db.session.commit()
    return jsonify(service_to_dict(service))

# === API: Update service ===
@app.route('/admin/api/services/<int:id>', methods=['PUT'])
@admin_required
def api_update_service(id):
    service = Service.query.get_or_404(id)
    data = request.json

    service.title = data['title']
    service.description = data['description']
    service.duration = data['duration']
    service.price = float(data['price'])
    service.advantages = data.get('advantages', '')
    service.category = data.get('category', '')
    service.icon = data.get('icon', '')
    service.status = data.get('status', 'active')
    service.order = int(data.get('order', 1))

    db.session.commit()
    return jsonify(service_to_dict(service))

# === API: Delete service ===
@app.route('/admin/api/services/<int:id>', methods=['DELETE'])
@admin_required
def api_delete_service(id):
    service = Service.query.get_or_404(id)
    db.session.delete(service)
    db.session.commit()
    return jsonify({'success': True})

# === API: Get one service ===
@app.route('/admin/api/services/<int:id>')
@admin_required
def api_get_service(id):
    service = Service.query.get_or_404(id)
    return jsonify(service_to_dict(service))

# === Client Pages ===
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')

    if not email or not password or not full_name:
        return jsonify({'error': 'Заполните все поля'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Пользователь уже существует'}), 409

    user = User(email=email, full_name=full_name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    response = make_response(jsonify({'user': user.to_dict()}))
    set_access_cookies(response, token)
    return response

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Неверные данные'}), 401

    additional_claims = {"is_admin": user.is_admin}
    token = create_access_token(identity=str(user.id), additional_claims=additional_claims)

    response = make_response(jsonify({'user': user.to_dict()}))
    set_access_cookies(response, token)
    return response

@app.route('/api/logout', methods=['POST'])
def logout():
    response = jsonify({"msg": "Вы вышли из аккаунта"})
    unset_jwt_cookies(response)  # Удалит access и csrf куки
    return response

@app.route('/')
def index():
    services = Service.query.all()
    return render_template('index.html', services=services)

@app.route('/api/me')
@jwt_required()
def profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@app.route('/services')
def services():
    services = Service.query.all()
    return render_template('services.html', services=services)

if __name__ == '__main__':
    app.run(debug=True)
