const API_URL = process.env.REACT_APP_API_URL;

class SpeciesManager {
    static getAll = () => {
        return fetch(`${API_URL}/species`, { method: "GET" }).then(
            (response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            }
        );
    };

    static getById = (id) => {
        return fetch(`${API_URL}/species/${id}`, { method: "GET" }).then(
            (response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            }
        );
    };
}

export default SpeciesManager;
