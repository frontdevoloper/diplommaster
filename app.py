from flask import Flask, render_template, request, jsonify
from models import db, Order, Service, service_to_dict

app = Flask(__name__)

# === Configuration ===
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# === Create database and seed example data ===
with app.app_context():
    db.create_all()    

# === Admin Routes ===
@app.route('/admin')
def admin():
    return render_template('admin/index.html')

@app.route('/admin/services')
def admin_services():
    services = Service.query.all()
    return render_template('admin/services.html', services=services)

# === API: Create service ===
@app.route('/admin/api/services/create', methods=['POST'])
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
def api_delete_service(id):
    service = Service.query.get_or_404(id)
    db.session.delete(service)
    db.session.commit()
    return jsonify({'success': True})

# === API: Get one service ===
@app.route('/admin/api/services/<int:id>')
def api_get_service(id):
    service = Service.query.get_or_404(id)
    return jsonify(service_to_dict(service))

# === Client Pages ===
@app.route('/')
def index():
    services = Service.query.all()
    return render_template('index.html', services=services)

@app.route('/services')
def services():
    services = Service.query.all()
    return render_template('services.html', services=services)

if __name__ == '__main__':
    app.run(debug=True)
