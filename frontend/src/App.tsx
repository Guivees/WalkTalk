import { BrowserRouter, Route, Routes } from "react-router";
import { APIProvider } from "@vis.gl/react-google-maps";
import HomePage from "./pages/home";
import Header from "@/components/global/Header";
import { Toaster } from "react-hot-toast";
import NewsPage from "./pages/news";
import ConfigPage from "./pages/config";
import UserPage from "./pages/user";
import AdminPage from "./pages/admin";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationCenter } from "./components/global/NotificationCenter";

interface User {
  id: number;
  nome: string;
  email: string;
  descricao?: string;
  cidade?: string;
  foto?: string;
  is_admin?: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("walktalk_user");
    if (savedUser) {
      try {
        setUserState(JSON.parse(savedUser));
      } catch (err) {
        console.error("Erro ao carregar usuário do localStorage:", err);
        localStorage.removeItem("walktalk_user");
      }
    }
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("walktalk_user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("walktalk_user");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

function App() {
	return (
		<ThemeProvider>
			<UserProvider>
				<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
					<BrowserRouter>
						<Toaster />
						<NotificationCenter />

						<main className="min-h-screen bg-background dark:bg-gray-900 transition-colors">
							<Header />

								<Routes>
									<Route path="/" element={<HomePage />} />
									<Route path="/news" element={<NewsPage />} />
									<Route path="/user" element={<UserPage />} />
									<Route path="/config" element={<ConfigPage />} />
									<Route path="/admin" element={<AdminPage />} />
								</Routes>
						</main>
					</BrowserRouter>
				</APIProvider>
			</UserProvider>
		</ThemeProvider>
	);
}

export default App;
