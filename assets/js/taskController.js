/**
 * Генератор ID для задач (T-XXXX)
 */
function generateTaskId() {
    return 'T-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

/**
 * Возвращает метку времени (timestamp) начала текущего дня (00:00:00)
 * Это критически важно для фильтрации задач по датам.
 */
function getStartOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

/**
 * Форматирует timestamp в красивую дату (например: "6 декабря")
 */
function formatHumanDate(timestamp) {
    const d = new Date(timestamp);
    const options = { month: 'long', day: 'numeric' };
    return d.toLocaleDateString('ru-RU', options);
}

export const TaskController = {
    generateTaskId,
    getStartOfDay,
    formatHumanDate
};