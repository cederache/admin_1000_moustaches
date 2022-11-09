import moment from "moment";

const API_URL = process.env.REACT_APP_API_URL;

class VeterinarianInterventionsManager {
    static dateFields = ["date"];

    static createVeterinarianIntervention = () => {
        const vetInter = {};
        this.dateFields.forEach((dateField) => {
            vetInter[dateField] = undefined;
            vetInter[`${dateField}_object`] = {
                readable: undefined,
                input: undefined,
            };
        });
        return vetInter;
    };

    static format = (vetInter) => {
        this.dateFields.forEach((date) => {
            const rawValue = vetInter[date];
            vetInter[`${date}_object`] = {};
            vetInter[`${date}_object`]["readable"] =
                rawValue != null
                    ? moment(rawValue).format("DD/MM/YYYY")
                    : undefined;
            vetInter[`${date}_object`]["input"] =
                rawValue != null
                    ? moment(rawValue).format("YYYY-MM-DD")
                    : undefined;
        });
        return vetInter;
    };

    static formatForServer = (vetInter) => {
        this.dateFields.forEach((dateField) => {
            if (
                vetInter[`${dateField}_object`]["input"] === undefined ||
                vetInter[`${dateField}_object`]["input"] === null
            ) {
                vetInter[dateField] = null;
            } else {
                vetInter[dateField] = moment(
                    vetInter[`${dateField}_object`]["input"]
                ).format("YYYYMMDD");
            }
        });
        return vetInter;
    };

    static getAll = () => {
        return fetch(`${API_URL}/veterinarianInterventions`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            })
            .then((vetInters) =>
                vetInters.map(VeterinarianInterventionsManager.format)
            );
    };

    static getById = (id) => {
        return fetch(`${API_URL}/veterinarianInterventions/${id}`, {
            method: "GET",
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            })
            .then(VeterinarianInterventionsManager.format);
    };

    static getByAnimalId = (animalId) => {
        return fetch(
            `${API_URL}/veterinarianInterventions/withAnimalId/${animalId}`,
            { method: "GET" }
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            })
            .then((vetInters) =>
                vetInters.map(VeterinarianInterventionsManager.format)
            );
    };

    static getByVeterinarianId = (vetId) => {
        return fetch(
            `${API_URL}/veterinarianInterventions/withVeterinarianId/${vetId}`,
            { method: "GET" }
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            })
            .then((vetInters) =>
                vetInters.map(VeterinarianInterventionsManager.format)
            );
    };

    static create = (vetInter) => {
        const vetInterToUpload = this.formatForServer(vetInter);

        return fetch(`${API_URL}/veterinarianInterventions`, {
            method: "POST",
            body: JSON.stringify(vetInterToUpload),
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
            .then(VeterinarianInterventionsManager.format);
    };

    static update = (vetInter) => {
        this.dateFields.forEach((dateField) => {
            if (
                vetInter[`${dateField}_object`]["input"] === undefined ||
                vetInter[`${dateField}_object`]["input"] === null
            ) {
                vetInter[dateField] = null;
            } else {
                vetInter[dateField] = moment(
                    vetInter[`${dateField}_object`]["input"]
                ).format("YYYYMMDD");
            }
        });

        return fetch(`${API_URL}/veterinarianInterventions/${vetInter.id}`, {
            method: "PUT",
            body: JSON.stringify(vetInter),
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
            .then(VeterinarianInterventionsManager.format);
    };

    static delete = (vetInter) => {
        return fetch(`${API_URL}/veterinarianInterventions/${vetInter.id}`, {
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

export default VeterinarianInterventionsManager;
