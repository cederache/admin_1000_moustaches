import moment from "moment";

const API_URL = process.env.REACT_APP_API_URL;

class AnimalsManager {
    static dateFields = [
        "birthdate",
        "entry_date",
        "exit_date",
        "death_date",
        "host_entry_date",
        "host_exit_date",
        "sterilisation_date",
        "first_vaccination_date",
        "second_vaccination_date",
    ];

    static createAnimal = () => {
        const animal = { sexe: "male" };
        this.dateFields.forEach((dateField) => {
            animal[dateField] = undefined;
            animal[`${dateField}_object`] = {
                readable: undefined,
                input: undefined,
            };
        });
        return animal;
    };

    static format = (animal) => {
        this.dateFields.forEach((date) => {
            const rawValue = animal[date];
            animal[`${date}_object`] = {};
            animal[`${date}_object`]["readable"] =
                rawValue != null
                    ? moment(rawValue).format("DD/MM/YYYY")
                    : undefined;
            animal[`${date}_object`]["input"] =
                rawValue != null
                    ? moment(rawValue).format("YYYY-MM-DD")
                    : undefined;
        });
        return animal;
    };

    static formatForServer = (animal) => {
        this.dateFields.forEach((dateField) => {
            if (
                animal[`${dateField}_object`]["input"] === undefined ||
                animal[`${dateField}_object`]["input"] === null
            ) {
                animal[dateField] = null;
            } else {
                animal[dateField] = moment(
                    animal[`${dateField}_object`]["input"]
                ).format("YYYYMMDD");
            }
        });
        return animal;
    };

    static getAll = () => {
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

    static getById = (id) => {
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

    static getByHostFamilyId = (hostFamilyId) => {
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

    static getSpecies = () => {
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

    static getSexes = () => {
        return Promise.resolve([
            { key: "male", value: "Male" },
            { key: "female", value: "Femelle" },
        ]);
    };

    static create = (animal) => {
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

    static update = (animal) => {
        this.dateFields.forEach((dateField) => {
            if (
                animal[`${dateField}_object`]["input"] === undefined ||
                animal[`${dateField}_object`]["input"] === null
            ) {
                animal[dateField] = null;
            } else {
                animal[dateField] = moment(
                    animal[`${dateField}_object`]["input"]
                ).format("YYYYMMDD");
            }
        });

        return fetch(`${API_URL}/animals/${animal.id}`, {
            method: "PUT",
            body: JSON.stringify(animal),
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

    static delete = (animal) => {
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
