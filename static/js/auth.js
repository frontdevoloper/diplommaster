// Получение cookie по имени
function getCookie(name) {
    const match = document.cookie.match(
        new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? decodeURIComponent(match[2]) : null;
}

// Обёртка над fetch с автоматической CSRF-защитой
async function secureFetch(url, options = {}) {
    const csrf = getCookie('csrf_access_token');

    const res = await fetch(url, {
        credentials: 'include',               // вот это главное
        headers: {
            'Content-Type': 'application/json',
            ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {})
        },
        ...options                            // сюда приходит ваш method и body
    });
    
    const contentType = res.headers.get('Content-Type') || '';
    const data = contentType.includes('application/json')
        ? await res.json().catch(() => ({}))
        : {};

    if (!res.ok) {
        throw { status: res.status, message: data.error || data.msg || res.statusText };
    }
    return data;
}


async function getCurrentUser() {
    try {
        return await secureFetch('/api/me');
    } catch (err) {
        if (err.status === 401) return null; // не авторизован — это не ошибка
        console.error('Ошибка получения пользователя:', err.message);
        return null;
    }
}

async function updateUIForAuth() {
    const user = await getCurrentUser();

    const profileBlock = document.getElementById('user-profile');
    const authBtns = document.getElementById('auth-btns');

    if (user) {
        // Пользователь авторизован        
        profileBlock.style.display = 'inline-block';

        authBtns?.classList.add('hidden');
    } else {
        // Не авторизован
        profileBlock.style.display = 'none';
        authBtns?.classList.remove('hidden');
    }
}

