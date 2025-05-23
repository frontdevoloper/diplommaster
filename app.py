from flask import Flask, render_template, request, redirect, url_for
from models import db, Order, Service

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    if not Service.query.first():
        s1 = Service(
            title="Написание дипломной работы",
            description="Подробный анализ выбранной темы, оформление по ГОСТ.",
            duration="7-14 дней",
            price=14900,
            advantages="Гарантия оригинальности;Поддержка до защиты;Бесплатные правки"
        )
        s2 = Service(
            title="Разработка сайта под ключ",
            description="Современный адаптивный сайт с админкой.",
            duration="10-20 дней",
            price=30000,
            advantages="Уникальный дизайн;Адаптивность;SEO-оптимизация"
        )
        db.session.add_all([s1, s2])
        db.session.commit()


@app.route('/admin')
def admin():
    return render_template('admin/index.html')


@app.route('/admin/services')
def admin_services():
    services = Service.query.all()
    return render_template('admin/services.html', services=services)


@app.route('/admin/services/add', methods=['GET', 'POST'])
def add_service():
    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']
        duration = request.form['duration']
        price = request.form['price']
        advantages = request.form['advantages']
        new_service = Service(
            title=title,
            description=description,
            duration=duration,
            price=price,
            advantages=advantages
        )
        db.session.add(new_service)
        db.session.commit()
        return redirect(url_for('admin_services'))
    return render_template('admin/services.html')


@app.route('/admin/services/edit/<int:id>', methods=['GET', 'POST'])
def edit_service(id):
    service = Service.query.get_or_404(id)
    if request.method == 'POST':
        service.title = request.form['title']
        service.description = request.form['description']
        service.duration = request.form['duration']
        service.price = request.form['price']
        service.advantages = request.form['advantages']
        db.session.commit()
        return redirect(url_for('admin_services'))
    return render_template('admin/services.html', service=service)


@app.route('/admin/services/delete/<int:id>')
def delete_service(id):
    service = Service.query.get_or_404(id)
    db.session.delete(service)
    db.session.commit()
    return redirect(url_for('admin_services'))


@app.route('/')
def index():
    services_list = Service.query.all()
    return render_template('index.html', services=services_list)


@app.route('/services')
def services():
    services_list = Service.query.all()
    return render_template('services.html', services=services_list)


if __name__ == '__main__':
    app.run(debug=True)
