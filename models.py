from sqlalchemy.orm import relationship
from datetime import datetime
from extensions import db, bcrypt, jwt


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    full_name = db.Column(db.String(150), nullable=False)
    avatar = db.Column(db.String(255), default='default.png')

    is_admin = db.Column(db.Boolean, default=False)

    settings = db.Column(db.JSON, default={})  # JSON поле для пользовательских настроек

    # связи
    orders = relationship('Order', backref='user', lazy=True)
    reviews = relationship('Review', backref='user', lazy=True)
    messages = relationship('ChatMessage', backref='user', lazy=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def check_password(self, password_plain):
        return bcrypt.check_password_hash(self.password_hash, password_plain)

    def set_password(self, password_plain):
        self.password_hash = bcrypt.generate_password_hash(password_plain).decode('utf-8')

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'avatar': self.avatar,
            'is_admin': self.is_admin
        }

    def __repr__(self):
        return f"<User {self.email}>"

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=True)

    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    is_from_admin = db.Column(db.Boolean, default=False)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)

    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
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

class Test(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))


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