// Показать/скрыть кнопку "Наверх"
window.addEventListener('scroll', function () {
    var backToTop = document.getElementById('back-to-top');
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
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