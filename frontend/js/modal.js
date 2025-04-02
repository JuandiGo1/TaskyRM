// Módulo para gestionar diálogos modales

const Modal = {
    // Referencias a elementos
    modal: null,
    confirmButton: null,
    cancelButton: null,
    messageElement: null,
    
    // Para el modal de edición
    editModal: null,
    editForm: null,
    editCancelButton: null,
    
    // Callbacks
    confirmCallback: null,
    editSubmitCallback: null,
    currentTaskId: null,
    
    // Inicializar los modales
    init() {
        // Modal de confirmación
        this.modal = document.getElementById('confirmation-modal');
        this.confirmButton = document.getElementById('modal-confirm');
        this.cancelButton = document.getElementById('modal-cancel');
        this.messageElement = document.getElementById('modal-message');
        
        // Modal de edición
        this.editModal = document.getElementById('edit-task-modal');
        this.editForm = document.getElementById('edit-task-form');
        this.editCancelButton = document.getElementById('edit-task-cancel');
        
        // Configurar event listeners para modal de confirmación
        this.cancelButton.addEventListener('click', () => this.close());
        this.confirmButton.addEventListener('click', () => {
            if (this.confirmCallback) {
                this.confirmCallback();
            }
            this.close();
        });
        
        // Configurar event listeners para modal de edición
        if (this.editModal) {
            this.editCancelButton.addEventListener('click', () => this.closeEditModal());
            
            this.editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.editSubmitCallback) {
                    const formData = this.getEditFormData();
                    this.editSubmitCallback(this.currentTaskId, formData);
                }
                this.closeEditModal();
            });
            
            // Cerrar al hacer clic fuera del modal
            this.editModal.addEventListener('click', (e) => {
                if (e.target === this.editModal) {
                    this.closeEditModal();
                }
            });
        }
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.modal.classList.contains('active')) {
                    this.close();
                }
                if (this.editModal && this.editModal.classList.contains('active')) {
                    this.closeEditModal();
                }
            }
        });
        
        // Cerrar al hacer clic fuera del modal de confirmación
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    },
    
    // Mostrar el modal de confirmación
    confirm(message, callback) {
        this.messageElement.textContent = message;
        this.confirmCallback = callback;
        this.modal.classList.add('active');
    },
    
    // Cerrar el modal de confirmación
    close() {
        this.modal.classList.remove('active');
        this.confirmCallback = null;
    },
    
    // Mostrar el modal de edición
    showEditModal(task, callback) {
        // Guardar el ID de la tarea y el callback
        this.currentTaskId = task._id;
        this.editSubmitCallback = callback;
        
        // Llenar el formulario con los datos de la tarea
        document.getElementById('edit-task-title').value = task.title;
        document.getElementById('edit-task-description').value = task.description || '';
        document.getElementById('edit-task-due-date').value = task.dueDate ? 
            new Date(task.dueDate).toISOString().split('T')[0] : '';
        document.getElementById('edit-task-priority').value = task.priority;
        
        // Mostrar el modal
        this.editModal.classList.add('active');
    },
    
    // Cerrar el modal de edición
    closeEditModal() {
        this.editModal.classList.remove('active');
        this.editSubmitCallback = null;
        this.currentTaskId = null;
        this.editForm.reset();
    },
    
    // Obtener los datos del formulario de edición
    getEditFormData() {
        const dueDateInput = document.getElementById('edit-task-due-date').value;
        let dueDate = null;
        
        if (dueDateInput) {
            // Crear fecha manteniendo la zona horaria local
            const [year, month, day] = dueDateInput.split('-');
            // Crear la fecha a las 12 del mediodía para evitar problemas de zona horaria
            const localDate = new Date(year, month - 1, day, 12, 0, 0);
            dueDate = localDate.toISOString();
        }
        
        return {
            title: document.getElementById('edit-task-title').value,
            description: document.getElementById('edit-task-description').value,
            dueDate: dueDate,
            priority: document.getElementById('edit-task-priority').value
        };
    }
};

export default Modal;