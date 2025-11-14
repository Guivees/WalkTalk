export interface MapConfigs {
	defaultCenter: google.maps.LatLngAltitudeLiteral;
	defaultZoom: number;
}

export interface Marker {
	title: string;
	description: string;
	lat: number;
	lng: number;
}

export type UserLocation = {
	lat: number;
	lng: number;
};
