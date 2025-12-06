// --- 1. Определение начальной структуры данных ---
const INITIAL_DATA = {
    // Мета-информация о данных
    meta: {
        version: '1.0.0',
        lastUpdated: Date.now()
    },
    // Данные о персонаже (самое главное)
    character: {
        name: "Герой LevelMe",
        level: 1,
        coins: 0,

        // 5 Атрибутов (Core Stats)
        attributes: {
            PHY: { name: "Физическое Здоровье", level: 1, xp: 0, requiredXP: 100 },
            COG: { name: "Когнитивный Резерв", level: 1, xp: 0, requiredXP: 100 },
            EMO: { name: "Эмоциональный Интеллект", level: 1, xp: 0, requiredXP: 100 },
            PRO: { name: "Продуктивность", level: 1, xp: 0, requiredXP: 100 },
            FIN: { name: "Финансовая Устойчивость", level: 1, xp: 0, requiredXP: 100 }
        },

        // 8 Универсальных Навыков (Skills)
        skills: {
            willpower:    { name: "Сила Воли",           level: 1, xp: 0, requiredXP: 100, type: 'basic' },
            organization: { name: "Организованность",    level: 1, xp: 0, requiredXP: 100, type: 'basic' },
            learning:     { name: "Обучаемость",         level: 1, xp: 0, requiredXP: 100, type: 'basic' },
            energymgmt:   { name: "Энергоменеджмент",    level: 1, xp: 0, requiredXP: 100, type: 'basic' },
            stressmgmt:   { name: "Управление Стрессом", level: 1, xp: 0, requiredXP: 100, type: 'basic' },
            socialskills: { name: "Социальные Навыки",   level: 1, xp: 0, requiredXP: 100, type: 'basic' },
            budgeting:    { name: "Бюджетирование",      level: 1, xp: 0, requiredXP: 100, type: 'basic' },
            investing:    { name: "Инвестирование",      level: 1, xp: 0, requiredXP: 100, type: 'basic' },
        },

        // Специализированные навыки (пустой объект, заполняется динамически)
        specializations: {}
    },

    // Массивы для будущих данных
    tasks: [],
    rewards: []
};

// --- 2. Экспорт (для доступа из других файлов) ---
export const DataModel = {
    // Мы возвращаем копию объекта, чтобы main.js случайно не изменил шаблон
    getInitialData: () => structuredClone(INITIAL_DATA)
};