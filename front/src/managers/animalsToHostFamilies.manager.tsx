import moment from "moment";
import HostFamiliesManager from "./hostFamilies.manager";
import AnimalToHostFamily from "../entities/AnimalToHostFamily";

const API_URL = process.env.REACT_APP_API_URL;

class AnimalsToHostFamiliesManager {
    static createAnimalToHostFamily = (animalId: number) => {
        return new AnimalToHostFamily(animalId);
    };

    static format = (animalToHostFamily: AnimalToHostFamily) => {
        return AnimalToHostFamily.copy(animalToHostFamily);
    };

    static formatForServer = (animalToHostFamily: AnimalToHostFamily) => {
        return animalToHostFamily;
    };

    static getByAnimalId = (id: number) => {
        return (
            fetch(`${API_URL}/animalsToHostFamilies/withAnimalId/${id}`, {
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
                // TODO: Handle ATHF_DTO from server
                .then((hostFamilies) =>
                    hostFamilies
                        .map(HostFamiliesManager.format)
                        .map(AnimalsToHostFamiliesManager.format)
                )
        );
    };

    static create = (animalToHostFamily: AnimalToHostFamily) => {
        const animalToHostFamilyToUpload =
            this.formatForServer(animalToHostFamily);

        return fetch(`${API_URL}/animalsToHostFamilies`, {
            method: "POST",
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

    static update = (animalToHostFamily: AnimalToHostFamily) => {
        const hostFamilyToUpload = this.formatForServer(animalToHostFamily);

        return fetch(
            `${API_URL}/animalsToHostFamilies/animalId/${animalToHostFamily.animal_id}/hostFamilyId/${animalToHostFamily.host_family_id}`,
            {
                method: "PUT",
                body: JSON.stringify(hostFamilyToUpload),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
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
        return fetch(
            `${API_URL}/animalsToHostFamilies/animalId/${animalToHostFamily.animal_id}/hostFamilyId/${animalToHostFamily.host_family_id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            return response.json().then((json) => {
                throw new Error(`Server error - ${json.message}`);
            });
        });
    };
}

export default AnimalsToHostFamiliesManager;
