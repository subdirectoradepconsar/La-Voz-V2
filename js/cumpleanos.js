document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#birthday-search');
    const filterButtons = [...document.querySelectorAll('.filter-pill')];
    const cards = [...document.querySelectorAll('.birthday-card')];
    const count = document.querySelector('#birthday-count');
    const emptyState = document.querySelector('#birthday-empty');
    let activeArea = 'todos';

    const normalize = (value) => value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('es-MX')
        .trim();

    const applyFilters = () => {
        const query = normalize(searchInput?.value || '');
        let visibleCards = 0;

        cards.forEach((card) => {
            const matchesArea = activeArea === 'todos' || card.dataset.area === activeArea;
            const searchableText = normalize(`${card.dataset.name} ${card.querySelector('p')?.textContent || ''}`);
            const matchesSearch = !query || searchableText.includes(query);
            const isVisible = matchesArea && matchesSearch;

            card.hidden = !isVisible;
            if (isVisible) visibleCards += 1;
        });

        if (count) count.textContent = String(visibleCards);
        if (emptyState) emptyState.hidden = visibleCards !== 0;
    };

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activeArea = button.dataset.filter || 'todos';

            filterButtons.forEach((item) => {
                const isActive = item === button;
                item.classList.toggle('is-active', isActive);
                item.setAttribute('aria-pressed', String(isActive));
            });

            applyFilters();
        });
    });

    searchInput?.addEventListener('input', applyFilters);

    applyFilters();
});
