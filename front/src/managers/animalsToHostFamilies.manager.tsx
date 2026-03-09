import AnimalToHostFamily from "../logic/entities/AnimalToHostFamily";
import AnimalToHostFamilyDTO from "../logic/dto/AnimalToHostFamilyDTO";
import fetchWithAuth from "../middleware/fetch-middleware";
import Animal from "../logic/entities/Animal";
import HostFamily from "../logic/entities/HostFamily";

const API_URL = import.meta.env.VITE_API_URL;

class AnimalsToHostFamiliesManager {
    static createAnimalToHostFamily = (animal?: Animal, hostFamily?: HostFamily) => {
        return new AnimalToHostFamily(undefined, animal, hostFamily);
    };

    static format = (animalToHostFamily: AnimalToHostFamily) => {
        return AnimalToHostFamily.copy(animalToHostFamily);
    };

    static formatForServer = (animalToHostFamily: AnimalToHostFamily) => {
        const dto = new AnimalToHostFamilyDTO(animalToHostFamily);

        return {
            id: dto.id,
            entryDate: dto.entryDate,
            exitDate: dto.exitDate,
            animal: {
                id: dto.animal?.id,
            },
            hostFamily: {
                id: dto.hostFamily?.id,
            },
        };
    };

    static getByAnimalId = (id: number) => {
        return fetchWithAuth(`${API_URL}/animal-host-families/animal/${id}`, {
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
            .then((athfs) => athfs.map((athf: any) => new AnimalToHostFamilyDTO(athf).toEntity()));
    };

    static getByHostFamilyId = (id: number) => {
        return fetchWithAuth(`${API_URL}/animal-host-families/hostFamily/${id}`, {
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
            .then((data) => {
                const athfs = Array.isArray(data) ? data : data ? [data] : [];
                return athfs.map((athf: any) => new AnimalToHostFamilyDTO(athf).toEntity());
            });
    };

    static create = (animalToHostFamily: AnimalToHostFamily) => {
        const animalToHostFamilyToUpload = this.formatForServer(animalToHostFamily);
        return fetchWithAuth(`${API_URL}/animal-host-families`, {
            method: "POST",
            body: JSON.stringify(animalToHostFamilyToUpload),
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
            .then(AnimalsToHostFamiliesManager.format);
    };

    static update = (animalToHostFamily: AnimalToHostFamily) => {
        const animalToHostFamilyToUpload = this.formatForServer(animalToHostFamily);
        return fetchWithAuth(`${API_URL}/animal-host-families/${animalToHostFamily.id}`, {
            method: "PUT",
            body: JSON.stringify(animalToHostFamilyToUpload),
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
            .then(AnimalsToHostFamiliesManager.format);
    };

    static delete = (animalToHostFamily: AnimalToHostFamily) => {
        return fetchWithAuth(`${API_URL}/animal-host-families/${animalToHostFamily.id}`, {
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

export default AnimalsToHostFamiliesManager;
