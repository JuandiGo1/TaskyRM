import UserModel from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Usuario,  y contraseña son obligatorios." });
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ message: "El nombre de usuario debe tener entre 3 y 20 caracteres." });
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ message: "El nombre de usuario solo puede contener letras, números y guiones bajos." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
        }

        // Verificar si el usuario ya existe
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "El usuario ya existe" });

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const newUser = new UserModel({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
};

// Iniciar sesión y generar token JWT
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: "El nombre de usuario y la contraseña son obligatorios." });
        }

        // Buscar usuario 
        const user = await UserModel.findOne({ username });
        console.log("buscando")
        if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

        // Generar token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });


        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hora en milisegundos
            secure: true, // Solo en HTTPS en producción
            sameSite: 'None' // Protección contra CSRF
        })
            .send({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select("-password"); // Excluye la contraseña
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
};



// Obtener datos del usuario autenticado
export const logoutUser = async (req, res) => {
    try {
        // Limpiar la cookie
        res.clearCookie('access_token');

        res.json({ message: "Cierre de sesión exitoso" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
};
