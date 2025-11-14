import { Bell, MapPin, Users, Shield, Zap, Eye, Volume2, Download } from "lucide-react";
import { ConfigGroup } from "./components/ConfigGroup";
import { SwithConfiguration } from "./components/SwithConfiguration";
import { PageTitle } from "@/components/global/PageTitle";
import { useTheme } from "@/contexts/ThemeContext";

const ConfigPage = () => {
	const { darkMode, toggleDarkMode } = useTheme();

	return (
		<article className="w-full p-5 dark:bg-gray-900 transition-colors">
			<div className="pb-5">
				<PageTitle>Configurações</PageTitle>
			</div>

			<div className="flex flex-col gap-4">
				<ConfigGroup Icon={Bell} title="🔔 Notificações">
					<SwithConfiguration
						title="Alertas de Novas Rotas"
						description="Receba notificações quando novas rotas forem adicionadas em São Leopoldo"
					/>

					<SwithConfiguration
						title="Alertas de Eventos"
						description="Notificações sobre caminhadas e eventos da comunidade"
					/>

					<SwithConfiguration
						title="Alertas de Clima"
						description="Receba avisos sobre mudanças climáticas antes de suas caminhadas"
					/>
				</ConfigGroup>

				<ConfigGroup Icon={MapPin} title="📍 Localização e Mapa">
					<SwithConfiguration
						title="Compartilhar Localização"
						description="Permitir que amigos vejam sua localização durante caminhadas"
					/>

					<SwithConfiguration
						title="Histórico de Rotas"
						description="Salvar automaticamente as rotas que você percorre"
					/>

					<SwithConfiguration
						title="Modo Offline"
						description="Baixar mapas para usar sem conexão com internet"
					/>
				</ConfigGroup>

				<ConfigGroup Icon={Users} title="👥 Comunidade">
					<SwithConfiguration
						title="Perfil Público"
						description="Permitir que outros usuários vejam seu perfil e histórico de caminhadas"
					/>

					<SwithConfiguration
						title="Mostrar Estatísticas"
						description="Compartilhar suas estatísticas de caminhadas com a comunidade"
					/>

					<SwithConfiguration
						title="Convites de Grupos"
						description="Receber convites para participar de grupos de caminhada"
					/>
				</ConfigGroup>

				<ConfigGroup Icon={Shield} title="🔒 Privacidade e Segurança">
					<SwithConfiguration
						title="Autenticação de Dois Fatores"
						description="Ativar verificação adicional de segurança na sua conta"
					/>

					<SwithConfiguration
						title="Privacidade de Dados"
						description="Controlar quem pode ver seus dados pessoais"
					/>

					<SwithConfiguration
						title="Sincronização de Dados"
						description="Sincronizar dados entre dispositivos automaticamente"
					/>
				</ConfigGroup>

				<ConfigGroup Icon={Zap} title="⚡ Performance">
					<SwithConfiguration
						title="Modo Econômico"
						description="Reduzir o uso de bateria e dados móveis"
					/>

					<SwithConfiguration
						title="Atualizações Automáticas"
						description="Atualizar o aplicativo automaticamente quando houver novas versões"
					/>

					<SwithConfiguration
						title="Cache de Dados"
						description="Armazenar dados em cache para carregamento mais rápido"
					/>
				</ConfigGroup>

				<ConfigGroup Icon={Volume2} title="🔊 Som e Vibração">
					<SwithConfiguration
						title="Notificações Sonoras"
						description="Ativar sons para notificações de eventos"
					/>

					<SwithConfiguration
						title="Vibração"
						description="Ativar vibração para alertas importantes"
					/>

					<SwithConfiguration
						title="Sons de Navegação"
						description="Reproduzir sons durante a navegação de rotas"
					/>
				</ConfigGroup>

				<ConfigGroup Icon={Eye} title="👁️ Aparência">
					<div className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600 transition">
						<div className="flex-1">
							<h3 className="font-semibold text-gray-800 dark:text-gray-100">Modo Escuro</h3>
							<span className="text-sm text-gray-600 dark:text-gray-400">Ativar tema escuro para melhor conforto visual</span>
						</div>

						<button
							onClick={toggleDarkMode}
							className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
								darkMode
									? "bg-green-600"
									: "bg-gray-300"
							}`}
						>
							<span
								className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
									darkMode ? "translate-x-7" : "translate-x-1"
								}`}
							/>
						</button>
					</div>

					<SwithConfiguration
						title="Letras Maiores"
						description="Aumentar o tamanho das fontes para melhor legibilidade"
					/>

					<SwithConfiguration
						title="Contraste Alto"
						description="Aumentar o contraste das cores para melhor acessibilidade"
					/>
				</ConfigGroup>

				<ConfigGroup Icon={Download} title="💾 Dados e Armazenamento">
					<SwithConfiguration
						title="Baixar Dados de Backup"
						description="Fazer backup de seus dados pessoais"
					/>

					<SwithConfiguration
						title="Limpar Cache"
						description="Limpar dados em cache para liberar espaço"
					/>

					<SwithConfiguration
						title="Exportar Histórico"
						description="Exportar seu histórico de caminhadas em formato CSV"
					/>
				</ConfigGroup>
			</div>
		</article>
	);
};

export default ConfigPage;
