document.addEventListener("DOMContentLoaded", async () => {
    const tabs = document.getElementById("characters-tabs");
    const contents = document.getElementById("characters-content");

    if (!tabs || !contents) return;

    function escapeHTML(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function renderField(label, value) {
        if (Array.isArray(value)) {
            const items = value.map(item => `<li>${escapeHTML(item)}</li>`).join("");
            return `<p><strong>${escapeHTML(label)}:</strong></p><ul>${items}</ul>`;
        }
        return `<p><strong>${escapeHTML(label)}:</strong> ${escapeHTML(value)}</p>`;
    }

    function activateTab(id) {
        tabs.querySelectorAll(".tab-button").forEach(button => {
            button.classList.toggle("active", button.dataset.tab === id);
        });
        contents.querySelectorAll(".tab-content").forEach(content => {
            content.classList.toggle("active", content.id === id);
        });
    }

    try {
        const response = await fetch("../data/characters.json");
        if (!response.ok) throw new Error(`Не удалось загрузить characters.json: ${response.status}`);
        const characters = await response.json();

        tabs.innerHTML = characters.map((character, index) => `
            <button class="tab-button ${index === 0 ? "active" : ""} ${character.isCorrupted ? "error-404" : ""}" data-tab="${escapeHTML(character.id)}">
                ${escapeHTML(character.name)}
            </button>
        `).join("");

        contents.innerHTML = characters.map((character, index) => `
            <div id="${escapeHTML(character.id)}" class="tab-content ${index === 0 ? "active" : ""} ${character.isCorrupted ? "error-404" : ""}">
                <div class="avatar-row">
                    ${character.images.map(image => `<img src="${escapeHTML(image)}" class="character-avatar" alt="${escapeHTML(character.name)}">`).join("")}
                </div>
                <h3>${escapeHTML(character.name)}</h3>
                ${Object.entries(character.fields).map(([label, value]) => renderField(label, value)).join("")}
            </div>
        `).join("");

        tabs.addEventListener("click", event => {
            const button = event.target.closest(".tab-button");
            if (button) activateTab(button.dataset.tab);
        });
    } catch (error) {
        console.error(error);
        contents.innerHTML = "<article><p>База персонажей недоступна.</p></article>";
    }
});
