import express from "express";
import pool from "../db.js";

const router = express.Router();

// Criar tabela de rotas se não existir
(async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS routes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description VARCHAR(500),
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabela 'routes' verificada/criada com sucesso.");
  } catch (err) {
    console.error("Erro ao verificar/criar tabela 'routes':", err);
  }
})();

// Obter todas as rotas
router.get("/", async (req, res) => {
  try {
    const [routes] = await pool.execute("SELECT * FROM routes ORDER BY created_at DESC");
    res.json(routes);
  } catch (err) {
    console.error("Erro ao obter rotas:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Obter uma rota específica
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [routes] = await pool.execute("SELECT * FROM routes WHERE id = ?", [id]);
    if (routes.length === 0) {
      return res.status(404).json({ error: "Rota não encontrada." });
    }
    res.json(routes[0]);
  } catch (err) {
    console.error("Erro ao obter rota:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Criar uma nova rota (apenas para admins)
router.post("/", async (req, res) => {
  const { title, description, latitude, longitude, userId } = req.body;

  if (!title || !latitude || !longitude) {
    return res.status(400).json({ error: "Preencha todos os campos obrigatórios (title, latitude, longitude)." });
  }

  try {
    // Verificar se o usuário é admin
    const [user] = await pool.execute("SELECT is_admin FROM users WHERE id = ?", [userId]);
    if (user.length === 0 || !user[0].is_admin) {
      return res.status(403).json({ error: "Apenas administradores podem criar rotas." });
    }

    // Inserir a nova rota
    await pool.execute(
      "INSERT INTO routes (title, description, latitude, longitude) VALUES (?, ?, ?, ?)",
      [title, description || "", latitude, longitude]
    );
    res.json({ message: "Rota criada com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar rota:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Atualizar uma rota (apenas para admins)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, latitude, longitude, userId } = req.body;

  try {
    // Verificar se o usuário é admin
    const [user] = await pool.execute("SELECT is_admin FROM users WHERE id = ?", [userId]);
    if (user.length === 0 || !user[0].is_admin) {
      return res.status(403).json({ error: "Apenas administradores podem atualizar rotas." });
    }

    // Atualizar a rota
    const [result] = await pool.execute(
      "UPDATE routes SET title=?, description=?, latitude=?, longitude=? WHERE id=?",
      [title, description || "", latitude, longitude, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Rota não encontrada." });
    }

    res.json({ message: "Rota atualizada com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar rota:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Deletar uma rota (apenas para admins)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    // Verificar se o usuário é admin
    const [user] = await pool.execute("SELECT is_admin FROM users WHERE id = ?", [userId]);
    if (user.length === 0 || !user[0].is_admin) {
      return res.status(403).json({ error: "Apenas administradores podem deletar rotas." });
    }

    // Deletar a rota
    const [result] = await pool.execute("DELETE FROM routes WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Rota não encontrada." });
    }

    res.json({ message: "Rota deletada com sucesso!" });
  } catch (err) {
    console.error("Erro ao deletar rota:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;
