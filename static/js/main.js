// Показать/скрыть кнопку "Наверх"
window.addEventListener('scroll', function () {
    var backToTop = document.getElementById('back-to-top');
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateUIForAuth();
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Анимация при скролле
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .feature-item, .testimonial-card');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementPosition < windowHeight - elementVisible) {
            element.classList.add('animate__animated', 'animate__fadeInUp');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Мобильное меню
const mobileMenuButton = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.createElement('div');
mobileMenu.className = 'mobile-menu';
mobileMenu.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--white);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        `;

mobileMenu.innerHTML = `
            <button class="close-menu" style="
                position: absolute;
                top: 25px;
                right: 25px;
                background: none;
                border: none;
                font-size: 24px;
                color: var(--gray-600);
                cursor: pointer;
            ">
                <i class="fas fa-times"></i>
            </button>
            <nav style="display: flex; flex-direction: column; align-items: center; gap: 25px;">
                <a href="#" style="font-size: 22px; color: var(--gray-800); text-decoration: none; font-weight: 500;">Главная</a>
                <a href="#" style="font-size: 22px; color: var(--gray-800); text-decoration: none; font-weight: 500;">Услуги</a>
                <a href="#" style="font-size: 22px; color: var(--gray-800); text-decoration: none; font-weight: 500;">Цены</a>
                <a href="#" style="font-size: 22px; color: var(--gray-800); text-decoration: none; font-weight: 500;">Отзывы</a>
                <a href="#" style="font-size: 22px; color: var(--gray-800); text-decoration: none; font-weight: 500;">Контакты</a>
                <div style="display: flex; gap: 15px; margin-top: 30px;">
                    <a href="#" style="
                        padding: 10px 25px;
                        border: 1px solid var(--primary);
                        border-radius: 50px;
                        color: var(--primary);
                        text-decoration: none;
                        font-weight: 500;
                    ">Вход</a>
                    <a href="#" style="
                        padding: 10px 25px;
                        background: var(--primary);
                        border-radius: 50px;
                        color: var(--white);
                        text-decoration: none;
                        font-weight: 500;
                    ">Регистрация</a>
                </div>
            </nav>
        `;

document.body.appendChild(mobileMenu);

mobileMenuButton.addEventListener('click', function () {
    mobileMenu.style.transform = 'translateY(0)';
});

mobileMenu.querySelector('.close-menu').addEventListener('click', function () {
    mobileMenu.style.transform = 'translateY(-100%)';
});

document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginClose = document.getElementById('login-close');
    const registerClose = document.getElementById('register-close');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    // Открытие модального окна входа
    loginBtn.addEventListener('click', function (e) {
        e.preventDefault();
        document.documentElement.classList.add('modal-open');
        loginModal.classList.add('active');
    });

    // Открытие модального окна регистрации
    registerBtn.addEventListener('click', function (e) {
        e.preventDefault();
        document.documentElement.classList.add('modal-open');
        registerModal.classList.add('active');
    });

    // Закрытие модального окна входа
    loginClose.addEventListener('click', function () {
        document.documentElement.classList.remove('modal-open');
        loginModal.classList.remove('active');
    });

    // Закрытие модального окна регистрации
    registerClose.addEventListener('click', function () {
        document.documentElement.classList.remove('modal-open');
        registerModal.classList.remove('active');
    });

    // Переключение на форму регистрации
    switchToRegister.addEventListener('click', function (e) {
        e.preventDefault();
        loginModal.classList.remove('active');
        registerModal.classList.add('active');
    });

    // Переключение на форму входа
    switchToLogin.addEventListener('click', function (e) {
        e.preventDefault();
        registerModal.classList.remove('active');
        loginModal.classList.add('active');
    });

    // Закрытие модальных окон при клике вне их области
    window.addEventListener('click', function (e) {
        if (e.target === loginModal) {
            document.documentElement.classList.remove('modal-open');
            loginModal.classList.remove('active');
        }
        if (e.target === registerModal) {
            document.documentElement.classList.remove('modal-open');
            registerModal.classList.remove('active');
        }
    });

    // Обработка форм
    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        try {
            // ждём, пока сервис поставит куку в браузер
            await secureFetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // теперь кука уж точно есть — можем получить /api/me
            await updateUIForAuth();

            document.documentElement.classList.remove('modal-open');
            loginModal.classList.remove('active');
            showToast('success', 'Успешно', 'Вы вошли в систему!');
        } catch (err) {
            showToast('error', 'Ошибка', `Не удалось войти: ${err.message || err}`);
        }
    });    
});


document.getElementById('register-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const full_name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    if (password !== confirm) {
        showToast('error', 'Ошибка', 'Пароли не совпадают')
        return;
    }

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            showToast('success', 'Успешно', 'Вы успешно зарегестрировались в системе!');
            updateUIForAuth();
            document.documentElement.classList.remove('modal-open');
            registerModal.classList.remove('active');
        } else {
            showToast('error', 'Ошибка', `Не удалось зарегестрироваться, ошибка: ${data.error || "Ошибка регистрации"}`)
        }
    } catch (err) {
        console.error(err);
        showToast('error', 'Ошибка', `Не удалось зарегестрироваться, ошибка подключения`)
    }
});


document.getElementById('logout-btn')?.addEventListener('click', async () => {
    try {
        await secureFetch('/api/logout', {
            method: 'POST'
        });

        updateUIForAuth();

        showToast('success', 'Готово', 'Вы успешно вышли из системы!')
    } catch (err) {
        alert('Ошибка выхода: ' + err.message);
    }
});

function getCookie(name) {
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([$?*|{}()\]\\[\]\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}