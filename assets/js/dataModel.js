// Константы для сессии
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 дней в миллисекундах

// Определение начальной структуры хранилища
const INITIAL_DATA_SHELL = {
    meta: {
        version: '2.0.0',
        lastUpdated: Date.now(),
        activeUserId: null
    },
    users: {},
    groups: {}
};

// Шаблон для Нового Пользователя
const NEW_USER_TEMPLATE = {
    userId: null,
    username: null,
    passwordHash: null,
    sessionActive: false,
    sessionExpiry: null,
    lastLogin: null,

    character: {
        name: "Герой LevelMe",
        level: 1,
        coins: 0,
        attributes: {
            PHY: { name: "Физическое Здоровье",     level: 1, xp: 0, requiredXP: 100 },
            COG: { name: "Когнитивный Резерв",      level: 1, xp: 0, requiredXP: 100 },
            EMO: { name: "Эмоциональный Интеллект", level: 1, xp: 0, requiredXP: 100 },
            PRO: { name: "Продуктивность",          level: 1, xp: 0, requiredXP: 100 },
            FIN: { name: "Финансовая Устойчивость", level: 1, xp: 0, requiredXP: 100 }
        },
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
        specializations: {}
    },
    tasks: [],
    recurringTasks: []
};

// Шаблон для Новой Группы
const NEW_GROUP_TEMPLATE = {
    groupId: null,
    name: null,
    leaderId: null,
    members: [],
    tasks: [],
    createdAt: null
};

// Экспорт
export const DataModel = {
    getInitialDataShell: () => structuredClone(INITIAL_DATA_SHELL),

    getNewUserTemplate: (userId, username, password) => {
        const template = structuredClone(NEW_USER_TEMPLATE);
        template.userId = userId;
        template.username = username;
        template.passwordHash = password;
        return template;
    },

    getNewGroupTemplate: (groupId, name, leaderId) => {
        const template = structuredClone(NEW_GROUP_TEMPLATE);
        template.groupId = groupId;
        template.name = name;
        template.leaderId = leaderId;
        template.members = [leaderId];
        template.createdAt = Date.now();
        return template;
    }

    SESSION_DURATION_MS
};