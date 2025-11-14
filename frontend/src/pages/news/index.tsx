import { Footprints, Mountain, Trees, Users, MapPin, Calendar } from "lucide-react";
import { NewsComponent } from "./components/NewsComponent";
import { PageTitle } from "@/components/global/PageTitle";

const NewsPage = () => {
	return (
		<article className="w-full p-5">
			<div className="pb-5">
				<PageTitle>Notícias</PageTitle>
			</div>

			<div className="flex flex-col gap-4">
				<NewsComponent
					Icon={Footprints}
					title="🥾 Grande Caminhada em São Leopoldo - Próximo Fim de Semana"
					description="Prepare-se para uma experiência inesquecível! A próxima grande caminhada em São Leopoldo acontecerá no próximo fim de semana, com saída do Centro da cidade. Vamos explorar as trilhas do Parque do Bom Retiro e apreciar a beleza natural da região. Inscrições abertas para todos os níveis de dificuldade. Leve água, protetor solar e calçado confortável!"
				/>

				<NewsComponent
					Icon={Mountain}
					title="⛰️ Trilha Histórica: Parque da Matriz - Uma Jornada pelo Passado"
					description="Descubra a história de São Leopoldo através de uma caminhada especial pelo Parque da Matriz. Este passeio guiado oferece informações sobre a Igreja Matriz histórica e os pontos turísticos ao redor. A trilha é de fácil acesso e perfeita para famílias. Duração aproximada: 2 horas. Próxima saída: sábado às 9h da manhã."
				/>

				<NewsComponent
					Icon={Trees}
					title="🌲 Preservação da Natureza: Projeto de Reflorestamento em São Leopoldo"
					description="A comunidade de caminhantes de São Leopoldo está se unindo para um projeto de reflorestamento nas áreas verdes da cidade. Voluntários são bem-vindos para participar de atividades de plantio e manutenção das trilhas. Juntos, estamos criando um ambiente mais saudável para futuras gerações explorarem. Participe e faça a diferença!"
				/>

				<NewsComponent
					Icon={Users}
					title="👥 Comunidade WalkTalk Cresce: Conheça Novos Membros"
					description="Nossa comunidade de caminhantes continua crescendo! Este mês, recebemos mais de 50 novos membros interessados em explorar as belezas naturais de São Leopoldo. Cada membro traz suas próprias histórias e experiências. Estamos criando um espaço seguro e acolhedor para todos compartilharem suas paixões por caminhadas e natureza."
				/>

				<NewsComponent
					Icon={MapPin}
					title="📍 Novo Ponto de Interesse: Biblioteca Pública e Seu Entorno"
					description="A Biblioteca Pública de São Leopoldo agora faz parte de nossa rede de pontos de interesse para caminhantes. Localizada em uma área tranquila, oferece um ótimo ponto de parada para descanso e exploração cultural. Visite a biblioteca, aproveite o ambiente, e continue sua caminhada pelos arredores descobrindo novos caminhos e paisagens."
				/>

				<NewsComponent
					Icon={Calendar}
					title="📅 Calendário de Eventos - Caminhadas Semanais"
					description="Confira nosso calendário de eventos para as próximas semanas! Temos caminhadas programadas para todos os dias da semana, com diferentes níveis de dificuldade e durações. De caminhadas rápidas de 30 minutos a expedições de dia inteiro, há algo para todos. Acompanhe o WalkTalk para não perder nenhum evento!"
				/>
			</div>
		</article>
	);
};

export default NewsPage;
