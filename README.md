# 🚶‍♂️ WalkTalk: Rotas e Caminhadas Locais

O **WalkTalk** é uma aplicação Full-Stack desenvolvida para promover o turismo e a prática de caminhadas, com foco na criação e gestão de rotas interativas em um mapa. O projeto foi construído com uma arquitetura moderna, separando o Backend (API) do Frontend (Interface do Usuário).

## ✨ Funcionalidades Principais

*   **Autenticação Completa:** Cadastro, Login, Edição de Perfil e Persistência de Sessão.
*   **Sistema de Administração (Admin):** Painel exclusivo para gerenciar a criação, edição e exclusão de rotas (pontos de interesse) no mapa.
*   **Mapeamento Dinâmico:** Exibição de rotas criadas pelo Admin, com traçado de percurso a partir da localização real do usuário.
*   **Design Polido:** Interface moderna e responsiva, com foco na cor verde para remeter à natureza e caminhadas.

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | **React** (Vite + TypeScript) | Interface do Usuário. |
| **Mapeamento** | **Google Maps Platform** | Renderização do mapa e traçado de rotas. |
| **Backend** | **Node.js** (Express) | API RESTful. |
| **Banco de Dados** | **MySQL** | Persistência de dados. |
| **Segurança** | **`bcrypt`** | Criptografia de senhas. |

## 🚀 Como Iniciar o Projeto

Siga os passos abaixo para configurar e rodar o WalkTalk em sua máquina.

### 1. Configuração do Banco de Dados (MySQL)

1.  Garanta que o seu servidor MySQL esteja ativo.
2.  Crie um banco de dados vazio chamado **`walktalk`**.
3.  As credenciais de acesso estão no arquivo `walktalk/backend/.env`.

> **Observação:** O backend está configurado para criar as tabelas `users` e `routes` automaticamente na primeira execução.

### 2. Configuração do Backend (API)

1.  Abra o terminal na pasta `walktalk/backend`.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor:
    ```bash
    npm run dev
    ```
    O servidor será iniciado na porta `5000`.

### 3. Configuração do Frontend (React)

1.  Abra um **novo** terminal na pasta `walktalk/frontend`.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  **Chave da API do Google Maps:** Crie um arquivo chamado `.env` na pasta `walktalk/frontend` e adicione sua chave:
    ```
    VITE_GOOGLE_MAPS_API_KEY="SUA_CHAVE_AQUI"
    ```
4.  Inicie o cliente:
    ```bash
    npm run dev
    ```
    O aplicativo será aberto em `http://localhost:5173/`.

## 🔒 Acesso de Administrador

Para gerenciar as rotas, você precisa de um usuário com permissão de administrador:

1.  Cadastre um usuário comum no site.
2.  No seu gerenciador MySQL, execute o seguinte comando (substitua o e-mail):
    ```sql
    UPDATE users SET is_admin = TRUE WHERE email = 'email_do_admin@exemplo.com';
    ```
3.  Faça login com essa conta e o link para o **Painel de Admin** aparecerá no cabeçalho.

## 📄 Estrutura do Banco de Dados (SQL)

```sql
-- Tabela users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  descricao VARCHAR(500) NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Tabela routes
CREATE TABLE routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  latitude DECIMAL(11, 8) NOT NULL,
  longitude DECIMAL(12, 8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
