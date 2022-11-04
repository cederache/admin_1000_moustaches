import moment from "moment";

const API_URL = process.env.REACT_APP_API_URL;

class VeterinariansManager {
    static dateFields = [];

    static createVeterinarian = () => {
        const veterinarian = {};
        this.dateFields.forEach((dateField) => {
            veterinarian[dateField] = null;
            veterinarian[`${dateField}_object`] = {
                readable: null,
                input: null,
            };
        });
        return veterinarian;
    };

    static format = (vet) => {
        this.dateFields.forEach((date) => {
            const rawValue = vet[date];
            vet[date] = {};
            vet[date]["readable"] =
                rawValue != null ? moment(rawValue).format("DD/MM/YYYY") : null;
            vet[date]["input"] =
                rawValue != null ? moment(rawValue).format("YYYY-MM-DD") : null;
        });
        switch (vet.price_level) {
            case 0:
                vet.price_level_text = "€";
                vet.price_level_tooltip = "Pas cher";
                break;
            case 1:
                vet.price_level_text = "€€";
                vet.price_level_tooltip = "Cher";
                break;
            case 2:
                vet.price_level_text = "€€€";
                vet.price_level_tooltip = "Cher sa mère";
                break;
            default:
                vet.price_level_text = null;
                vet.price_level_tooltip = "Ne sait pas";
                break;
        }
        return vet;
    };

    static formatForServer = (vet) => {
        this.dateFields.forEach((dateField) => {
            if (
                vet[`${dateField}_object`]["input"] === undefined ||
                vet[`${dateField}_object`]["input"] === null
            ) {
                vet[dateField] = null;
            } else {
                vet[dateField] = moment(
                    vet[`${dateField}_object`]["input"]
                ).format("YYYYMMDD");
            }
        });
        return vet;
    };

    static getAll = () => {
        return fetch(`${API_URL}/veterinarians`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            })
            .then((vets) => vets.map(VeterinariansManager.format));
    };

    static getById = (id) => {
        return fetch(`${API_URL}/veterinarians/${id}`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            })
            .then(VeterinariansManager.format);
    };

    static create = (veterinarian) => {
        const veterinarianToUpload = this.formatForServer(veterinarian);

        console.log("Will call post on veterinarians");
        return fetch(`${API_URL}/veterinarians`, {
            method: "POST",
            body: JSON.stringify(veterinarianToUpload),
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
            .then(VeterinariansManager.format);
    };

    static update = (vet) => {
        this.dateFields.forEach((dateField) => {
            if (
                vet[`${dateField}_object`]["input"] === undefined ||
                vet[`${dateField}_object`]["input"] === null
            ) {
                vet[dateField] = null;
            } else {
                vet[dateField] = moment(
                    vet[`${dateField}_object`]["input"]
                ).format("YYYYMMDD");
            }
        });

        return fetch(`${API_URL}/veterinarians/${vet.id}`, {
            method: "PUT",
            body: JSON.stringify(vet),
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
            .then(VeterinariansManager.format);
    };

    static delete = (veterinarian) => {
        return fetch(`${API_URL}/veterinarians/${veterinarian.id}`, {
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

export default VeterinariansManager;
