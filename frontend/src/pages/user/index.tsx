import React from "react";
import { useState, useEffect } from "react";
import { LogOut, UserRound, Edit2, Save, X, Mail, FileText } from "lucide-react";
import { PageTitle } from "@/components/global/PageTitle";
import { useUser } from "@/App";
import { useTheme } from "@/contexts/ThemeContext";

interface User {
  id: number;
  nome: string;
  email: string;
  descricao?: string;
  cidade?: string;
  foto?: string;
}

const API_URL = "http://localhost:5000/api/users";

const UserPage: React.FC = () => {
  const { user: contextUser, setUser: setContextUser } = useUser();
  const { darkMode, addNotification } = useTheme();
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [user, setUser] = useState<User | null>(contextUser);
  const [mensagem, setMensagem] = useState<string>("");
  const [carregando, setCarregando] = useState<boolean>(false);
  const [editando, setEditando] = useState<boolean>(false);
  const [nomeEditado, setNomeEditado] = useState<string>("");
  const [descricaoEditada, setDescricaoEditada] = useState<string>("");

  // Sincronizar com o contexto quando ele mudar
  useEffect(() => {
    setUser(contextUser);
    if (contextUser) {
      setNomeEditado(contextUser.nome);
      setDescricaoEditada(contextUser.descricao || "");
    }
  }, [contextUser]);

  // register handler
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMensagem("");
    setCarregando(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, descricao }),
      });
      const data = await res.json();
      if (res.ok) {
        addNotification("success", "✅ Cadastro realizado com sucesso!");
        setMensagem("✅ Cadastro realizado com sucesso!");
        setTimeout(() => {
          setModo("login");
          setNome("");
          setSenha("");
          setEmail("");
          setDescricao("");
          setMensagem("");
        }, 1500);
      } else {
        addNotification("error", `❌ ${data.error || "Erro ao cadastrar"}`);
        setMensagem(`❌ ${data.error || "Erro ao cadastrar"}`);
      }
    } catch (err) {
      addNotification("error", "❌ Erro de conexão com o servidor.");
      setMensagem("❌ Erro de conexão com o servidor.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  // login handler
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMensagem("");
    setCarregando(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (res.ok) {
        // espera que o backend retorne { user: {...} }
        const userData = data.user as User;
        setUser(userData);
        setContextUser(userData); // Salva no contexto (e localStorage)
        setNomeEditado(userData.nome); // Inicializa o campo de edição com o nome atual
        setDescricaoEditada(userData.descricao || "");
        addNotification("success", `✅ Bem-vindo, ${userData.nome}!`);
        setMensagem("✅ Login bem-sucedido!");
        setSenha("");
      } else {
        addNotification("error", `❌ ${data.error || "Erro ao logar"}`);
        setMensagem(`❌ ${data.error || "Erro ao logar"}`);
      }
    } catch (err) {
      addNotification("error", "❌ Erro de conexão com o servidor.");
      setMensagem("❌ Erro de conexão com o servidor.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  // edit handler
  const handleEdit = async (): Promise<void> => {
    if (!user) return;

    setMensagem("");
    setCarregando(true);
    try {
      const res = await fetch(`${API_URL}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeEditado, descricao: descricaoEditada }),
      });
      const data = await res.json();
      if (res.ok) {
        addNotification("success", "✅ Perfil atualizado com sucesso!");
        setMensagem("✅ Perfil atualizado com sucesso!");
        const updatedUser = { ...user, nome: nomeEditado, descricao: descricaoEditada };
        setUser(updatedUser);
        setContextUser(updatedUser); // Atualiza no contexto (e localStorage)
        setEditando(false);
      } else {
        addNotification("error", `❌ ${data.error || "Erro ao atualizar"}`);
        setMensagem(`❌ ${data.error || "Erro ao atualizar"}`);
      }
    } catch (err) {
      addNotification("error", "❌ Erro de conexão com o servidor.");
      setMensagem("❌ Erro de conexão com o servidor.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelEdit = (): void => {
    setEditando(false);
    setNomeEditado(user?.nome || "");
    setDescricaoEditada(user?.descricao || "");
    setMensagem("");
  };

  const handleLogout = (): void => {
    setUser(null);
    setContextUser(null); // Remove do contexto (e localStorage)
    setEmail("");
    setSenha("");
    setNome("");
    setDescricao("");
    setEditando(false);
    addNotification("info", "👋 Saiu da conta.");
    setMensagem("👋 Saiu da conta.");
  };

  return (
    <article className="w-full p-5 dark:bg-gray-900 transition-colors">
      <div className="pb-5">
        <PageTitle>Usuário</PageTitle>
      </div>

      <div className={`w-full rounded-2xl border-2 border-green-300 dark:border-green-700 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900 overflow-hidden p-5 shadow-lg transition-colors`}>
        {user ? (
          <div>
            {editando ? (
              // Modo de edição
              <div>
                <h3 className="text-2xl font-bold mb-5 text-green-700 dark:text-green-400">✏️ Editar Perfil</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nome Completo</label>
                    <input
                      type="text"
                      placeholder="Nome completo"
                      value={nomeEditado}
                      onChange={(e) => setNomeEditado(e.target.value)}
                      className="w-full border-2 border-green-300 dark:border-green-700 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:outline-none focus:border-green-600 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Descrição (Opcional)</label>
                    <textarea
                      placeholder="Conte um pouco sobre você, seus interesses em caminhadas..."
                      value={descricaoEditada}
                      onChange={(e) => setDescricaoEditada(e.target.value)}
                      className="w-full border-2 border-green-300 dark:border-green-700 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:outline-none focus:border-green-600 transition resize-none"
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{descricaoEditada.length}/500 caracteres</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleEdit}
                      disabled={carregando}
                      className="flex-1 bg-green-600 dark:bg-green-700 text-white rounded-lg py-3 hover:bg-green-700 dark:hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                    >
                      <Save size={18} />
                      {carregando ? "Salvando..." : "Salvar Alterações"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={carregando}
                      className="flex-1 bg-gray-400 dark:bg-gray-600 text-white rounded-lg py-3 hover:bg-gray-500 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                    >
                      <X size={18} />
                      Cancelar
                    </button>
                  </div>
                </div>
                {mensagem && <p className="text-center mt-4 text-sm font-semibold text-green-700 dark:text-green-400">{mensagem}</p>}
              </div>
            ) : (
              // Modo de visualização
              <div>
                <div className="flex items-start gap-5 pb-6 border-b-2 border-green-200 dark:border-green-700">
                  <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-600 dark:to-green-800 rounded-full shadow-md">
                    <UserRound className="text-white" size={48} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-green-700 dark:text-green-400">{user.nome}</h2>
                    <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400">
                      <Mail size={16} className="text-green-600 dark:text-green-400" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    {user.descricao && (
                      <div className="flex items-start gap-2 mt-3">
                        <FileText size={16} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">{user.descricao}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditando(true)}
                    className="flex w-full items-center justify-center text-white bg-green-600 dark:bg-green-700 px-5 py-3 cursor-pointer hover:bg-green-700 dark:hover:bg-green-600 rounded-lg transition font-semibold gap-2 shadow-md"
                  >
                    <Edit2 size={18} />
                    Editar Perfil
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center text-white bg-red-500 dark:bg-red-700 px-5 py-3 cursor-pointer hover:bg-red-600 dark:hover:bg-red-600 rounded-lg transition font-semibold gap-2 shadow-md"
                  >
                    <LogOut size={18} />
                    Sair
                  </button>
                </div>

                {mensagem && <p className="text-center mt-4 text-sm font-semibold text-green-700 dark:text-green-400">{mensagem}</p>}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">
              {modo === "login" ? "🚶 Bem-vindo ao WalkTalk" : "📝 Crie sua Conta"}
            </h3>

            <form
              onSubmit={modo === "login" ? handleLogin : handleRegister}
              className="flex flex-col gap-4"
            >
              {modo === "cadastro" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nome Completo</label>
                    <input
                      type="text"
                      placeholder="Seu nome completo"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full border-2 border-green-300 dark:border-green-700 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:outline-none focus:border-green-600 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Descrição (Opcional)</label>
                    <textarea
                      placeholder="Conte um pouco sobre você, seus interesses em caminhadas, trilhas favoritas..."
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      className="w-full border-2 border-green-300 dark:border-green-700 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:outline-none focus:border-green-600 transition resize-none"
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{descricao.length}/500 caracteres</p>
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">E-mail</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-green-300 dark:border-green-700 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:outline-none focus:border-green-600 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Senha</label>
                <input
                  type="password"
                  placeholder="Digite uma senha segura"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full border-2 border-green-300 dark:border-green-700 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:outline-none focus:border-green-600 transition"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-green-600 dark:bg-green-700 text-white rounded-lg py-3 hover:bg-green-700 dark:hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-md"
              >
                {carregando ? "Processando..." : (modo === "login" ? "🚶 Entrar" : "✅ Cadastrar")}
              </button>
            </form>

            <p className="text-sm text-center mt-5 text-gray-700 dark:text-gray-300">
              {modo === "login" ? (
                <>
                  Não tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => setModo("cadastro")}
                    className="text-green-600 dark:text-green-400 font-bold underline hover:text-green-700 dark:hover:text-green-300"
                  >
                    Cadastre-se aqui
                  </button>
                </>
              ) : (
                <>
                  Já tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => setModo("login")}
                    className="text-green-600 dark:text-green-400 font-bold underline hover:text-green-700 dark:hover:text-green-300"
                  >
                    Entre aqui
                  </button>
                </>
              )}
            </p>

            {mensagem && <p className="text-center mt-4 text-sm font-semibold text-green-700 dark:text-green-400">{mensagem}</p>}
          </div>
        )}
      </div>
    </article>
  );
};

export default UserPage;
