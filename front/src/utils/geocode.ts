import { LatLng } from "leaflet";

const GEOAPPIFY_API_KEY = import.meta.env.VITE_GEOAPPIFY_API_KEY;

class Geocode {
    static getCoordinatesFromAddress = (address: string): Promise<LatLng | null> => {
        return fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${GEOAPPIFY_API_KEY}`,
            { method: "GET" }
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((resp) => {
                if (resp.features.length > 0) {
                    return new LatLng(resp.features[0].geometry.coordinates[1], resp.features[0].geometry.coordinates[0]);
                }
                return null;
            });
    };
}

export default Geocode;
