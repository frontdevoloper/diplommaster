// Toggle sidebar
document.getElementById('toggle-sidebar').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('active');
});

// Show modal when Add Service button is clicked
document.getElementById('add-service-btn').addEventListener('click', function () {
    document.getElementById('service-modal').classList.add('active');
});

// Close modal
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('cancel-btn').addEventListener('click', closeModal);

function closeModal() {
    document.getElementById('service-modal').classList.remove('active');
}

// Close modal when clicking outside of it
document.getElementById('service-modal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});

// Handle edit buttons
document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', function () {
        // In a real app, you would fetch the service data here
        document.getElementById('service-modal').classList.add('active');
        document.querySelector('.modal-title').textContent = 'Редактировать услугу';
    });
});

// Handle delete buttons
document.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', function () {
        if (confirm('Вы точно хотите удалить эту услугу?')) {
            // In a real app, you would send a delete request here
            const row = this.closest('tr');
            row.style.opacity = '0';
            setTimeout(() => {
                row.remove();
            }, 300);
        }
    });
});