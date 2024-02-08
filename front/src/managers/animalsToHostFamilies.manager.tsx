import AnimalToHostFamily from "../logic/entities/AnimalToHostFamily";
import AnimalToHostFamilyDTO from "../logic/dto/AnimalToHostFamilyDTO";
import fetchWithAuth from "../middleware/fetch-middleware";

const API_URL = process.env.REACT_APP_API_URL;

class AnimalsToHostFamiliesManager {
    static createAnimalToHostFamily = (
        animalId: number,
        animalName: string
    ) => {
        return new AnimalToHostFamily(animalId, animalName);
    };

    static format = (animalToHostFamily: AnimalToHostFamily) => {
        return AnimalToHostFamily.copy(animalToHostFamily);
    };

    static formatForServer = (animalToHostFamily: AnimalToHostFamily) => {
        return animalToHostFamily;
    };

    static getByAnimalId = (id: number) => {
        return fetchWithAuth(
            `${API_URL}/animalsToHostFamilies/withAnimalId/${id}`,
            {
                method: "GET",
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
            .then((athfs) =>
                athfs.map((athf: any) =>
                    new AnimalToHostFamilyDTO(athf).toEntity()
                )
            );
    };

    static create = (animalToHostFamily: AnimalToHostFamily) => {
        const animalToHostFamilyToUpload =
            this.formatForServer(animalToHostFamily);

        return fetchWithAuth(`${API_URL}/animalsToHostFamilies`, {
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

        return fetchWithAuth(
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
        return fetchWithAuth(
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
