// Ключ, под которым будут храниться наши данные в LocalStorage.
// Это наш "контейнер" для проекта LevelMe.
const STORAGE_KEY = 'levelme_data';

// 1. Загрузка данных
function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Storage Error: Не удалось распарсить данные.", e);
            return null;
        }
    }
    return null;
}

// 2. Сохранение данных
function saveData(data) {
    if (!data) return false;

    data.meta.lastUpdated = Date.now();

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error("Storage Error: Не удалось сохранить данные.", e);
        return false;
    }
}

// --- 3. Экспорт ---
export const Storage = {
    loadData,
    saveData
};