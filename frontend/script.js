document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:5000'; //  <-  Ajusta esto si tu backend no está en el mismo dominio que el frontend

    // ---  LocalStorage para el estado de autenticación ---
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authSection = document.getElementById('auth-section');
    const taskSection = document.getElementById('task-section');

    if (isLoggedIn) {
        authSection.style.display = 'none';
        taskSection.style.display = 'block';
        fetchTasks();
    } else {
        authSection.style.display = 'block';
        taskSection.style.display = 'none';
    }

    // ---  Funcionalidad de Autenticación  ---
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    });


    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const message = await response.json();
                throw new Error(message.message || 'Error al iniciar sesión');
            }

            localStorage.setItem('isLoggedIn', 'true');
            authSection.style.display = 'none';
            taskSection.style.display = 'block';
            fetchTasks();
        } catch (error) {
            loginError.textContent = error.message;
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        registerError.textContent = '';
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const message = await response.json();
                throw new Error(message.message || 'Error al registrar usuario');
            }

            alert('Registro exitoso. Por favor, inicia sesión.');
            document.getElementById('register-form').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';

        } catch (error) {
            registerError.textContent = error.message;
        }
    });

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST'
            });
            if (!response.ok) {
                console.error('Error al cerrar sesión');
            }
            localStorage.removeItem('isLoggedIn');
            authSection.style.display = 'block';
            taskSection.style.display = 'none';
            taskList.innerHTML = ''; // Limpiar la lista de tareas
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    });
    //--- Fin de la funcionalidad de autenticación ---

    
    // --- Funcionalidad de Tareas ---
    const addTaskForm = document.getElementById('addTaskForm');
    const taskList = document.getElementById('task-list');
    const addTaskError = document.getElementById('add-task-error');
    let tasks = []; // Para almacenar las tareas fetched y poder filtrarlas en el frontend

    // Función para obtener y mostrar las tareas
    async function fetchTasks() {
        try {
            const response = await fetch(`${API_BASE_URL}/task/mytasks`);
            if (!response.ok) {
                const message = await response.json();
                throw new Error(message.message || 'Error al obtener tareas');
            }
            const data = await response.json();
            tasks = data.tasks; // Guarda las tareas obtenidas
            renderTasks(tasks); // Renderiza todas las tareas inicialmente
        } catch (error) {
            console.error('Error fetching tasks:', error);
            // Consider mostrar un mensaje de error en la UI
        }
    }


    // Función para renderizar las tareas en la UI
    function renderTasks(tasksToRender) {
        taskList.innerHTML = ''; // Limpiar la lista actual
        tasksToRender.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.complete ? 'completed' : ''}`;
            taskItem.dataset.taskId = task._id; // Almacenar el ID de la tarea en el dataset

            const taskContent = document.createElement('div');
            taskContent.classList.add('task-content');
            taskContent.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description || ''}</p>
                ${task.dueDate ? `<p>Vence: ${new Date(task.dueDate).toLocaleDateString()}</p>` : ''}
                <p>Prioridad: ${task.priority}</p>
            `;
            taskItem.appendChild(taskContent);

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';
            taskActions.innerHTML = `
                <button class="complete-btn">${task.complete ? 'Descompletar' : 'Completar'}</button>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Eliminar</button>
            `;
            taskItem.appendChild(taskActions);

            // Botones de acción dentro de cada tarea
            const completeButton = taskActions.querySelector('.complete-btn');
            completeButton.addEventListener('click', () => toggleCompleteTask(task._id));

            const deleteButton = taskActions.querySelector('.delete-btn');
            deleteButton.addEventListener('click', () => deleteTask(task._id));

            const editButton = taskActions.querySelector('.edit-btn');
            editButton.addEventListener('click', () => editTask(task));


            taskList.appendChild(taskItem);
        });
    }


    addTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        addTaskError.textContent = '';

        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const priority = document.getElementById('taskPriority').value;


        const newTask = {
            title,
            description,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            priority
        };

        try {
            const response = await fetch(`${API_BASE_URL}/task/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });

            if (!response.ok) {
                const message = await response.json();
                throw new Error(message.message || 'Error al agregar tarea');
            }

            addTaskForm.reset(); // Limpiar el formulario
            fetchTasks(); // Recargar la lista de tareas actualizada

        } catch (error) {
            addTaskError.textContent = error.message;
        }
    });


    async function deleteTask(taskId) {
        if (!confirm('¿Seguro que deseas eliminar esta tarea?')) {
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/task/delete/${taskId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const message = await response.json();
                throw new Error(message.message || 'Error al eliminar tarea');
            }
            fetchTasks(); // Recargar tareas tras eliminar

        } catch (error) {
            console.error('Error deleting task:', error);
            // Consider mostrar feedback al usuario sobre el error
        }
    }


    async function toggleCompleteTask(taskId) {
        try {
            const response = await fetch(`${API_BASE_URL}/task/complete/${taskId}`, {
                method: 'PUT'
            });
            if (!response.ok) {
                const message = await response.json();
                throw new Error(message.message || 'Error al actualizar el estado de la tarea');
            }
            fetchTasks(); // Recargar tareas tras completar/descompletar
        } catch (error) {
            console.error('Error updating task completion status:', error);
            // Consider mostrar feedback al usuario sobre el error
        }
    }


    let currentlyEditingTask = null; // Variable para rastrear la tarea que se está editando

    function editTask(task) {
        currentlyEditingTask = task; // Guarda la tarea que se va a editar

        // Precarga los valores de la tarea en el formulario
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskDueDate').value = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''; // Formato YYYY-MM-DD para el input de fecha
        document.getElementById('taskPriority').value = task.priority;

        // Cambia el texto del botón de "Agregar Tarea" a "Guardar Edición"
        const submitButton = addTaskForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Guardar Edición';

        // Modifica el event listener del formulario para manejar la edición
        addTaskForm.removeEventListener('submit', addTaskSubmitHandler); // Elimina el listener anterior para no duplicar
        addTaskForm.addEventListener('submit', editTaskSubmitHandler); // Añade el nuevo listener para editar
    }


    // Handler original para agregar tareas
    async function addTaskSubmitHandler(e) {
        e.preventDefault();
        addTaskError.textContent = ''; // Limpiar mensajes de error

        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const priority = document.getElementById('taskPriority').value;

        const newTask = {
            title,
            description,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            priority
        };


        try {
            const response = await fetch(`${API_BASE_URL}/task/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });

            if (!response.ok) {
                const message = await response.json();
                throw new Error(message.message || 'Error al agregar tarea');
            }

            addTaskForm.reset(); // Limpiar el formulario
            fetchTasks(); // Recargar la lista de tareas actualizada


        } catch (error) {
            addTaskError.textContent = error.message;
        }
    }


    // Nuevo handler para editar tareas
    async function editTaskSubmitHandler(e) {
        e.preventDefault();
        addTaskError.textContent = '';

        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const priority = document.getElementById('taskPriority').value;

        const updatedTask = {
            title,
            description,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            priority
        };


        try {
            const response = await fetch(`${API_BASE_URL}/task/edit/${currentlyEditingTask._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask)
            });

            if (!response.ok) {
                const message = await response.json();
                throw new Error(message.message || 'Error al editar tarea');
            }


            // Restablecer el formulario y el botón a su estado original de "Agregar Tarea"
            addTaskForm.reset();
            const submitButton = addTaskForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Agregar Tarea';

            addTaskForm.removeEventListener('submit', editTaskSubmitHandler); // Remover este handler de edición
            addTaskForm.addEventListener('submit', addTaskSubmitHandler);      // Volver a poner el handler de agregar

            currentlyEditingTask = null; // Limpiar la tarea actualmente en edición
            fetchTasks(); // Recargar la lista de tareas actualizada

        } catch (error) {
            addTaskError.textContent = error.message;
        }
    }

    // Inicialmente, el formulario debe usar el handler para agregar tareas
    addTaskForm.addEventListener('submit', addTaskSubmitHandler);


    // --- Filtro de tareas ---
    const filterTasksSelect = document.getElementById('filter-tasks');
    filterTasksSelect.addEventListener('change', () => {
        const filterValue = filterTasksSelect.value;
        let filteredTasks = [];

        if (filterValue === 'completed') {
            filteredTasks = tasks.filter(task => task.complete);
        } else if (filterValue === 'all') {
            filteredTasks = tasks;
        } else {
            filteredTasks = tasks.filter(task => !task.complete); // pendientes por default
            
        }
        renderTasks(filteredTasks);
    });


});