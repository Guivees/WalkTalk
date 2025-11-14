import {
	AdvancedMarker,
	Map as MapComponent,
	useMap,
	useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { PointMarker } from "./components/PointMarker";
import type { MapConfigs, Marker as MarkerType, UserLocation } from "./types";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { UserLocationMarker } from "./components/UserLocationMarker";
import { PageTitle } from "@/components/global/PageTitle";

const CONFIGS: MapConfigs = {
	defaultCenter: {
		lat: -29.7589,
		lng: -51.3273,
		altitude: 0,
	},
	defaultZoom: 14,
};

// Rotas padrão (fallback)
const DEFAULT_MARKERS: MarkerType[] = [
	{
		lat: -29.7589,
		lng: -51.3273,
		title: "Centro de São Leopoldo",
		description: "Centro da cidade com comércio e serviços",
	},
	{
		lat: -29.7512,
		lng: -51.3456,
		title: "Parque da Matriz",
		description: "Parque histórico com a Igreja Matriz",
	},
	{
		lat: -29.7645,
		lng: -51.3189,
		title: "Museu de Arte",
		description: "Museu com acervo de arte local e regional",
	},
	{
		lat: -29.7734,
		lng: -51.3401,
		title: "Parque do Bom Retiro",
		description: "Área verde com trilhas e natureza",
	},
	{
		lat: -29.7456,
		lng: -51.3145,
		title: "Biblioteca Pública",
		description: "Biblioteca municipal com acervo diverso",
	},
];

const requestUserLocation = () => {
	const promise = new Promise<UserLocation>((resolve, reject) => {
		navigator.geolocation.getCurrentPosition((position) => {
			resolve({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			});
		}, reject);
	});

	return promise;
};

const HomePage = () => {
	// Data
	const hasRequestedLocation = useRef(false);
	const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
	const [focusedMarker, setFocusedMarker] = useState<string | undefined>();
	const [markers, setMarkers] = useState<MarkerType[]>(DEFAULT_MARKERS);
	const [loading, setLoading] = useState(true);

	// Dependecies
	const map = useMap("home-map");
	const routesLibrary = useMapsLibrary("routes");

	const directionsServiceRef = useRef<google.maps.DirectionsService>(null);
	const directionsRendererRef = useRef<google.maps.DirectionsRenderer>(null);

	// Carregar rotas do banco de dados
	useEffect(() => {
		const fetchRoutes = async () => {
			try {
				const res = await fetch("http://localhost:5000/api/routes");
				const data = await res.json();
				
				if (Array.isArray(data) && data.length > 0) {
					const convertedMarkers: MarkerType[] = data.map((route: any) => ({
						lat: parseFloat(route.latitude),
						lng: parseFloat(route.longitude),
						title: route.title,
						description: route.description || "",
					}));
					setMarkers(convertedMarkers);
				} else {
					setMarkers(DEFAULT_MARKERS);
				}
			} catch (err) {
				console.error("Erro ao carregar rotas:", err);
				setMarkers(DEFAULT_MARKERS);
			} finally {
				setLoading(false);
			}
		};

		fetchRoutes();
	}, []);

	// Verify dependencies
	useEffect(() => {
		if (!map || !routesLibrary) return;

		const directionsService = new routesLibrary.DirectionsService();
		const directionsRenderer = new routesLibrary.DirectionsRenderer({
			suppressMarkers: true,
			polylineOptions: {
				strokeColor: "#3b7200",
				strokeWeight: 5,
				strokeOpacity: 1,
			},
		});
		directionsRenderer.setMap(map);

		directionsServiceRef.current = directionsService;
		directionsRendererRef.current = directionsRenderer;
	}, [map, routesLibrary]);

	// Get user location
	useEffect(() => {
		const getCurrentPosition = async () => {
			hasRequestedLocation.current = true;

			const request = requestUserLocation();

			const response = await toast.promise(request, {
				loading: "Carregando localização atual.",
				success: "Pronto.",
				error: "Não foi possível recuperar a localização atual.",
			});

			setUserLocation(response);
			map?.setCenter({ lat: response.lat, lng: response.lng });
		};

		if (hasRequestedLocation.current || !map) return;

		getCurrentPosition();
	}, [map]);

	const toggleMarkerVisibility = (title: string) => {
		focusedMarker === title
			? setFocusedMarker(undefined)
			: setFocusedMarker(title);
	};

	const traceRoute = ({
		lat,
		lng,
		title,
	}: google.maps.LatLngLiteral & { title: string }) => {
		if (!userLocation) {
			return toast.error(
				"Sem localização atual do usuário, verifique as permissões e requerimentos do seu dispositivo.",
			);
		}

		const request: google.maps.DirectionsRequest = {
			origin: userLocation,
			destination: { lat, lng },
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false,
		};

		if (!directionsServiceRef.current || !directionsRendererRef.current) {
			return toast.error("Algo deu errado");
		}

		const promise = directionsServiceRef.current.route(
			request,
			(result, status) => {
				if (status === "OK") {
					directionsRendererRef.current?.setDirections(result);
				} else {
					toast.error("A rota não pôde ser traçada.");
				}
			},
		);

		toast.promise(promise, {
			loading: `Traçando caminho para ${title}`,
			success: `Rota traçada para ${title} com sucesso`,
			error: "Houve um erro ao traçar a rota",
		});
	};

	return (
		<article className="w-full pt-5">
			<div className="pl-5 mb-4">
				<PageTitle>
					🗺️ Rotas <span className="text-green-600">Disponíveis</span>
				</PageTitle>
				<p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Explore as trilhas e pontos turísticos de São Leopoldo ({markers.length} rotas)</p>
			</div>

			<div className="bg-gradient-to-r from-green-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-3 shadow-lg border-2 border-green-300 dark:border-green-700 mb-4">
				{loading ? (
					<div className="w-full h-96 rounded-xl flex items-center justify-center bg-gray-200 dark:bg-gray-700">
						<p className="text-gray-600 dark:text-gray-400">Carregando rotas...</p>
					</div>
				) : (
					<MapComponent
						id={"home-map"}
						mapId={"home-map"}
						className="w-full h-96 rounded-xl"
						defaultCenter={CONFIGS.defaultCenter}
						defaultZoom={CONFIGS.defaultZoom}
						gestureHandling="greedy"
					>
						{markers.map(({ title, description, lat, lng }) => (
							<PointMarker
								key={title}
								{...{ title, description, lat, lng }}
								isVisible={focusedMarker === title}
								onClick={() => toggleMarkerVisibility(title)}
								onTraceRoute={() => {
									traceRoute({ lat, lng, title });
								}}
							/>
						))}

						{userLocation && (
							<UserLocationMarker lat={userLocation.lat} lng={userLocation.lng} />
						)}
					</MapComponent>
				)}
			</div>
		</article>
	);
};

export default HomePage;
