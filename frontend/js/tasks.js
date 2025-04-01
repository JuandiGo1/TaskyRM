// Módulo para gestionar las operaciones con tareas

import { API_BASE_URL } from './config.js';

const TaskManager = {
    tasks: [], // Almacena las tareas obtenidas del servidor
    
    // Obtiene todas las tareas del usuario
    async fetchTasks() {
        try {
            const response = await fetch(`${API_BASE_URL}/task/mytasks`, {
                credentials: 'include',
            });

            
            if (!response.ok) {
                const message = await response.json();
                throw new Error(message.message || 'Error al obtener tareas');
            }
            
            const data = await response.json();
            this.tasks = data.tasks;
            return this.tasks;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },
    
    // Añade una nueva tarea
    async addTask(task) {
        const response = await fetch(`${API_BASE_URL}/task/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',  // Añade esta línea
            body: JSON.stringify(task)
        });

        if (!response.ok) {
            const message = await response.json();
            throw new Error('Error al agregar tarea');
        }

        return response.json();
    },
    
    // Elimina una tarea por su ID
    async deleteTask(taskId) {
        const response = await fetch(`${API_BASE_URL}/task/delete/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const message = await response.json();
            throw new Error(message.message || 'Error al eliminar tarea');
        }
        
        return response.json();
    },
    
    // Cambia el estado de completado de una tarea
    async toggleComplete(taskId) {
        const response = await fetch(`${API_BASE_URL}/task/complete/${taskId}`, {
            method: 'PUT'
        });
        
        if (!response.ok) {
            const message = await response.json();
            throw new Error(message.message || 'Error al actualizar el estado de la tarea');
        }
        
        return response.json();
    },
    
    // Actualiza los datos de una tarea
    async updateTask(taskId, updatedTask) {
        const response = await fetch(`${API_BASE_URL}/task/edit/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask)
        });
        
        if (!response.ok) {
            const message = await response.json();
            throw new Error(message.message || 'Error al editar tarea');
        }
        
        return response.json();
    },
    
    // Filtra las tareas según el criterio especificado
    filterTasks(filterType) {
        switch(filterType) {
            case 'completed':
                return this.tasks.filter(task => task.complete);
            case 'pending':
                return this.tasks.filter(task => !task.complete);
            default:
                return this.tasks;
        }
    },
    
    // Devuelve todas las tareas
    getAllTasks() {
        return this.tasks;
    }
};

export default TaskManager;