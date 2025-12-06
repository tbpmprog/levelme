// Ключ, под которым будут храниться наши данные в LocalStorage.
const STORAGE_KEY = 'levelme_data';

// Загрузка данных
function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Storage Error: Не удалось распарсить данные из LocalStorage", e);
            return null;
        }
    }
    return null;
}

// Сохранение данных
function saveData(data) {
    if (!data) return false;

    data.meta.lastUpdated = Date.now();

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error("Storage Error: Не удалось сохранить данные в LocalStorage", e);
        return false;
    }
}

// Экспорт
export const Storage = {
    loadData,
    saveData
};