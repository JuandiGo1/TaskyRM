// Configuraciones globales de la aplicación

// URL base para las peticiones a la API
const API_BASE_URL = 'https://tasky-rm-backend.vercel.app';

// Selectores de elementos DOM comunes
const SELECTORS = {
    AUTH_SECTION: 'auth-section',
    TASK_SECTION: 'task-section',
    LOGIN_FORM: 'loginForm',
    REGISTER_FORM: 'registerForm',
    LOGIN_ERROR: 'login-error',
    REGISTER_ERROR: 'register-error',
    ADD_TASK_FORM: 'addTaskForm',
    TASK_LIST: 'task-list',
    ADD_TASK_ERROR: 'add-task-error',
    FILTER_TASKS: 'filter-tasks'
};

export { API_BASE_URL, SELECTORS };