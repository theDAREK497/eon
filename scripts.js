// Функция для загрузки HTML-файла в элемент и возврата Promise
function loadHTML(filePath, elementId) {
    return new Promise((resolve, reject) => {
        const targetElement = document.getElementById(elementId);
        if (!targetElement) {
            console.error(`Элемент с ID "${elementId}" не найден в DOM.`);
            reject(new Error(`Элемент с ID "${elementId}" не найден в DOM.`));
            return;
        }
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки ${filePath}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                targetElement.innerHTML = data;
                resolve();
            })
            .catch(error => {
                console.error(error);
                reject(error);
            });
    });
}

// Функция для установки минимальной высоты main
function setMainMinHeight() {
    const mainElement = document.querySelector('main');
    const headerElement = document.querySelector('header');
    const footerElement = document.querySelector('footer');

    if (mainElement && headerElement && footerElement) {
        const headerHeight = headerElement.offsetHeight;
        const footerHeight = footerElement.offsetHeight;
        const windowHeight = window.innerHeight;
        const minHeight = windowHeight - headerHeight - footerHeight;

        mainElement.style.minHeight = `${minHeight - 39}px`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Определяем, является ли текущая страница главной
    const isHomePage = document.body.classList.contains('home-page');

    // Загрузка header и footer, если это не главная страница
    const loadPromises = [];
    if (!isHomePage) {
        loadPromises.push(loadHTML('../header.html', 'header-placeholder'));
        loadPromises.push(loadHTML('../footer.html', 'footer-placeholder'));
    }

    // Установка минимальной высоты main после загрузки header и footer
    Promise.all(loadPromises)
        .then(() => {
            setMainMinHeight();
            // Обновление минимальной высоты main при изменении размера окна
            window.addEventListener('resize', setMainMinHeight);
        })
        .catch(error => {
            console.error('Ошибка при загрузке header или footer:', error);
        });

    // Инициализация тултипов
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = link.dataset.tooltip || "Нет данных";
            document.body.appendChild(tooltip);
            const rect = link.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.bottom + 5}px`;
        });

        link.addEventListener('mouseleave', () => {
            document.querySelector('.tooltip')?.remove();
        });
    });

    // Логика переключения табов
    const buttons = document.querySelectorAll(".tab-button");
    const contents = document.querySelectorAll(".tab-content");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            contents.forEach(content => content.classList.remove("active"));
            button.classList.add("active");
            const tabId = button.getAttribute("data-tab");
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add("active");
            } else {
                console.warn(`Элемент с ID "${tabId}" не найден.`);
            }
        });
    });

    // Инициализация работы с годами и фильтрами
    const years = document.querySelectorAll(".year");
    const events = document.querySelectorAll(".event");
    const filters = document.querySelectorAll(".filters input");

    if (years.length > 0) {
        years.forEach(year => {
            year.addEventListener("click", () => {
                years.forEach(btn => btn.classList.remove("active"));
                year.classList.add("active");
                const selectedYear = year.dataset.year;
                events.forEach(event => {
                    event.classList.remove("active");
                    if (event.dataset.year === selectedYear) {
                        event.classList.add("active");
                    }
                });
            });
        });

        // Инициализация первого года
        years[0].click();
    }

    // Инициализация фильтров
    function applyFilters() {
        const activeFilters = Array.from(filters)
            .filter(filter => filter.checked)
            .map(filter => filter.dataset.filter);

        events.forEach(event => {
            const eventType = event.dataset.type;
            event.style.display = activeFilters.includes(eventType) ? "block" : "none";
        });
    }

    filters.forEach(filter => {
        filter.addEventListener("change", applyFilters);
    });

    applyFilters();


    // Добавлен код для inner tabs
    const innerButtons = document.querySelectorAll(".inner-tab-button");
    const innerContents = document.querySelectorAll(".inner-tab-content");

    innerButtons.forEach(button => {
        button.addEventListener("click", () => {
            innerButtons.forEach(btn => btn.classList.remove("active"));
            innerContents.forEach(content => content.classList.remove("active"));
            button.classList.add("active");
            const innerTabId = button.dataset.innerTab;
            const innerTargetContent = document.getElementById(innerTabId);
            if (innerTargetContent) {
                innerTargetContent.classList.add("active");
            } else {
                console.warn(`Inner элемент с ID "${innerTabId}" не найден.`);
            }
        });
    });

    // Ссылки на кнопки переключения
    const switchToD = document.getElementById("switch-to-d");
    const switchToG = document.getElementById("switch-to-g");

    // Ссылка на текущий элемент стилей
    const styleLink = document.querySelector('link[rel="stylesheet"]');

    // Функции переключения тем
    function setDarkTheme() {
        if (styleLink) {
            const isHomePage = document.body.classList.contains('home-page');
            if (!isHomePage) {
                styleLink.href = "../stylesD.css"; // Устанавливаем темный стиль
                localStorage.setItem("selectedStyle", "../stylesD.css"); // Сохраняем в локальное хранилище
            } else {
                styleLink.href = "stylesD.css"; // Устанавливаем темный стиль
                localStorage.setItem("selectedStyle", "stylesD.css"); // Сохраняем в локальное хранилище
            }
        }
    }

    function setGreenTheme() {
        if (styleLink) {
            const isHomePage = document.body.classList.contains('home-page');
            if (!isHomePage) {
                styleLink.href = "../stylesG.css"; // Устанавливаем зеленый стиль
                localStorage.setItem("selectedStyle", "../stylesG.css"); // Сохраняем в локальное хранилище
            } else {
                styleLink.href = "stylesG.css"; // Устанавливаем зеленый стиль
                localStorage.setItem("selectedStyle", "stylesG.css"); // Сохраняем в локальное хранилище
            }
        }
    }

    // Восстановление выбранного стиля при загрузке страницы
    const savedStyle = localStorage.getItem("selectedStyle");
    if (savedStyle) {
        styleLink.href = savedStyle;
    }

    // Обработчики кнопок
    switchToD.addEventListener("click", setDarkTheme);
    switchToG.addEventListener("click", setGreenTheme);

});
