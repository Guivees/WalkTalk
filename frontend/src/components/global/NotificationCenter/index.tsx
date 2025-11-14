import { useTheme } from "@/contexts/ThemeContext";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export const NotificationCenter = () => {
  const { notifications, removeNotification, darkMode } = useTheme();

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      case "error":
        return <AlertCircle className="text-red-500" size={20} />;
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case "info":
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return darkMode
          ? "bg-green-900 border-green-700"
          : "bg-green-50 border-green-200";
      case "error":
        return darkMode
          ? "bg-red-900 border-red-700"
          : "bg-red-50 border-red-200";
      case "warning":
        return darkMode
          ? "bg-yellow-900 border-yellow-700"
          : "bg-yellow-50 border-yellow-200";
      case "info":
      default:
        return darkMode
          ? "bg-blue-900 border-blue-700"
          : "bg-blue-50 border-blue-200";
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case "success":
        return darkMode ? "text-green-200" : "text-green-800";
      case "error":
        return darkMode ? "text-red-200" : "text-red-800";
      case "warning":
        return darkMode ? "text-yellow-200" : "text-yellow-800";
      case "info":
      default:
        return darkMode ? "text-blue-200" : "text-blue-800";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 p-4 rounded-lg border-l-4 shadow-lg animate-in fade-in slide-in-from-right-full duration-300 ${getBackgroundColor(
            notification.type
          )} ${getTextColor(notification.type)}`}
        >
          {getIcon(notification.type)}
          <p className="flex-1 text-sm font-medium">{notification.message}</p>
          <button
            onClick={() => removeNotification(notification.id)}
            className="hover:opacity-70 transition"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};
