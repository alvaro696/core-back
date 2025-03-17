import express from "express";
import morgan from "morgan";
import { authenticationToken } from "./middlewares/authenticate.middleware.js";
import usersRouters from "./routes/users.routes.js";
import authRouteres from "./routes/auth.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import permissionsRoutes from "./routes/permissions.routes.js";
import gerenciasRoutes from "./routes/organigrama/gerencias.routes.js";
import areasRoutes from "./routes/organigrama/areas.routes.js";
import cargosRoutes from "./routes/organigrama/cargos.routes.js";
import distritosRoutes from './routes/organigrama/distritos.routes.js';
import reservasRoutes from './routes/sala_reuniones/reservas.routes.js';
import salasReoutes from './routes/sala_reuniones/salas.routes.js';
import destacadosRoutes from './routes/personal_destacado/destacados.routes.js';
import publicacaionesRoutes from './routes/publicaciones/publicaciones.routes.js';
import glosarioRoutes from './routes/publicaciones/glosario.routes.js';

import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(
    cors({
        origin: "http://localhost:5173", // Cambia esto a la URL de tu frontend
        methods: "GET,POST,PUT,DELETE,PATCH",
        allowedHeaders: "Content-Type,Authorization",
        optionsSuccessStatus: 204,
        maxAge: 86400 // Permite cachear la respuesta preflight por 1 día
    })
);

// O permitir CORS para cualquier origen (solo para desarrollo)
app.use(cors());

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/login", authRouteres);
app.use("/api/users", usersRouters);
app.use("/api/tasks", authenticationToken, tasksRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/gerencia", gerenciasRoutes);
app.use("/api/area", areasRoutes);
app.use("/api/cargo", cargosRoutes);
app.use('/api/distrito', distritosRoutes);
app.use('/api/reservar', reservasRoutes);
app.use('/api/sala', salasReoutes);
app.use('/api/destacados', destacadosRoutes);
app.use('/api/publicaciones', publicacaionesRoutes);
app.use('/api/glosario', glosarioRoutes);

export default app;