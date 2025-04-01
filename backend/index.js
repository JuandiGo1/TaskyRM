
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import routerUser from "./routes/userRoutes.js";
import routerTasks from "./routes/tasksRoutes.js";
import connectDB from "./config/db.js";

dotenv.config({ path: './backend/.env' });
const app = express();

// Habilitar CORS para todas las rutas
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://127.0.0.1:8080",
    credentials: true
  }));


app.use(cookieParser());
app.use(express.json());

connectDB();

app.use(routerUser);
app.use("/task",routerTasks);

app.listen(process.env.PORT ?? 5000, () => console.log(`Servidor corriendo en el puerto ${process.env.PORT || 5000}`))