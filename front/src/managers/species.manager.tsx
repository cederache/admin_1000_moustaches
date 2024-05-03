import SpeciesDTO from "../logic/dto/SpeciesDTO";
import Species from "../logic/entities/Species";
import fetchWithAuth from "../middleware/fetch-middleware";

const API_URL = import.meta.env.VITE_API_URL;

class SpeciesManager {
    static format = (species: any): Species => {
        return new SpeciesDTO(species).toEntity();
    };

    static getAll = (): Promise<Species[]> => {
        return fetchWithAuth(`${API_URL}/species`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((species) => species.map(SpeciesManager.format));
    };

    static getById = (id: number): Promise<Species> => {
        return fetchWithAuth(`${API_URL}/species/${id}`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then(SpeciesManager.format);
    };
}

export default SpeciesManager;
