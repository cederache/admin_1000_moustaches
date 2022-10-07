const API_URL = process.env.REACT_APP_API_URL;

class SpeciesManager {
    static getAll = () => {
        return fetch(`${API_URL}/species`, { method: "GET" })
            .then((response) => response.json())
            .catch((err) => {
                console.log(err);
            });
    };

    static getById = (id) => {
        return fetch(`${API_URL}/species/${id}`, { method: "GET" })
            .then((response) => response.json())
            .catch((err) => {
                console.log(err);
            });
    };
}

export default SpeciesManager;
