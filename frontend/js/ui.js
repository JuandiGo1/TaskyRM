// Módulo para gestionar la interfaz de usuario

const UI = {
    // Cambia la visibilidad de una sección
    toggleSection(sectionId, isVisible) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = isVisible ? 'block' : 'none';
        }
    },

    // Muestra mensaje de error
    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
        }
    },

    // Limpia mensaje de error
    clearError(elementId) {
        this.showError(elementId, '');
    },

    // Renderiza la lista de tareas
    renderTasks(tasks, taskListElement) {
        taskListElement.innerHTML = '';
        
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.complete ? 'completed' : ''}`;
            taskItem.dataset.taskId = task._id;

            // Contenido de la tarea
            const taskContent = document.createElement('div');
            taskContent.classList.add('task-content');
            taskContent.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description || ''}</p>
                ${task.dueDate ? `<p>Vence: ${new Date(task.dueDate).toLocaleDateString()}</p>` : ''}
                <p>Prioridad: ${task.priority}</p>
            `;
            taskItem.appendChild(taskContent);

            // Botones de acción
            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';
            taskActions.innerHTML = `
                <button class="complete-btn">${task.complete ? 'Descompletar' : 'Completar'}</button>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Eliminar</button>
            `;
            taskItem.appendChild(taskActions);

            taskListElement.appendChild(taskItem);
        });
        
        // Devuelve los elementos creados para poder adjuntar event listeners
        return taskListElement.querySelectorAll('.task-item');
    },

    // Carga datos de una tarea en el formulario para edición
    loadTaskInForm(task, formElement) {
        const titleInput = document.getElementById('taskTitle');
        const descriptionInput = document.getElementById('taskDescription');
        const dueDateInput = document.getElementById('taskDueDate'); 
        const priorityInput = document.getElementById('taskPriority');
        
        titleInput.value = task.title;
        descriptionInput.value = task.description || '';
        dueDateInput.value = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
        priorityInput.value = task.priority;
        
        // Cambia el texto del botón
        const submitButton = formElement.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Guardar Edición';
        }
    },
    
    // Resetea el formulario a su estado original
    resetTaskForm(formElement) {
        formElement.reset();
        
        // Restaura el texto del botón
        const submitButton = formElement.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Agregar Tarea';
        }
    },
    
    // Obtiene los datos del formulario de tareas
    getTaskFormData() {
        return {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            dueDate: document.getElementById('taskDueDate').value,
            priority: document.getElementById('taskPriority').value
        };
    }
};

export default UI;