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
    ];

    static createAnimal = () => {
        const animal = {};
        this.dateFields.forEach((dateField) => {
            animal[dateField] = null;
            animal[`${dateField}_object`] = {
                readable: null,
                input: null,
            };
        });
        return animal;
    };

    static format = (animal) => {
        this.dateFields.forEach((date) => {
            const rawValue = animal[date];
            animal[`${date}_object`] = {};
            animal[`${date}_object`]["readable"] =
                rawValue != null ? moment(rawValue).format("DD/MM/YYYY") : null;
            animal[`${date}_object`]["input"] =
                rawValue != null ? moment(rawValue).format("YYYY-MM-DD") : null;
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
                throw new Error("Server error");
            })
            .then((animals) => animals.map(AnimalsManager.format));
    };

    static getById = (id) => {
        return fetch(`${API_URL}/animals/${id}`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
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
                throw new Error("Server error");
            })
            .then((animals) => animals.map(AnimalsManager.format));
    };

    static getSpecies = () => {
        return fetch(`${API_URL}/species`, { method: "GET" }).then(
            (response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            }
        );
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
                throw new Error("Server error");
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
                throw new Error("Server error");
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
            throw new Error("Server error");
        });
    };
}

export default AnimalsManager;
