from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120))
    service_type = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    duration = db.Column(db.String(100))
    price = db.Column(db.Float)
    advantages = db.Column(db.Text)
    category = db.Column(db.String(100))    
    icon = db.Column(db.String(100))          
    status = db.Column(db.String(20))       
    order = db.Column(db.Integer, default=1)


def service_to_dict(service):
    return {
        'id': service.id,
        'title': service.title,
        'description': service.description,
        'duration': service.duration,
        'price': service.price,
        'advantages': service.advantages,
        'category': service.category,
        'icon': service.icon,
        'status': service.status,
        'order': service.order
    }