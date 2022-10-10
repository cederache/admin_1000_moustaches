const API_URL = process.env.REACT_APP_API_URL;

class SpeciesManager {
    static getAll = () => {
        return fetch(`${API_URL}/species`, { method: "GET" }).then(
            (response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            }
        );
    };

    static getById = (id) => {
        return fetch(`${API_URL}/species/${id}`, { method: "GET" }).then(
            (response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            }
        );
    };
}

export default SpeciesManager;
