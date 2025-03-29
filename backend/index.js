import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import routerUser from "./routes/userRoutes";
import routerNotes from "./routes/noteRoutes";

const app= express();


// Habilitar CORS para todas las rutas
app.use(cors());

app.use(cookieParser());

app.use(routerUser);
app.use(routerNotes);

app.listen(process.env.PORT ?? 5000 ,()=> console.log("Server listening on port"))