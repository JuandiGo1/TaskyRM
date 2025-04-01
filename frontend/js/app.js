// Punto de entrada principal de la aplicación

import { API_BASE_URL, SELECTORS } from './config.js';
import Auth from './auth.js';
import TaskManager from './tasks.js';
import UI from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos DOM
    const authSection = document.getElementById(SELECTORS.AUTH_SECTION);
    const taskSection = document.getElementById(SELECTORS.TASK_SECTION);
    const loginForm = document.getElementById(SELECTORS.LOGIN_FORM);
    const registerForm = document.getElementById(SELECTORS.REGISTER_FORM);
    const addTaskForm = document.getElementById(SELECTORS.ADD_TASK_FORM);
    const taskList = document.getElementById(SELECTORS.TASK_LIST);
    const filterTasksSelect = document.getElementById(SELECTORS.FILTER_TASKS);
    
    // Variable para control de edición
    let currentlyEditingTask = null;

    // Inicialización de la aplicación
    initApp();

    function initApp() {
        if (Auth.isLoggedIn()) {
            UI.toggleSection(SELECTORS.AUTH_SECTION, false);
            UI.toggleSection(SELECTORS.TASK_SECTION, true);
            loadTasks();
        } else {
            UI.toggleSection(SELECTORS.AUTH_SECTION, true);
            UI.toggleSection(SELECTORS.TASK_SECTION, false);
        }
        
        // Configurar todos los event listeners
        setupAuthListeners();
        setupTaskListeners();
    }

    // Configuración de listeners para autenticación
    function setupAuthListeners() {
        // Navegación entre formularios de login/registro
        document.getElementById('show-register-link').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('register-form').style.display = 'block';
        });

        document.getElementById('show-login-link').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-form').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
        });

        // Formulario de login
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            UI.clearError(SELECTORS.LOGIN_ERROR);
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                await Auth.login(username, password);
                UI.toggleSection(SELECTORS.AUTH_SECTION, false);
                UI.toggleSection(SELECTORS.TASK_SECTION, true);
                loadTasks();
            } catch (error) {
                UI.showError(SELECTORS.LOGIN_ERROR, error.message);
            }
        });

        // Formulario de registro
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            UI.clearError(SELECTORS.REGISTER_ERROR);
            
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;

            try {
                await Auth.register(username, password);
                alert('Registro exitoso. Por favor, inicia sesión.');
                document.getElementById('register-form').style.display = 'none';
                document.getElementById('login-form').style.display = 'block';
            } catch (error) {
                UI.showError(SELECTORS.REGISTER_ERROR, error.message);
            }
        });

        // Botón de logout
        document.getElementById('logout-button').addEventListener('click', async () => {
            try {
                await Auth.logout();
                UI.toggleSection(SELECTORS.AUTH_SECTION, true);
                UI.toggleSection(SELECTORS.TASK_SECTION, false);
                taskList.innerHTML = '';
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        });
    }

    // Configuración de listeners para tareas
    function setupTaskListeners() {
        // Handler para agregar tareas
        addTaskForm.addEventListener('submit', handleAddTask);

        // Filtro de tareas
        filterTasksSelect.addEventListener('change', () => {
            const filteredTasks = TaskManager.filterTasks(filterTasksSelect.value);
            renderTasksWithListeners(filteredTasks);
        });
    }

    // Cargar y mostrar todas las tareas
    async function loadTasks() {
        try {
            await TaskManager.fetchTasks();
            renderTasksWithListeners(TaskManager.getAllTasks());
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    // Renderizar tareas y añadir listeners a los botones
    function renderTasksWithListeners(tasksToRender) {
        const taskElements = UI.renderTasks(tasksToRender, taskList);
        
        taskElements.forEach(taskItem => {
            const taskId = taskItem.dataset.taskId;
            const task = TaskManager.getAllTasks().find(t => t._id === taskId);
            
            // Listener para completar/descompletar tarea
            taskItem.querySelector('.complete-btn').addEventListener('click', async () => {
                try {
                    await TaskManager.toggleComplete(taskId);
                    loadTasks();
                } catch (error) {
                    console.error('Error toggling task completion:', error);
                }
            });
            
            // Listener para eliminar tarea
            taskItem.querySelector('.delete-btn').addEventListener('click', async () => {
                if (confirm('¿Seguro que deseas eliminar esta tarea?')) {
                    try {
                        await TaskManager.deleteTask(taskId);
                        loadTasks();
                    } catch (error) {
                        console.error('Error deleting task:', error);
                    }
                }
            });
            
            // Listener para editar tarea
            taskItem.querySelector('.edit-btn').addEventListener('click', () => {
                startEditingTask(task);
            });
        });
    }

    // Configurar el formulario para editar una tarea
    function startEditingTask(task) {
        currentlyEditingTask = task;
        
        // Cargar datos de la tarea en el formulario
        UI.loadTaskForm(task, addTaskForm);
        
        // Cambiar el comportamiento del formulario
        addTaskForm.removeEventListener('submit', handleAddTask);
        addTaskForm.addEventListener('submit', handleEditTask);
    }

    // Handler para añadir una nueva tarea
    async function handleAddTask(e) {
        e.preventDefault();
        UI.clearError(SELECTORS.ADD_TASK_ERROR);
        
        const formData = UI.getTaskFormData();
        const newTask = {
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
            priority: formData.priority
        };
        
        try {
            await TaskManager.addTask(newTask);
            UI.resetTaskForm(addTaskForm);
            loadTasks();
        } catch (error) {
            UI.showError(SELECTORS.ADD_TASK_ERROR, error.message);
        }
    }

    // Handler para editar una tarea existente
    async function handleEditTask(e) {
        e.preventDefault();
        UI.clearError(SELECTORS.ADD_TASK_ERROR);
        
        if (!currentlyEditingTask) return;
        
        const formData = UI.getTaskFormData();
        const updatedTask = {
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
            priority: formData.priority
        };
        
        try {
            await TaskManager.updateTask(currentlyEditingTask._id, updatedTask);
            
            // Restaurar estado original del formulario
            UI.resetTaskForm(addTaskForm);
            
            // Restaurar comportamiento original
            addTaskForm.removeEventListener('submit', handleEditTask);
            addTaskForm.addEventListener('submit', handleAddTask);
            
            currentlyEditingTask = null;
            loadTasks();
        } catch (error) {
            UI.showError(SELECTORS.ADD_TASK_ERROR, error.message);
        }
    }
});