const GEOAPPIFY_API_KEY = process.env.REACT_APP_GEOAPPIFY_API_KEY;

class Geocode {
    static getCoordinatesFromAddress = (address) => {
        return fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${GEOAPPIFY_API_KEY}`,
            { method: "GET" }
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((resp) => {
                if (resp.features.length > 0) {
                    return resp.features[0].geometry.coordinates;
                }
                return null;
            });
    };
}

export default Geocode;
