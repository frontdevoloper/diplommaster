// == auth.js ==
function getCookie(name) {
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : null;
}

async function secureFetch(url, options = {}) {
  const csrf = getCookie('csrf_access_token');
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {})
    },
    ...options
  });

  const contentType = res.headers.get('Content-Type') || '';
  const data = contentType.includes('application/json')
    ? await res.json().catch(() => ({}))
    : {};

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.error || data.msg || res.statusText
    };
  }
  return data;
}

async function getCurrentUser() {
  try {
    return await secureFetch('/api/me');
  } catch (err) {
    if (err.status === 401) {
      return null;
    }
    console.error('Ошибка получения пользователя:', err.message);
    return null;
  }
}

async function updateUIForAuth() {
  const user = await getCurrentUser();
  const profileBlock = document.getElementById('user-profile');
  const authBtns     = document.getElementById('auth-btns');

  if (user) {
    profileBlock.style.display = 'inline-block';
    authBtns?.classList.add('hidden');
  } else {
    profileBlock.style.display = 'none';
    authBtns?.classList.remove('hidden');
  }
}

// при загрузке страницы
window.addEventListener('DOMContentLoaded', updateUIForAuth);
