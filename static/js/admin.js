let editingId = null;

// Боковое меню
const toggleSidebar = document.getElementById('toggle-sidebar');
toggleSidebar?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('active');
    document.querySelector('.main-content')?.classList.toggle('active');
});

// Уведомления
const notificationBtn = document.getElementById('notification-btn');
notificationBtn?.addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('notification-dropdown')?.classList.toggle('active');
});
document.addEventListener('click', e => {
    if (!e.target.closest('.notification')) {
        document.getElementById('notification-dropdown')?.classList.remove('active');
    }
});

// Tabs
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab)?.classList.add('active');
    });
});

// Toast уведомления
function showToast(type, title, message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${icons[type] || 'fa-info-circle'}"></i></div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <div class="toast-close"><i class="fas fa-times"></i></div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
}

// Модалка
const modal = document.getElementById('service-modal');
document.getElementById('add-service-btn')?.addEventListener('click', () => openModal('add'));
document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('cancel-btn')?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

function openModal(mode = 'add') {
    const form = document.getElementById('service-form');    
     if (mode === 'add') {
        editingId = null;
        form.reset();
    }
    form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    document.querySelector('.modal-title').textContent = mode === 'add' ? 'Добавить услугу' : 'Редактировать услугу';
    modal.classList.add('active');
}

function closeModal() {
    editingId = null;
    document.getElementById('service-form').reset();
    modal.classList.remove('active');
}

// Сохранение
const saveBtn = document.getElementById('save-service-btn');
saveBtn?.addEventListener('click', async () => {
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
        title: form.querySelector('[name="title"]').value.trim(),
        description: form.querySelector('[name="description"]').value.trim(),
        duration: form.querySelector('[name="duration"]').value.trim(),
        price: form.querySelector('[name="price"]').value.replace(/[^0-9]/g, ''),
        advantages: form.querySelector('[name="advantages"]').value.trim(),
        category: form.querySelector('[name="category"]')?.value || '',
        icon: form.querySelector('[name="icon"]')?.value || '',
        status: form.querySelector('[name="status"]')?.value || 'active',        
    };

    const isEdit = !!editingId;
    const url = isEdit ? `/admin/api/services/${editingId}` : '/admin/api/services/create';
    const method = isEdit ? 'PUT' : 'POST';

    console.log(url, method)

    try {        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const service = await response.json();
        if (isEdit) updateRow(service);
        else addRow(service);
        showToast('success', 'Успешно', isEdit ? 'Услуга обновлена' : 'Услуга добавлена');
        closeModal();
    } catch (e) {
        console.error(e);
        showToast('error', 'Ошибка', 'Не удалось сохранить услугу');
    }
});

function openEditModal(id) {
    fetch(`/admin/api/services/${id}`)
        .then(res => res.json())
        .then(service => {
            const form = document.getElementById('service-form');
            form.querySelector('[name="title"]').value = service.title;
            form.querySelector('[name="description"]').value = service.description;
            form.querySelector('[name="duration"]').value = service.duration;
            form.querySelector('[name="price"]').value = service.price;
            form.querySelector('[name="advantages"]').value = service.advantages;
            form.querySelector('[name="category"]').value = service.category || '';
            form.querySelector('[name="icon"]').value = service.icon || '';
            form.querySelector('[name="status"]').value = service.status || 'active';            
            editingId = id;
            openModal('edit');
        });
}

function updateRow(service) {
    const row = document.querySelector(`tr[data-id="${service.id}"]`);
    if (row) {
        row.innerHTML = `
            <td>${service.title}</td>
            <td>${service.description}</td>
            <td>${service.duration}</td>
            <td>${service.price} ₽</td>
            <td><span class="status ${service.status}">
                ${service.status === 'active' ? 'Активна' : 'Неактивна'}
            </span></td>
            <td class="actions">
                <button class="action-btn edit" data-id="${service.id}" title="Редактировать"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" data-id="${service.id}" title="Удалить"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;

        
        row.querySelector('.action-btn.edit').addEventListener('click', () => openEditModal(service.id));
        row.querySelector('.action-btn.delete').addEventListener('click', () => deleteService(service.id, row));
    }
}

function addRow(service) {
    const tbody = document.querySelector('.services-table tbody');
    const row = document.createElement('tr');
    row.dataset.id = service.id;
    row.innerHTML = `
        <td>${service.title}</td>
        <td>${service.description}</td>
        <td>${service.duration}</td>
        <td>${service.price} ₽</td>
        <td><span class="status ${service.status}">${service.status === 'active' ? 'Активна' : 'Неактивна'}</span></td>
        <td class="actions">
            <button class="action-btn edit" data-id="${service.id}" title="Редактировать"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete" data-id="${service.id}" title="Удалить"><i class="fas fa-trash-alt"></i></button>
        </td>
    `;
    tbody.prepend(row);
    row.querySelector('.action-btn.edit').addEventListener('click', () => openEditModal(service.id));
    row.querySelector('.action-btn.delete').addEventListener('click', () => deleteService(service.id, row));
}

function deleteService(id, row) {
    if (!confirm('Удалить услугу?')) return;
    fetch(`/admin/api/services/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                row.remove();
                showToast('success', 'Успешно', 'Услуга удалена');
            }
        });
}

function attachInitialHandlers() {
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        const id = btn.closest('tr')?.dataset.id;
        if (id) btn.addEventListener('click', () => openEditModal(id));
    });
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        const row = btn.closest('tr');
        const id = btn.dataset.id;
        if (row && id) btn.addEventListener('click', () => deleteService(id, row));
    });
}

attachInitialHandlers();
