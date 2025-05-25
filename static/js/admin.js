// Toggle sidebar
document.getElementById('toggle-sidebar').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('active');
});

function loadTab(tabName) {   
    const container = document.getElementById('tab-container');
    container.innerHTML = '<div class="tab-loader">Загрузка...</div>';

    fetch(`/admin/tab/${tabName}`)
        .then(res => {
            if (!res.ok) throw new Error('Ошибка загрузки вкладки');
            return res.text();
        })
        .then(html => {            
            container.innerHTML = html;
            const loadedContent = container.querySelector('.tab-content');
            if (loadedContent) {
                loadedContent.classList.add('active');
            }

            if (tabName === 'services') {
                initAutoSaveServices();
                openAddServiceModal()
                initDeleteButtons();
            } 
        })
        .catch(err => {
            container.innerHTML = `<div class="tab-error">Ошибка: ${err.message}</div>`;
        });
}

// Переключение табов
document.querySelectorAll('.menu-link[data-tab]').forEach(tab => {
    tab.addEventListener('click', e => {
        e.preventDefault(); // чтобы не прыгал
        const tabName = tab.dataset.tab;
        
        localStorage.setItem('activeTab', tabName);
        
        document.querySelectorAll('.menu-link').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        loadTab(tabName);      
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const savedTab = localStorage.getItem('activeTab');
    const tabToLoad = savedTab || document.querySelector('.menu-link.active')?.dataset.tab;

    if (tabToLoad) {
        // Устанавливаем active класс на нужный таб
        document.querySelectorAll('.menu-link').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tabToLoad);
        });

        loadTab(tabToLoad);
    } else {
        console.warn('❗ Не найдена активная вкладка или сохранённый таб');
    }
});

// По умолчанию загружаем первую вкладку
// window.addEventListener('DOMContentLoaded', () => {
//     const firstTab = document.querySelector('.menu-link.active');
//     if (firstTab && firstTab.dataset.tab) {
//         loadTab(firstTab.dataset.tab);
//     } else {
//         console.warn('❗ Не найдена активная вкладка или data-tab');
//     }
// });


const uploadButtons = document.querySelectorAll('.upload-btn');
uploadButtons.forEach(button => {
    button.addEventListener('click', function () {
        // In a real app, this would open a file dialog
        // For this example, we'll just simulate it
        const preview = this.closest('.image-upload').querySelector('.image-preview');
        preview.innerHTML = '<img src="https://via.placeholder.com/300" alt="Preview">';
    });
});



// Responsive adjustments
function handleResize() {
    if (window.innerWidth > 992) {
        document.getElementById('sidebar').classList.remove('active');
    }
}

window.addEventListener('resize', handleResize);
handleResize();

function openAddServiceModal() {
    const modal = document.getElementById('service-modal');
    const openBtn = document.querySelector('.card-editor .card-item:last-child');
    const closeBtn = document.getElementById('modal-close');
    const saveBtn = document.getElementById('save-service-btn');

    if (!modal || !openBtn || !closeBtn || !saveBtn) {
        console.warn('⚠️ Элементы модального окна не найдены');
        return;
    }

    // Открытие модалки
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    // Закрытие модалки
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Один раз подписываем обработчик
    if (!saveBtn.dataset.bound) {
        saveBtn.addEventListener('click', () => addService(modal));
        saveBtn.dataset.bound = 'true';
    }
}

async function addService(modal) {
    const form = document.getElementById('service-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        const empty = !field.value.trim();
        field.classList.toggle('error', empty);
        if (empty) isValid = false;
    });

    if (!isValid) {
        showToast('error', 'Ошибка', 'Пожалуйста, заполните все обязательные поля');
        return;
    }

    const data = {
        title: form.title.value.trim(),
        description: form.description.value.trim(),
        duration: form.duration.value.trim(),
        price: form.price.value.replace(/[^0-9]/g, ''),
        advantages: form.advantages.value.trim(),
        category: form.category.value,
        icon: form.icon.value || '',
        color: form.color.value || '#000000',
        button_text: form.button_text.value || 'Подробнее',
        progress: parseInt(form.progress.value || '0', 10),
        status: form.status.checked ? 'active' : 'inactive'
    };

    try {
        await secureFetch('/admin/api/services/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        showToast('success', 'Успешно', 'Услуга добавлена!');
        modal.classList.remove('active');

        // перезагрузка вкладки
        loadTab('services');
    } catch (err) {
        console.error(err);
        showToast('error', 'Ошибка', err.message || 'Не удалось сохранить услугу');
    }
}

function initAutoSaveServices() {
    const cards = document.querySelectorAll('.card-item');
    
    cards.forEach(card => {
        const id = card.dataset.id;

        const inputs = card.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', async () => {
                const field = input.name;
                let value = input.type === 'checkbox' ? input.checked : input.value;

                // для чисел
                if (input.type === 'number') value = parseInt(value, 10);
                if (input.type === 'color') value = value.toLowerCase();

                try {
                    await secureFetch(`/admin/api/services/${id}`, {
                        method: 'PATCH',
                        body: JSON.stringify({ [field]: value })
                    });
                    showToast('success', 'Сохранено', `Поле «${field}» обновлено`);
                } catch (e) {
                    showToast('error', 'Ошибка', `Не удалось сохранить «${field}»`);
                    console.error(e);
                }
            });
        });
    });
}

function initDeleteButtons() {
    document.querySelectorAll('.delete-service-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;

            if (!confirm('Вы уверены, что хотите удалить услугу?')) return;

            try {
                await secureFetch(`/admin/api/services/${id}`, {
                    method: 'DELETE'
                });

                showToast('success', 'Удалено', 'Услуга успешно удалена');

                // Удалим DOM-элемент карточки
                btn.closest('.card-item').remove();

            } catch (err) {
                console.error(err);
                showToast('error', 'Ошибка', err.message || 'Не удалось удалить услугу');
            }
        });
    });
}


function openModal(modal) {    
    modal.classList.add('active');
}

function closeModal(modal) {    
    modal.classList.remove('active');
}
