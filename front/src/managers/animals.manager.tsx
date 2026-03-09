import Animal from "../logic/entities/Animal";
import Species from "../logic/entities/Species";
import AnimalToHostFamily from "../logic/entities/AnimalToHostFamily";
import AnimalDTO from "../logic/dto/AnimalDTO";
import HostFamilyRelationDTO from "../logic/dto/AnimalToHostFamilyDTO";
import SpeciesDTO from "../logic/dto/SpeciesDTO";
import fetchWithAuth from "../middleware/fetch-middleware";

const API_URL = import.meta.env.VITE_API_URL;

export interface Sexe {
    key: string;
    value: string;
}

class AnimalsManager {
    static createAnimal = () => {
        return new Animal();
    };

    static format = (animal: any) => {
        return new AnimalDTO(animal).toEntity();
    };

    static formatForServer = (animal: Animal) => {
        if (animal.deathDate === "") {
            animal.deathDate = undefined;
        }

        const dto = new AnimalDTO(animal);
        const { hostFamilyRelations, ...rest } = dto;
        return {
            ...rest,
        };
    };

    static getAll = (): Promise<Animal[]> => {
        return fetchWithAuth(`${API_URL}/animals`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((animals) => animals.map(AnimalsManager.format));
    };

    static getById = (id: number): Promise<Animal> => {
        return fetchWithAuth(`${API_URL}/animals/${id}`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((animal) => new AnimalDTO(animal).toEntity());
    };

    static getByHostFamilyId = (hostFamilyId: number): Promise<AnimalToHostFamily[]> => {
        return fetchWithAuth(`${API_URL}/animal-host-families/hostFamily/${hostFamilyId}`, { method: "GET" })
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
                return athfs.map((athf: any) => new HostFamilyRelationDTO(athf).toEntity());
            });
    };

    static getSpecies = (): Promise<Species[]> => {
        return fetchWithAuth(`${API_URL}/species`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((species) => species.map((species: any) => new SpeciesDTO(species).toEntity()));
    };

    static getSexes = (): Promise<Sexe[]> => {
        return Promise.resolve([
            { key: "male", value: "Male" },
            { key: "female", value: "Femelle" },
        ]);
    };

    static create = (animal: Animal): Promise<Animal> => {
        const animalToUpload = this.formatForServer(animal);
        return fetchWithAuth(`${API_URL}/animals`, {
            method: "POST",
            body: JSON.stringify(animalToUpload),
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
            .then((animal) => new AnimalDTO(animal).toEntity());
    };

    static update = (animal: Animal): Promise<Animal> => {
        const animalToUpload = this.formatForServer(animal);
        return fetchWithAuth(`${API_URL}/animals/${animalToUpload.id}`, {
            method: "PUT",
            body: JSON.stringify(animalToUpload),
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
            .then((animal) => new AnimalDTO(animal).toEntity());
    };

    static delete = (animal: Animal) => {
        return fetchWithAuth(`${API_URL}/animals/${animal.id}`, {
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

export default AnimalsManager;
