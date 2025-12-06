// Импортируем наши модули
import { Storage }   from './storage.js';
import { DataModel } from './dataModel.js';

// --- 1. Функция Отрисовки Интерфейса (Самая важная часть) ---
function renderUI(data) {
    console.log("Отрисовка UI с данными:", data);

    const char = data.character;

    // A) Отрисовка Уровня и Монет
    $('#char-level').text(char.level);
    $('#char-coins').text(char.coins).removeClass('coins-positive coins-negative');
    if (char.coins < 0) {
        $('#char-coins').addClass('coins-negative');
    } else if (char.coins > 0) {
         $('#char-coins').addClass('coins-positive');
    }

    // B) Отрисовка Атрибутов
    const attributesList = $('#attributes-list');
    attributesList.empty();

    for (const [key, attr] of Object.entries(char.attributes)) {
        const percent = (attr.xp / attr.requiredXP) * 100;

        const attrHtml = `
            <div class="attribute-item" data-stat="${key}">
                <label>${attr.name}</label>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${percent}%;"></div>
                </div>
                <span class="stat-level">Ур. ${attr.level}</span>
            </div>
        `;
        attributesList.append(attrHtml);
    }

    // C) Отрисовка Универсальных Навыков
    const universalSkillsContainer = $('#universal-skills');
    universalSkillsContainer.find('.skill-item').remove();

    for (const [key, skill] of Object.entries(char.skills)) {
        const percent = (skill.xp / skill.requiredXP) * 100;

        const skillHtml = `
            <div class="skill-item" data-skill="${key}">
                <label>${skill.name}</label>
                <div class="xp-bar-container">
                    <div class="xp-bar" style="width: ${percent}%;"></div>
                </div>
                <span class="xp-level">Ур. ${skill.level} (${skill.xp} XP)</span>
            </div>
        `;
        universalSkillsContainer.append(skillHtml);
    }
}


// --- 2. Основная Логика Запуска Приложения ---
$(document).ready(function() {
    console.log("LevelMe: Приложение запущено.");

    let appData = Storage.loadData();

    // Логика инициализации
    if (!appData) {
        // 1. Создаем новые данные из шаблона
        appData = DataModel.getInitialData();
        // 2. Сохраняем их в LocalStorage
        Storage.saveData(appData);
        console.log("LevelMe: Первый запуск. Создана новая структура данных.");
    } else {
        console.log("LevelMe: Данные успешно загружены из LocalStorage.");
    }

    // Отрисовываем интерфейс с актуальными данными (новыми или загруженными)
    renderUI(appData);
});