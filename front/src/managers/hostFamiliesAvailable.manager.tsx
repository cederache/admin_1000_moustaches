import SpeciesCountsDTO from "../logic/dto/SpeciesCountsDTO";
import SpeciesCounts, { CountBySpecies } from "../logic/entities/SpeciesCounts";
import fetchWithAuth from "../middleware/fetch-middleware";

const API_URL = import.meta.env.VITE_API_URL;

class hostFamiliesAvailabledManager {
    static format = (animalsCount: SpeciesCounts) => {
        return animalsCount;
    };

    static getAll = (): Promise<SpeciesCounts> => {
        return fetchWithAuth(`${API_URL}/count-hostfamilies-available`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((data) => {
                // Transformer les propriétés avec majuscules en propriétés avec minuscules
                return new SpeciesCountsDTO(data).toEntity();
            });
    };
}

export default hostFamiliesAvailabledManager;
