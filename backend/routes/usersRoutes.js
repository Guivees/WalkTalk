import express from "express";
import bcrypt from "bcrypt";
import pool from "../db.js"; // Importa o pool de conexões
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// cria tabela se não existir
(async () => {
  try {
    // Usando pool.execute para criar a tabela
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        descricao VARCHAR(500) NULL,
        is_admin BOOLEAN DEFAULT FALSE
      )
    `);
    console.log("Tabela 'users' verificada/criada com sucesso.");
  } catch (err) {
    console.error("Erro ao verificar/criar tabela 'users':", err);
  }
})();

// cadastro
router.post("/register", async (req, res) => {
  const { nome, email, senha, descricao } = req.body;
  if (!nome || !email || !senha)
    return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });

  try {
    const hash = await bcrypt.hash(senha, 10);
    // Usando pool.execute para inserção
    await pool.execute("INSERT INTO users (nome, email, senha, descricao) VALUES (?, ?, ?, ?)", [nome, email, hash, descricao || ""]);
    res.json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Este e-mail já está cadastrado." });
    }
    console.error("Erro no cadastro:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    // Usando pool.execute para seleção
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) return res.status(400).json({ error: "Usuário não encontrado." });

    const user = rows[0];
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ error: "Senha incorreta." });

    // Removendo a senha do objeto do usuário antes de enviar a resposta
    delete user.senha; 
    res.json({ message: "Login bem-sucedido!", user, isAdmin: user.is_admin || false });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// editar
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;

  try {
    // Usando pool.execute para atualização
    const [result] = await pool.execute("UPDATE users SET nome=?, descricao=? WHERE id=?", [nome, descricao || "", id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado para atualização." });
    }
    // Retorna o usuário atualizado
    const [updatedUser] = await pool.execute("SELECT id, nome, email, descricao FROM users WHERE id=?", [id]);
    res.json({ message: "Usuário atualizado com sucesso!", user: updatedUser[0] });
  } catch (err) {
    console.error("Erro na edição:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// excluir
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Usando pool.execute para exclusão
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado para exclusão." });
    }
    res.json({ message: "Usuário excluído com sucesso!" });
  } catch (err) {
    console.error("Erro na exclusão:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;
