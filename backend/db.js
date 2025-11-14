import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testar a conexão
pool.getConnection()
  .then(conn => {
    console.log("✅ Conectado ao MySQL com sucesso! (Pool)");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Erro ao conectar ao MySQL:", err);
  });

export default pool;
