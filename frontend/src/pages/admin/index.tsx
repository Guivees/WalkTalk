import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save, MapPin } from "lucide-react";
import { PageTitle } from "@/components/global/PageTitle";
import { useUser } from "@/App";
import { useTheme } from "@/contexts/ThemeContext";

interface Route {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

const API_URL = "http://localhost:5000/api/routes";

const AdminPage: React.FC = () => {
  const { user } = useUser();
  const { darkMode, addNotification } = useTheme();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  // Carregar rotas ao iniciar
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      // Converter latitude e longitude para números
      const convertedRoutes = data.map((route: any) => ({
        ...route,
        latitude: parseFloat(route.latitude),
        longitude: parseFloat(route.longitude),
      }));
      setRoutes(convertedRoutes);
    } catch (err) {
      addNotification("error", "❌ Erro ao carregar rotas");
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.latitude || !formData.longitude) {
      addNotification("error", "❌ Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          userId: user?.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        addNotification(
          "success",
          editingId
            ? "✅ Rota atualizada com sucesso!"
            : "✅ Rota criada com sucesso!"
        );
        setFormData({ title: "", description: "", latitude: "", longitude: "" });
        setEditingId(null);
        setShowForm(false);
        fetchRoutes();
      } else {
        addNotification("error", `❌ ${data.error || "Erro ao salvar rota"}`);
      }
    } catch (err) {
      addNotification("error", "❌ Erro de conexão com o servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (route: Route) => {
    setFormData({
      title: route.title,
      description: route.description,
      latitude: route.latitude.toString(),
      longitude: route.longitude.toString(),
    });
    setEditingId(route.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar esta rota?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });

      const data = await res.json();

      if (res.ok) {
        addNotification("success", "✅ Rota deletada com sucesso!");
        fetchRoutes();
      } else {
        addNotification("error", `❌ ${data.error || "Erro ao deletar rota"}`);
      }
    } catch (err) {
      addNotification("error", "❌ Erro de conexão com o servidor");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: "", description: "", latitude: "", longitude: "" });
  };

  // Verificar se o usuário é admin
  if (!user || !user.is_admin) {
    return (
      <article className="w-full p-5 dark:bg-gray-900 transition-colors">
        <div className="pb-5">
          <PageTitle>Admin</PageTitle>
        </div>
        <div className="w-full rounded-2xl border-2 border-red-300 dark:border-red-700 bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg">
          <p className="text-center text-red-700 dark:text-red-400 font-semibold">
            🔒 Acesso negado. Apenas administradores podem acessar esta página.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="w-full p-5 dark:bg-gray-900 transition-colors">
      <div className="pb-5 flex items-center justify-between">
        <PageTitle>🛠️ Painel de Admin</PageTitle>
        <button
          onClick={() => {
            if (showForm) {
              handleCancel();
            } else {
              setShowForm(true);
            }
          }}
          className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition flex items-center gap-2 font-semibold"
        >
          <Plus size={18} />
          {showForm ? "Fechar Formulário" : "Nova Rota"}
        </button>
      </div>

      {showForm && (
        <div className="w-full rounded-2xl border-2 border-green-300 dark:border-green-700 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg mb-5">
          <h3 className="text-2xl font-bold mb-5 text-green-700 dark:text-green-400">
            {editingId ? "✏️ Editar Rota" : "➕ Nova Rota"}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Título da Rota *
              </label>
              <input
                type="text"
                placeholder="Ex: Parque do Bom Retiro"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border-2 border-green-300 dark:border-green-700 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:outline-none focus:border-green-600 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Descrição (Opcional)
              </label>
              <textarea
                placeholder="Descrição detalhada da rota..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border-2 border-green-300 dark:border-green-700 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:outline-none focus:border-green-600 transition resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  placeholder="-29.7589"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  className="w-full border-2 border-green-300 dark:border-green-700 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:outline-none focus:border-green-600 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  placeholder="-51.3273"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  className="w-full border-2 border-green-300 dark:border-green-700 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:outline-none focus:border-green-600 transition"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 dark:bg-green-700 text-white rounded-lg py-3 hover:bg-green-700 dark:hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                <Save size={18} />
                {loading ? "Salvando..." : "Salvar Rota"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-400 dark:bg-gray-600 text-white rounded-lg py-3 hover:bg-gray-500 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 font-semibold"
              >
                <X size={18} />
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="w-full rounded-2xl border-2 border-green-300 dark:border-green-700 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900 overflow-hidden shadow-lg">
        <div className="p-5">
          <h3 className="text-2xl font-bold mb-5 text-green-700 dark:text-green-400">
            📍 Rotas Cadastradas ({routes.length})
          </h3>

          {routes.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-10">
              Nenhuma rota cadastrada ainda. Crie a primeira!
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="flex items-start justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-green-600 dark:text-green-400" />
                      <h4 className="font-bold text-gray-800 dark:text-gray-100">
                        {route.title}
                      </h4>
                    </div>
                    {route.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {route.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      📌 Lat: {route.latitude.toFixed(4)} | Long:{" "}
                      {route.longitude.toFixed(4)}
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(route)}
                      className="bg-blue-500 dark:bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-600 transition"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="bg-red-500 dark:bg-red-700 text-white p-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-600 transition"
                      title="Deletar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default AdminPage;
