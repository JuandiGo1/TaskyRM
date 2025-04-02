import TaskModel  from "../models/Task.js";

// Agregar una nueva tarea
export const addTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "El título es obligatorio." });
    }

    // Crear una nueva tarea
    const newTask = new TaskModel({
      title,
      description,
      dueDate,
      priority,
      user: req.user.id, // Asociar la tarea al usuario autenticado
    });

    await newTask.save();
    res.status(201).json({ message: "Tarea creada con éxito", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la tarea", error });
  }
};

// Eliminar una tarea
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar y eliminar la tarea
    const deletedTask = await TaskModel.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deletedTask) {
      return res.status(404).json({ message: "Tarea no encontrada o no autorizada" });
    }

    res.json({ message: "Tarea eliminada con éxito", task: deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la tarea", error });
  }
};

// Editar una tarea
export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Buscar y actualizar la tarea
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: updates }, // Solo actualizar los campos proporcionados
      { new: true } // Retorna la tarea actualizada
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Tarea no encontrada o no autorizada" });
    }

    res.json({ message: "Tarea actualizada con éxito", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la tarea", error });
  }
};

// Marcar una tarea como completada
export const completeTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar y marcar la tarea como completada
    const completedTask = await TaskModel.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { complete: true },
      { new: true } // Retorna la tarea actualizada
    );

    if (!completedTask) {
      return res.status(404).json({ message: "Tarea no encontrada o no autorizada" });
    }

    res.json({ message: "Tarea marcada como completada", task: completedTask });
  } catch (error) {
    res.status(500).json({ message: "Error al completar la tarea", error });
  }
};

// Obtener tareas de un usuario organizadas por prioridad
export const getUserTasksByPriority = async (req, res) => {
  try {
    const tasks = await TaskModel.find({ user: req.user.id})
      .sort({ priorityValue: 1, dueDate: 1 }); // Ordenar por prioridad numérica y luego por fecha de vencimiento

    res.json({ message: "Tareas obtenidas con éxito", tasks });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las tareas", error });
  }
};

