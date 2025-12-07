import { Storage } from './storage.js';
import { DataModel } from './dataModel.js';
import { AuthController } from './authController.js';
import { TaskController } from './taskController.js';

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

function renderTasks() {
    const userId = appData.meta.activeUserId;
    if (!userId) return;

    const userTasks = appData.users[userId].tasks;
    const today = TaskController.getStartOfDay();
    const container = $('#daily-tasks-list');

    container.empty();

    // Фильтруем задачи: берем только те, что на сегодня (или на выбранную дату)
    const todaysTasks = userTasks.filter(task => task.dueDate === today && task.status !== 'ignored');

    if (todaysTasks.length === 0) {
        container.append('<p class="placeholder-task">На сегодня задач нет...</p>');
        return;
    }

    todaysTasks.forEach(task => {
        const statusClass = task.status === 'completed' ? 'task-done' : '';
        const taskHtml = `
            <div class="task-item ${statusClass}" data-id="${task.id}">
                <div class="task-info">
                    <strong>${task.title}</strong>
                    <span class="task-cat">${task.categories[0]}</span>
                </div>
                <div class="task-actions">
                    <button class="complete-btn">✔️</button>
                    <button class="delete-btn">🗑️</button>
                </div>
            </div>
        `;
        container.append(taskHtml);
    });
}

$(document).ready(function() {
    console.log("LevelMe: Приложение запущено.");

    appData = Storage.loadData();

    if (!appData) {
        appData = DataModel.getInitialDataShell();
        Storage.saveData(appData);
        console.log("LevelMe: Первый запуск. Создана новая структура данных.");
    }

    // Проверяем наличие активной сессии
    const activeUserId = AuthController.checkActiveSession(appData);
    renderUI(appData, activeUserId);
    renderTasks();

    console.log("Тест даты:", TaskController.formatHumanDate(TaskController.getStartOfDay()));
    console.log("Тест ID задачи:", TaskController.generateTaskId());

    // Обработка формы входа/регистрации
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

    // Переключатель видимости формы
    $('#toggle-add-form-btn').on('click', function() {
        const wrapper = $('#add-task-form-wrapper');
        wrapper.slideToggle();

        // Меняем текст кнопки для красоты
        $(this).text(wrapper.is(':visible') ? 'Отмена' : '+ Добавить Новое Задание');
    });

    // Обработка формы создания задачи
    $('#new-task-form').on('submit', function(e) {
        e.preventDefault();

        const title = $('#task-title').val().trim();
        const category = $('#task-category-1').val();

        if (!title || !category) {
            alert("Заполните название и категорию!");
            return;
        }

        // Создаем объект новой задачи
        const newTask = {
            id: TaskController.generateTaskId(),
            title: title,
            categories: [category],
            dueDate: TaskController.getStartOfDay(),
            status: 'active',
            xpReward: 100,
            coinReward: 10,
            createdAt: Date.now()
        };

        // Добавляем задачу текущему пользователю
        const userId = appData.meta.activeUserId;
        appData.users[userId].tasks.push(newTask);

        // Сохраняем обновленные данные в LocalStorage
        Storage.saveData(appData);
        renderTasks();

        // Очищаем форму и скрываем её
        $('#task-title').val('');
        $('#task-category-1').val('');
        $('#add-task-form-wrapper').slideUp();
        $('#toggle-add-form-btn').text('+ Добавить Новое Задание');

        // Перерисовываем UI (задачи пока не отобразятся в списке, но в объекте появятся)
        console.log("Задача успешно создана:", newTask);
        alert("Задание добавлено!");

        // renderTasks();
    });

    // Кнопка "Выполнить"
    $(document).on('click', '.complete-btn', function() {
        const taskId = $(this).closest('.task-item').data('id');
        const userId = appData.meta.activeUserId;
        const user = appData.users[userId];
        const task = user.tasks.find(t => t.id === taskId);

        if (task && task.status !== 'completed') {
            // Меняем статус задачи
            task.status = 'completed';

            // MVP: Начисляем награду персонажу
            user.character.xp += task.xpReward || 100; // Пока общий XP персонажа
            user.character.coins += task.coinReward || 10;

            // Сохраняем
            Storage.saveData(appData);

            // Обновляем экран
            renderTasks();
            renderUI(appData, userId); // Перерисовываем монеты/уровень

            console.log("Задача выполнена! Награда начислена.");
        }
    });

    // Кнопка "Удалить" (Игнорировать)
    $(document).on('click', '.delete-btn', function() {
        const taskId = $(this).closest('.task-item').data('id');
        const userId = appData.meta.activeUserId;
        const task = appData.users[userId].tasks.find(t => t.id === taskId);

        if (task) {
            // Вместо физического удаления меняем статус на 'ignored'
            // Это позволит нам в будущем хранить историю удалений
            task.status = 'ignored';

            Storage.saveData(appData);
            renderTasks(); // Задача исчезнет из списка благодаря фильтру в renderTasks
            console.log("Задача удалена (проигнорирована).");
        }
    });
});