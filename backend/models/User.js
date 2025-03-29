import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
        trim: true,   
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Longitud mínima para mayor seguridad
    },
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
});

// DECLARE MONGO MODEL
const UserModel = model("User", UserSchema);

export default UserModel;