document.addEventListener("DOMContentLoaded", async () => {
    const timelineItems = document.querySelectorAll(".timeline .year");
    const eventsContainer = document.getElementById("events-container");
    const filter = document.getElementById("event-filter");
    let eventsData = {};

    function escapeHTML(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    async function loadTimeline() {
        try {
            const response = await fetch("../data/timeline.json");
            if (!response.ok) {
                throw new Error(`Не удалось загрузить timeline.json: ${response.status}`);
            }
            eventsData = await response.json();
        } catch (error) {
            console.error(error);
            eventsContainer.innerHTML = "<h3>База хронологии недоступна.</h3>";
        }
    }

    function displayEvents(year) {
        const events = eventsData[year] || [];
        if (!events.length) {
            eventsContainer.innerHTML = "<h3>Событий за этот год нет.</h3>";
            return;
        }

        const filteredType = filter.value;
        const filteredEvents = events.filter(event => filteredType === "all" || event.type === filteredType);

        if (!filteredEvents.length) {
            eventsContainer.innerHTML = "<h3>События данного типа отсутствуют.</h3>";
            return;
        }

        eventsContainer.innerHTML = filteredEvents.map(event => `
            <div class="event ${escapeHTML(event.type)}">
                <p>${escapeHTML(event.text)}</p>
            </div>
        `).join("");
    }

    await loadTimeline();

    timelineItems.forEach(item => {
        item.addEventListener("click", () => {
            timelineItems.forEach(year => year.classList.remove("active"));
            item.classList.add("active");
            displayEvents(item.dataset.year);
        });
    });

    filter.addEventListener("change", () => {
        const activeYear = document.querySelector(".timeline .year.active");
        if (activeYear) {
            displayEvents(activeYear.dataset.year);
        }
    });

    timelineItems[0]?.click();
});
