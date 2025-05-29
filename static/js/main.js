// Кастомный курсор
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 300, fill: 'forwards' });
});

// Эффект при наведении на интерактивные элементы
const interactiveElements = document.querySelectorAll('a, button, .feature-card, .stat-item, .nav-link, .service-card, .faq-question');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.borderColor = 'var(--primary)';
    });

    element.addEventListener('mouseleave', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.borderColor = 'var(--primary)';
    });
});

// Фиксированный хедер при скролле
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Плавный скролл для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Мобильное меню
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileMenuBtn.innerHTML = nav.classList.contains('active') ?
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Анимация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.feature-card, .stat-item, .testimonial-card');

    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});

// Инициализация слайдера отзывов
$(document).ready(function () {
    $('.testimonials-slider').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    centerMode: false,
                    variableWidth: false
                }
            }
        ]
    });
});

// Управление выпадающим меню профиля
const userAvatar = document.getElementById('userAvatar');
const userProfile = document.querySelector('.user-profile');

userAvatar.addEventListener('click', (e) => {
    e.stopPropagation();
    userProfile.classList.toggle('active');
});

// Закрытие меню при клике вне его
document.addEventListener('click', (e) => {
    if (!userProfile.contains(e.target)) {
        userProfile.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateUIForAuth();
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
        const remember = document.getElementById('remember-me').checked;

        try {
            // ждём, пока сервис поставит куку в браузер
            await secureFetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, remember })
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
        await secureFetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ full_name, email, password })
        });
        document.documentElement.classList.remove('modal-open');
        document.getElementById('register-modal').classList.remove('active');
        showToast('success', 'Успешно', 'Вы успешно зарегистрировались!');
        await updateUIForAuth();
    } catch (err) {
        console.log(err)
        showToast('error', 'Ошибка', `Не удалось зарегистрироваться: ${err.message || err}`);
    }
});


document.getElementById('logout-btn')?.addEventListener('click', async () => {
    try {
        await secureFetch('/api/logout', {
            method: 'POST'
        });

        await updateUIForAuth();

        showToast('success', 'Готово', 'Вы успешно вышли из системы!')
    } catch (err) {
        alert('Ошибка выхода: ' + err.message);
    }
});

// Анимация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.profile-sidebar, .profile-section', '.service-card', '.process-step', '.guarantee-card');

    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 150 * index);
    });
});

// Параллакс эффект для фона
const parallaxElements = document.querySelectorAll('.hero, .services, .process, .guarantees, .faq');

window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;

    parallaxElements.forEach(element => {
        const elementPosition = element.offsetTop;
        const elementHeight = element.offsetHeight;

        if (scrollPosition > elementPosition - window.innerHeight &&
            scrollPosition < elementPosition + elementHeight) {
            const speed = element.dataset.speed || 0.2;
            const yPos = -(scrollPosition - elementPosition) * speed;

            if (element.querySelector('.parallax-bg')) {
                element.querySelector('.parallax-bg').style.transform = `translateY(${yPos}px)`;
            }
        }
    });
});

// Аккордеон FAQ
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');

        question.classList.toggle('active');

        if (question.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = '0';
        }
    });
});

