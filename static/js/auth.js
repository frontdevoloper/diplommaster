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

    const finalOptions = {
        method: 'GET',
        credentials: 'include',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
            ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {})
        }
    };

    const res = await fetch(url, finalOptions);
    const contentType = res.headers.get('Content-Type');

    let data = {};
    if (contentType && contentType.includes('application/json')) {
        data = await res.json().catch(() => ({}));
    }

    if (!res.ok) {
        throw {
            status: res.status,
            message: data?.msg || data?.error || 'Ошибка запроса'
        };
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

