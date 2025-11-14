import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  notifications: Notification[];
  addNotification: (type: Notification["type"], message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Carregar modo escuro do localStorage ao iniciar
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("walktalk_darkmode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Aplicar classe de modo escuro ao documento
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("walktalk_darkmode", JSON.stringify(newDarkMode));
  };

  const addNotification = (
    type: Notification["type"],
    message: string,
    duration: number = 4000
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    const notification: Notification = { id, type, message, duration };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
