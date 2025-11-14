import { AdvancedMarker } from "@vis.gl/react-google-maps";
import type { UserLocation } from "../types";

export const UserLocationMarker = (props: UserLocation) => {
	return (
		<AdvancedMarker position={{ lat: props.lat, lng: props.lng }}>
			<div className="w-6 h-6 rounded-full bg-blue-400 border-gray-300 border-2"></div>
		</AdvancedMarker>
	);
};
