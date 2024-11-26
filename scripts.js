document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = link.dataset.tooltip;
        document.body.appendChild(tooltip);
        const rect = link.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.bottom + 5}px`;
    });

    link.addEventListener('mouseleave', () => {
        document.querySelector('.tooltip')?.remove();
    });

    // Логика переключения табов
    const buttons = document.querySelectorAll(".tab-button");
    const contents = document.querySelectorAll(".tab-content");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // Сбрасываем активные состояния
            buttons.forEach(btn => btn.classList.remove("active"));
            contents.forEach(content => content.classList.remove("active"));

            // Активируем текущую вкладку
            button.classList.add("active");
            const tabId = button.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");
        });
    });

    document.addEventListener("DOMContentLoaded", () => {
        const years = document.querySelectorAll(".year");
        const events = document.querySelectorAll(".event");
        const filters = document.querySelectorAll(".filters input");

        // Функция для отображения событий выбранного года
        function showEventsByYear(selectedYear) {
            events.forEach(event => {
                event.classList.remove("active");
                if (event.dataset.year === selectedYear) {
                    event.classList.add("active");
                }
            });
        }

        // Обновление фильтров
        function applyFilters() {
            const activeFilters = Array.from(filters)
                .filter(filter => filter.checked)
                .map(filter => filter.dataset.filter);

            events.forEach(event => {
                const eventType = event.dataset.type;
                if (activeFilters.includes(eventType)) {
                    event.style.display = "block";
                } else {
                    event.style.display = "none";
                }
            });
        }

        // Клик на год
        years.forEach(year => {
            year.addEventListener("click", () => {
                years.forEach(btn => btn.classList.remove("active"));
                year.classList.add("active");
                showEventsByYear(year.dataset.year);
            });
        });

        // Изменение фильтров
        filters.forEach(filter => {
            filter.addEventListener("change", applyFilters);
        });

        // Инициализация
        years[0].click();
        applyFilters();
    });

});
