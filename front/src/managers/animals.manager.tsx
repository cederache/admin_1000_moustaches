import Animal from "../logic/entities/Animal";
import Species from "../logic/entities/Species";
import AnimalToHostFamily from "../logic/entities/AnimalToHostFamily";
import AnimalDTO from "../logic/dto/AnimalDTO";
import AnimalToHostFamilyDTO from "../logic/dto/AnimalToHostFamilyDTO";
import SpeciesDTO from "../logic/dto/SpeciesDTO";

const API_URL = process.env.REACT_APP_API_URL;

export interface Sexe {
    key: string;
    value: string;
}

class AnimalsManager {
    static createAnimal = (): Animal => {
        return new Animal();
    };

    static format = (animal: any): Animal => {
        return new AnimalDTO(animal).toEntity();
    };

    static formatForServer = (animal: Animal): Animal => {
        return animal;
    };

    static getAll = (): Promise<Animal[]> => {
        return fetch(`${API_URL}/animals`, { method: "GET" })
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
        return fetch(`${API_URL}/animals/${id}`, { method: "GET" })
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

    static getByHostFamilyId = (
        hostFamilyId: number
    ): Promise<AnimalToHostFamily[]> => {
        return fetch(
            `${API_URL}/animalsToHostFamilies/withHostFamilyId/${hostFamilyId}`,
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
            .then((athfs) =>
                athfs.map((athf: any) =>
                    new AnimalToHostFamilyDTO(athf).toEntity()
                )
            );
    };

    static getSpecies = (): Promise<Species[]> => {
        return fetch(`${API_URL}/species`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((species) =>
                species.map((species: any) =>
                    new SpeciesDTO(species).toEntity()
                )
            );
    };

    static getSexes = (): Promise<Sexe[]> => {
        return Promise.resolve([
            { key: "male", value: "Male" },
            { key: "female", value: "Femelle" },
        ]);
    };

    static create = (animal: Animal): Promise<Animal> => {
        const animalToUpload = this.formatForServer(animal);

        return fetch(`${API_URL}/animals`, {
            method: "POST",
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

    static update = (animal: Animal): Promise<Animal> => {
        const animalToUpload = this.formatForServer(animal);

        return fetch(`${API_URL}/animals/${animalToUpload.id}`, {
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

    static delete = (animal: Animal): Promise<string> => {
        return fetch(`${API_URL}/animals/${animal.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            return response.json().then((json) => {
                throw new Error(`Server error - ${json.message}`);
            });
        });
    };
}

export default AnimalsManager;
