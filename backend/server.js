import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js"; // Importa o pool para garantir que a conexão seja estabelecida
import userRoutes from "./routes/usersRoutes.js";
import routesRoutes from "./routes/routesRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/routes", routesRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
