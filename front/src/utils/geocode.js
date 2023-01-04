class Geocode {
    static getCoordinatesFromAddress = (address) => {
        return fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=37cb35014fea4b2ab2ca2ee35d3ec815`,
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
