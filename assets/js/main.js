import { Storage } from './storage.js'; 
import { DataModel } from './dataModel.js';
import { AuthController } from './authController.js'; // Добавляем импорт

let appData = null;

function renderUI(data, userId) {
    if (!userId || !data.users[userId]) {
        console.log("Отрисовка UI: Нет активного пользователя. Показываем экран входа.");
        $('#auth-screen').show();
        $('#app-container').hide();
        return;
    }

    $('#auth-screen').hide();
    $('#app-container').show();

    const user = data.users[userId];
    const char = user.character;

    // Отрисовка Уровня и Монет
    $('#char-level').text(char.level);
    $('#char-coins').text(char.coins).removeClass('coins-positive coins-negative');

    if (char.coins < 0) {
        $('#char-coins').addClass('coins-negative');
    } else if (char.coins > 0) {
         $('#char-coins').addClass('coins-positive');
    }

    // Отрисовка Атрибутов
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
            </div>`;
        attributesList.append(attrHtml);
    }

    // Отрисовка Универсальных Навыков
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
            </div>`;
        universalSkillsContainer.append(skillHtml);
    }
}

$(document).ready(function() {
    console.log("LevelMe: Приложение запущено.");

    appData = Storage.loadData();

    if (!appData) {
        appData = DataModel.getInitialDataShell();
        Storage.saveData(appData);
        console.log("LevelMe: Первый запуск. Создана новая структура данных.");
    }

    // 1. Проверяем наличие активной сессии
    const activeUserId = AuthController.checkActiveSession(appData);
    renderUI(appData, activeUserId);

    // 2. Обработка формы входа/регистрации
    $('#login-form').on('submit', function(e) {
        e.preventDefault();

        const username = $('#auth-username').val().trim();
        const password = $('#auth-password').val();

        if (!username || !password) {
            AuthController.displayAuthMessage("Введите логин и пароль");
            return;
        }

        // Вызываем логику аутентификации
        appData = AuthController.handleAuth(appData, username, password, (updatedData, userId) => {
            // Этот коллбэк сработает при успешном входе или регистрации
            renderUI(updatedData, userId);
        });
    });
});