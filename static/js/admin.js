// Toggle sidebar
document.getElementById('toggle-sidebar').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('active');
});

// Tab switching
const menuLinks = document.querySelectorAll('.menu-link');
menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove active class from all links and tabs
        menuLinks.forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

        // Add active class to clicked link
        this.classList.add('active');

        // Show corresponding tab
        const tabId = this.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// Service tabs switching
const serviceTabs = document.querySelectorAll('[data-service-tab]');
if (serviceTabs.length > 0) {
    serviceTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active class from all tabs
            serviceTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Here you would typically load the corresponding content
            // For this example, we're just showing a placeholder
        });
    });
}

// Image upload preview
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