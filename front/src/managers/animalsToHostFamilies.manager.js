import moment from "moment";
import HostFamiliesManager from "./hostFamilies.manager";

const API_URL = process.env.REACT_APP_API_URL;

class AnimalsToHostFamiliesManager {
    static dateFields = ["entry_date", "exit_date"];

    static createAnimalToHostFamily = (animalId) => {
        const animalToHostFamily = { animal_id: animalId, host_family_id: undefined };
        this.dateFields.forEach((dateField) => {
            animalToHostFamily[dateField] = undefined;
            animalToHostFamily[`${dateField}_object`] = {
                readable: undefined,
                input: undefined,
            };
        });
        return animalToHostFamily;
    };

    static format = (animalToHostFamily) => {
        this.dateFields.forEach((date) => {
            const rawValue = animalToHostFamily[date];
            animalToHostFamily[`${date}_object`] = {};
            animalToHostFamily[`${date}_object`]["readable"] =
                rawValue != null
                    ? moment(rawValue).format("DD/MM/YYYY")
                    : undefined;
            animalToHostFamily[`${date}_object`]["input"] =
                rawValue != null
                    ? moment(rawValue).format("YYYY-MM-DD")
                    : undefined;
        });
        return animalToHostFamily;
    };

    static formatForServer = (animalToHostFamily) => {
        this.dateFields.forEach((dateField) => {
            if (
                animalToHostFamily[`${dateField}_object`]["input"] === undefined ||
                animalToHostFamily[`${dateField}_object`]["input"] === null
            ) {
                animalToHostFamily[dateField] = null;
            } else {
                animalToHostFamily[dateField] = moment(
                    animalToHostFamily[`${dateField}_object`]["input"]
                ).format("YYYYMMDD");
            }
        });
        return animalToHostFamily;
    };

    static getByAnimalId = (id) => {
        return fetch(`${API_URL}/animalsToHostFamilies/withAnimalId/${id}`, {
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
            .then((hostFamilies) =>
                hostFamilies.map(HostFamiliesManager.format).map(AnimalsToHostFamiliesManager.format)
            );
    };

    static create = (animalToHostFamily) => {
        const animalToHostFamilyToUpload = this.formatForServer(animalToHostFamily);

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
            .then(HostFamiliesManager.format)
            .then(AnimalsToHostFamiliesManager.format);
    };

    static update = (animalToHostFamily) => {
        const hostFamilyToUpload = this.formatForServer(animalToHostFamily);

        return fetch(`${API_URL}/animalsToHostFamilies/animalId/${animalToHostFamily.animal_id}/hostFamilyId/${animalToHostFamily.host_family_id}`, {
            method: "PUT",
            body: JSON.stringify(hostFamilyToUpload),
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
            .then(HostFamiliesManager.format)
            .then(AnimalsToHostFamiliesManager.format);
    };

    static delete = (animalToHostFamily) => {
        return fetch(`${API_URL}/animalsToHostFamilies/animalId/${animalToHostFamily.animal_id}/hostFamilyId/${animalToHostFamily.host_family_id}`, {
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

export default AnimalsToHostFamiliesManager;
