-- 1. Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS walktalk;

-- 2. Seleção do Banco de Dados
USE walktalk;

-- 3. Tabela de Usuários (users)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  descricao VARCHAR(500) NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

-- 4. Tabela de Rotas (routes)
CREATE TABLE IF NOT EXISTS routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  latitude DECIMAL(11, 8) NOT NULL,
  longitude DECIMAL(12, 8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

UPDATE users SET is_admin = TRUE WHERE email = 'seu@email.com';
