const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

// Настройка размеров canvas
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Переменные для карты
let boundaries = []; // Границы стран
let infectionZones = []; // Зоны заражения
let selectedDate = "2024-01"; // Дата по умолчанию

// Загрузка данных
async function loadData() {
    try {
        const boundariesResponse = await fetch('/data/boundaries.json');
        boundaries = await boundariesResponse.json();

        const infectionResponse = await fetch('/data/infection.json');
        infectionZones = await infectionResponse.json();

        drawMap();
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
}

// Отрисовка карты
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка границ стран
    boundaries.forEach(country => {
        ctx.beginPath();
        ctx.moveTo(country.points[0].x, country.points[0].y);
        country.points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.closePath();
        ctx.strokeStyle = "#000";
        ctx.stroke();
    });

    // Отрисовка зараженных зон
    infectionZones.forEach(zone => {
        if (zone.date <= selectedDate) {
            ctx.beginPath();
            ctx.arc(zone.center.x, zone.center.y, zone.radius, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fill();
        }
    });
}

// Обновление даты
document.getElementById('date-picker').addEventListener('change', (event) => {
    selectedDate = event.target.value || "2024-01";
    drawMap();
});

// Сброс изменений
document.getElementById('reset-button').addEventListener('click', () => {
    loadData();
    selectedDate = "2024-01";
    document.getElementById('date-picker').value = "2024-01";
});

// Загрузка карты при загрузке страницы
loadData();

// Добавление интерактивности: изменение границ и заражений
canvas.addEventListener('mousedown', (event) => {
    const { offsetX, offsetY } = event;

    // Логика для перемещения границ или заражений
    infectionZones.forEach(zone => {
        const distance = Math.hypot(zone.center.x - offsetX, zone.center.y - offsetY);
        if (distance < zone.radius) {
            zone.center.x = offsetX;
            zone.center.y = offsetY;
            drawMap();
        }
    });
});
