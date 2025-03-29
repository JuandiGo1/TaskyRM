import { model, Schema } from "mongoose";

const priorityOrder = {
    "Ahora o nunca! 😨": 1,
    "Deberia ir haciendo esto 🙂‍↕️": 2,
    "Puedo procastinar 🥱": 3,
};

const taskSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    complete: { type: Boolean, default: false },
    dueDate: { type: Date },
    priority: {
        type: String,
        enum: ["Puedo procastinar 🥱", "Deberia ir haciendo esto 🙂‍↕️", "Ahora o nunca! 😨"],
        default: "Deberia ir haciendo esto 🙂‍↕️",
    },
    priorityValue: {
        type: Number,
        default: function () {
            return priorityOrder[this.priority]; // Asignar el valor numérico basado en la prioridad
        },
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", // Referencia al modelo User
        required: true,
    },
}, {
    timestamps: true,
});

// DECLARE MONGO MODEL
const TaskModel = model("Task", taskSchema);

export default TaskModel;