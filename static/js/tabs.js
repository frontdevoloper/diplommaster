document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('#profile-tabs a');
    const sections = document.querySelectorAll('.profile-tab-section');

    function activateTab(tabName) {
        sections.forEach(sec => {
            sec.style.display = sec.id === 'tab-' + tabName ? 'block' : 'none';
        });

        links.forEach(link => {
            link.classList.toggle('active', link.dataset.tab === tabName);
        });
    }

    // При загрузке
    const hash = window.location.hash.substring(1) || 'overview';
    activateTab(hash);

    // При клике
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const tab = this.dataset.tab;
            history.pushState(null, '', '#' + tab);
            activateTab(tab);
        });
    });

    // Назад/вперёд
    window.addEventListener('popstate', () => {
        const newHash = window.location.hash.substring(1) || 'overview';
        activateTab(newHash);
    });
});

