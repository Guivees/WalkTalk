import {
	AdvancedMarker,
	InfoWindow,
	useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import type { Marker as MarkerType } from "../types";

import markerIcon from "@/assets/marker.svg";

interface Props extends MarkerType {
	isVisible: boolean;
	onClick: () => void;
	onTraceRoute: () => void;
}

export const PointMarker = ({
	lat,
	lng,
	isVisible,
	title,
	description,
	onClick,
	onTraceRoute,
}: Props) => {
	const [markerRef, marker] = useAdvancedMarkerRef();

	return (
		<>
			<AdvancedMarker
				key={title}
				ref={markerRef}
				position={{ lat, lng }}
				className="animate-[dropMarker_0.3s_linear_forwards]"
			>
				<button type="button" onClick={onClick}>
					<img
						src={markerIcon}
						alt="marker-icon"
						width={40}
						height={40}
						className="relative -z-50"
					/>
				</button>
			</AdvancedMarker>

			{isVisible && (
				<InfoWindow anchor={marker}>
					<div className="w-60 px-2 pb-3 bg-white">
						<h2 className="font-medium">{title}</h2>
						<p className="mt-2.5">{description}</p>

						<button
							type="button"
							className="mt-3 bg-secundary px-3 py-1 rounded-md cursor-pointer text-white transition-colors duration-500 hover:bg-primary"
							onClick={onTraceRoute}
						>
							Traçar rota
						</button>
					</div>
				</InfoWindow>
			)}
		</>
	);
};
