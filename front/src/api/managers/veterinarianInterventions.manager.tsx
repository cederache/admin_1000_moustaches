import VeterinarianInterventionDTO from "../../logic/dto/VeterinarianInterventionDTO";
import VeterinarianIntervention from "../../logic/entities/VeterinarianIntervention";
import fetchWithAuth from "../../middleware/fetch-middleware";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/veterinarian-interventions`;

class VeterinarianInterventionsManager {
    static createVeterinarianIntervention = (): VeterinarianIntervention => {
        return new VeterinarianIntervention();
    };

    static format = (vetInter: any): VeterinarianIntervention => {
        return new VeterinarianInterventionDTO(vetInter).toEntity();
    };

    static formatForServer = (vetInter: VeterinarianIntervention) => {
        return new VeterinarianInterventionDTO(vetInter);
    };

    static getAll = () => {
        return fetchWithAuth(BASE_URL, {
            method: "GET",
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((vetInters) => vetInters.map(VeterinarianInterventionsManager.format));
    };

    static getById = (id: number) => {
        return fetchWithAuth(`${BASE_URL}/${id}`, {
            method: "GET",
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then(VeterinarianInterventionsManager.format);
    };

    static getByAnimalId = (animalId: number) => {
        return fetchWithAuth(`${BASE_URL}/animal/${animalId}`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((vetInters) => vetInters.map(VeterinarianInterventionsManager.format) as VeterinarianIntervention[]);
    };

    static create = (vetInter: VeterinarianIntervention) => {
        const vetInterToUpload = this.formatForServer(vetInter);
        return fetchWithAuth(BASE_URL, {
            method: "POST",
            body: JSON.stringify(vetInterToUpload),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.status === 201) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then(VeterinarianInterventionsManager.format);
    };

    static update = (vetInter: VeterinarianIntervention) => {
        const vetInterToUpload = this.formatForServer(vetInter);
        return fetchWithAuth(`${BASE_URL}/${vetInter.id}`, {
            method: "PUT",
            body: JSON.stringify(vetInterToUpload),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then(VeterinarianInterventionsManager.format);
    };

    static delete = (vetInter: VeterinarianIntervention) => {
        return fetchWithAuth(`${BASE_URL}/${vetInter.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            if (response.status === 204) {
                return true;
            }
            return response.json().then((json) => {
                throw new Error(`Server error - ${json.message}`);
            });
        });
    };
}

export default VeterinarianInterventionsManager;
