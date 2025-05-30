# 🎓 DiplomMaster — Web-платформа для заказов студенческих и IT-услуг

Flask-приложение с публичной страницей, личным кабинетом и админкой. Поддерживает авторизацию через JWT, управление услугами, отзывами и настройками сайта.

---

## 🔧 Установка и запуск

1. Клонируй репозиторий:

```bash
git clone https://github.com/frontdevoloper/diplommaster.git
cd diplommaster
```
2. Создай виртуальное окружение:

```bash
python -m venv venv
source venv/bin/activate     # или venv\Scripts\activate для Windows
```

3. Установи зависимости:

```bash
pip install -r requirements.txt
```

4. Запусти приложение:

```bash
python app.py
```
## 📦 Миграции базы данных с Alembic

В проекте используется [Alembic](https://alembic.sqlalchemy.org/) для управления миграциями базы данных.

### 📌 Установка

Убедитесь, что установлен `alembic`:

```bash
pip install alembic
```
1. ⚙️ Инициализация (один раз)

```bash
alembic init migrations
```

Это создаст директорию migrations/ и конфигурационный файл alembic.ini.

2. В alembic.ini пропиши строку подключения к БД:

```bash
sqlalchemy.url = sqlite:///db.sqlite3
```

3. В migrations/env.py найди блок:

```bash
from myapp import db  # исправь на путь до твоего app.py
target_metadata = db.metadata
```

4. Пример:
```bash
from app import db
target_metadata = db.metadata
```bash

5. 📤 Создание миграции
```bash
alembic revision --autogenerate -m "Добавил поле is_admin"
```

6. 🚀 Применение миграции

```bash
alembic upgrade head
```
 
## 📦 Зависимости

- Python 3.10+

- Flask

- Flask-JWT-Extended

- Flask-SQLAlchemy

- bcrypt

- Jinja2

## 🔐 Авторизация

- При регистрации/логине выдаётся access_token в HttpOnly cookie.

- Поддерживается флаг "Запомнить меня".

- Защита админки по роли is_admin.

## 🛠 Функционал

- ✅ Регистрация и логин с куками

- ✅ Админка с разделами (услуги, отзывы, hero-секция и пр.)

- ✅ Добавление и редактирование услуг без перезагрузки

- ✅ Удаление услуг

- ✅ Сохранение активной вкладки при перезагрузке

- ✅ Валидация форм, toast-уведомления

# 👨‍💻 Автор

@frontdevoloper