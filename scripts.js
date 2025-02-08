//===========================================================================

// Логин и хэш пароля для авторизации
const AUTH_USERNAME = "BlackHeart_2012";
const AUTH_PASSWORD_HASH = "28501c291a962f38df52e6688d3ab82f153161ef4319eb3ea74f6ab926719e59"; // Хэш для пароля "password"

// Соль для усиления безопасности
const SALT = "exo";

// Функция для хэширования пароля с использованием SHA-256
function hashPassword(password) {
    return CryptoJS.SHA256(password + SALT).toString(CryptoJS.enc.Hex);
}

// Функция для проверки авторизации
function checkAuth() {
    const authCookie = getCookie("auth");
    if (!authCookie) {
        // Если куки нет, перенаправляем на страницу авторизации
        if (window.location.pathname !== "/eon/auth.html") {
            window.location.href = "/eon/auth.html";
        }
    }
}

// Функция для обработки формы авторизации
function handleAuthFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Хэшируем введённый пароль
    var hashedPassword = hashPassword(password);

    // Сравниваем логин и хэш пароля
    if (username === AUTH_USERNAME && hashedPassword === AUTH_PASSWORD_HASH) {
        setCookie("auth", "true", 365); // Устанавливаем куки на год
        window.location.href = "/eon/index.html"; // Перенаправляем на главную страницу
    } else {
        alert("Неверный логин или пароль");
    }
}

// Инициализация формы авторизации
function initAuthForm() {
    const authForm = document.getElementById("auth-form");
    if (authForm) {
        authForm.addEventListener("submit", handleAuthFormSubmit);
    }
}

function showLicensePopup() {
    if (getCookie("licenseAccepted")) return;

    const popup = document.getElementById("license-popup");
    const textBlock = document.getElementById("popup-text");
    const agreeButton = document.getElementById("agree-button");

    popup.style.display = "block";
    textBlock.scrollTop = 0;

    let scrollProgress = 0;
    textBlock.addEventListener("scroll", function () {
        let scrollTop = textBlock.scrollTop;
        let scrollHeight = textBlock.scrollHeight - textBlock.clientHeight;
        scrollProgress = scrollTop / scrollHeight;

        let slowdownFactor = Math.max(1, 10 - scrollProgress * 10);
        textBlock.style.scrollBehavior = `ease-out ${slowdownFactor}s`;

        if (scrollProgress >= 1) {
            agreeButton.classList.add("active");
            agreeButton.disabled = false;
        }
    });

    agreeButton.addEventListener("click", function () {
        setCookie("licenseAccepted", "true", 3650);
        popup.style.display = "none";
    });
}

// Проверка авторизации при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    initAuthForm();

    setDefaultStyle();
    
    try {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    } catch (error) {}
});

//===========================================================================

// Функция для обновления таймера
function updateCountdown() {
    const timerElement = document.getElementById("timer");
    if (!timerElement) {
        return; // Если таймера нет, прекращаем выполнение
    }
    const targetDate = new Date("2025-02-12T00:00:00"); // Дата 12 февраля 2024 года
    const now = new Date(); // Текущая дата и время

    // Разница между целевой датой и текущей датой (в миллисекундах)
    const timeDifference = targetDate - now;

    // Если время вышло, останавливаем таймер
    if (timeDifference <= 0) {
        document.getElementById("timer").innerHTML = "Время вышло!";
        return;
    }

    // Конвертируем разницу в дни, часы, минуты и секунды
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Обновляем элементы таймера
    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

//===========================================================================

// Функция для установки куки
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Функция для получения значения куки
function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

//===========================================================================

function animateTerminalInit() {
    const terminalInit = document.getElementById('terminal-init');

    // Проверяем, существует ли элемент с ID 'terminal-init'
    if (!terminalInit) {
        return; // Прекращаем выполнение функции, если элемент не найден
    }

    const terminalTexts = terminalInit.querySelectorAll('.terminal-text');

    // Функция для показа строки с задержкой
    function showTextWithDelay(texts, index) {
        if (index >= texts.length) return; // Останавливаемся, если строки закончились

        // Показываем текущую строку
        setTimeout(() => {
            texts[index].style.opacity = 1;

            // Запускаем анимацию точек, если это строка с точками
            if (texts[index].querySelector('span')) {
                const dots = texts[index].querySelector('span');
                dots.style.animation = 'dots 3s infinite'; // Увеличиваем время анимации точек
            }

            // Рекурсивно вызываем функцию для следующей строки
            showTextWithDelay(texts, index + 1);
        }, 100); // Задержка между строками: 2 секунды
    }

    // Запускаем анимацию с первой строки
    showTextWithDelay(terminalTexts, 0);
}

//===========================================================================

// Функция для установки стиля
function setStyle(styleName) {
    const styleLink = document.querySelector('link[rel="stylesheet"]');
    if (styleLink) {
        const isHomePage = document.body.classList.contains('home-page');
        const stylePath = isHomePage ? `${styleName}.css` : `../${styleName}.css`;
        styleLink.href = stylePath;
        setCookie("selectedStyle", styleName, 30); // Сохраняем стиль в куки на 30 дней
    }
}

// Функция для установки стиля по умолчанию
function setDefaultStyle() {
    const savedStyle = getCookie("selectedStyle");
    if (savedStyle) {
        setStyle(savedStyle);
    } else {
        setStyle("stylesG"); // Устанавливаем стиль по умолчанию
    }
}

//===========================================================================

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

//===========================================================================

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

//===========================================================================

// Функция для инициализации кнопок переключения стиля
function initStyleSwitcher() {
    const switchToD = document.getElementById("switch-to-d");
    const switchToG = document.getElementById("switch-to-g");

    if (switchToD) {
        switchToD.addEventListener("click", () => setStyle("stylesD"));
    }
    if (switchToG) {
        switchToG.addEventListener("click", () => setStyle("stylesG"));
    }
}

function initBurgerMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navUl = document.querySelector('nav ul');

    if (burgerMenu && navUl) {
        burgerMenu.addEventListener('click', () => {
            navUl.classList.toggle('active');
            burgerMenu.classList.toggle('active');
        });
    }
}

//===========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Устанавливаем стиль по умолчанию или сохраненный стиль
    setDefaultStyle();
    checkAuth();
    initAuthForm();
    try {
        updateCountdown(); // Первый запуск
        setInterval(updateCountdown, 1000); // Обновляем таймер каждую секунду
    } catch (error) {

    }

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
            //console.log('Header и Footer загружены.'); // Отладочное сообщение
            setMainMinHeight();
            window.addEventListener('resize', setMainMinHeight);
            initStyleSwitcher();
            initBurgerMenu(); // Инициализация бургер-меню
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

    animateTerminalInit();

    // Используем новый класс
    const blocks = document.querySelectorAll('.error-404');

    blocks.forEach(block => {
        const replaceTextWithBlocks = (element) => {
            if (element.nodeType === Node.TEXT_NODE && element.textContent.trim() !== "") {
                element.textContent = "█".repeat(element.textContent.length);
            } else if (element.nodeType === Node.ELEMENT_NODE) {
                Array.from(element.childNodes).forEach(replaceTextWithBlocks);
            }
        };

        replaceTextWithBlocks(block);
    });
});