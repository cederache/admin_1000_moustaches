import moment from "moment";
import Animal from "../entities/Animal";
import Species from "../entities/Species";
import AnimalToHostFamily from "../entities/AnimalToHostFamily";

const API_URL = process.env.REACT_APP_API_URL;

export interface Sexe {
    key: string;
    value: string;
}

class AnimalsManager {
    static createAnimal = (): Animal => {
        return new Animal();
    };

    static format = (animal: Animal): Animal => {
        return Animal.copy(animal);
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
            .then(AnimalsManager.format);
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
            .then((animals) => animals.map(AnimalsManager.format));
    };

    static getSpecies = (): Promise<Species[]> => {
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
            .then(AnimalsManager.format);
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
            .then(AnimalsManager.format);
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
