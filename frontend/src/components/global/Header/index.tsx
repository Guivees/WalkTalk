import {
	HomeIcon,
	NewspaperIcon,
	SettingsIcon,
	UserRoundIcon,
	Moon,
	Sun,
	Shield,
} from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/App";

const Header = () => {
	const { darkMode, toggleDarkMode } = useTheme();
	const { user } = useUser();

	return (
		<header className="px-5 py-3.5 bg-gradient-to-r from-green-600 to-green-700 dark:from-gray-800 dark:to-gray-900 shadow-lg transition-colors">
			<nav className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="text-white font-bold text-lg">🚶 WalkTalk</div>
					{user?.is_admin && (
						<span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
							👑 ADMIN
						</span>
					)}
				</div>

				<div className={`grid gap-3 ${user?.is_admin ? "grid-cols-6" : "grid-cols-5"}`}>
					<Link to="/">
						<div className="bg-green-500 dark:bg-gray-700 hover:bg-green-600 dark:hover:bg-gray-600 rounded-md h-10 flex justify-center items-center text-white transition-colors shadow-md">
							<HomeIcon size={20} />
						</div>
					</Link>

					<Link to="/user">
						<div className="bg-green-500 dark:bg-gray-700 hover:bg-green-600 dark:hover:bg-gray-600 rounded-md h-10 flex justify-center items-center text-white transition-colors shadow-md">
							<UserRoundIcon size={20} />
						</div>
					</Link>

					<Link to="/config">
						<div className="bg-green-500 dark:bg-gray-700 hover:bg-green-600 dark:hover:bg-gray-600 rounded-md h-10 flex justify-center items-center text-white transition-colors shadow-md">
							<SettingsIcon size={20} />
						</div>
					</Link>

					<Link to="/news">
						<div className="bg-green-500 dark:bg-gray-700 hover:bg-green-600 dark:hover:bg-gray-600 rounded-md h-10 flex justify-center items-center text-white transition-colors shadow-md">
							<NewspaperIcon size={20} />
						</div>
					</Link>

					{user?.is_admin && (
						<Link to="/admin">
							<div className="bg-yellow-500 dark:bg-yellow-700 hover:bg-yellow-600 dark:hover:bg-yellow-600 rounded-md h-10 flex justify-center items-center text-white transition-colors shadow-md" title="Painel de Admin">
								<Shield size={20} />
							</div>
						</Link>
					)}

					<button
						onClick={toggleDarkMode}
						className="bg-green-500 dark:bg-gray-700 hover:bg-green-600 dark:hover:bg-gray-600 rounded-md h-10 flex justify-center items-center text-white transition-colors shadow-md"
						title={darkMode ? "Modo Claro" : "Modo Escuro"}
					>
						{darkMode ? <Sun size={20} /> : <Moon size={20} />}
					</button>
				</div>
			</nav>
		</header>
	);
};

export default Header;
