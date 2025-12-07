import { Storage } from './storage.js';
import { DataModel, SESSION_DURATION_MS } from './dataModel.js';

/**
 * Псевдо-хэширование для демонстрации. 
 * Мы не храним пароль в чистом виде, а создаем из него уникальную строку.
 */
function hashPassword(password) {
    return `hash-${password.length}-${password.substring(0, 3)}`;
}

/**
 * Генератор ID пользователя на основе времени и случайного числа.
 */
function generateUserId() {
    return 'user-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

/**
 * Вывод сообщений об ошибках или успехе на экран авторизации.
 */
function displayAuthMessage(message, isError = true) {
    const msgEl = $('#auth-message');
    msgEl.text(message)
         .css('color', isError ? 'var(--color-error)' : 'var(--color-primary)')
         .fadeIn().delay(3000).fadeOut();
}

/**
 * Главная логика: Вход или Регистрация.
 */
function handleAuth(appData, username, password, onAuthSuccess) {
    const hashed = hashPassword(password);
    
    // Ищем, есть ли уже такой пользователь в словаре
    const existingUser = Object.values(appData.users).find(u => u.username === username);

    if (existingUser) {
        // --- СЦЕНАРИЙ 1: ВХОД ---
        if (existingUser.passwordHash === hashed) {
            // Активируем сессию
            existingUser.sessionActive = true;
            existingUser.sessionExpiry = Date.now() + SESSION_DURATION_MS;
            existingUser.lastLogin = Date.now();
            
            appData.meta.activeUserId = existingUser.userId;
            
            Storage.saveData(appData);
            onAuthSuccess(appData, existingUser.userId);
        } else {
            displayAuthMessage("Неверный пароль для этого пользователя!");
        }
    } else {
        // --- СЦЕНАРИЙ 2: РЕГИСТРАЦИЯ ---
        const newId = generateUserId();
        const newUser = DataModel.getNewUserTemplate(newId, username, hashed);
        
        newUser.sessionActive = true;
        newUser.sessionExpiry = Date.now() + SESSION_DURATION_MS;
        newUser.lastLogin = Date.now();
        
        // Добавляем в глобальное хранилище
        appData.users[newId] = newUser;
        appData.meta.activeUserId = newId;

        Storage.saveData(appData);
        displayAuthMessage(`Пользователь ${username} успешно создан!`, false);
        onAuthSuccess(appData, newId);
    }
    return appData;
}

/**
 * Проверка, не истекла ли сессия (30 дней).
 */
function checkActiveSession(appData) {
    const userId = appData.meta.activeUserId;
    if (!userId || !appData.users[userId]) return null;

    const user = appData.users[userId];
    
    // Если сессия активна и время не вышло
    if (user.sessionActive && user.sessionExpiry > Date.now()) {
        return userId;
    }
    
    // Иначе сбрасываем состояние
    user.sessionActive = false;
    appData.meta.activeUserId = null;
    Storage.saveData(appData);
    return null;
}

export const AuthController = {
    handleAuth,
    checkActiveSession,
    displayAuthMessage
};