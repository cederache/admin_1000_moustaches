import moment from "moment";

const API_URL = process.env.REACT_APP_API_URL;

class VeterinariansManager {
    static format = (vet) => {
        [].forEach((date) => {
            const rawValue = vet[date];
            vet[date] = {};
            vet[date]["rawValue"] = rawValue;
            vet[date]["readable"] =
                rawValue != null ? moment(rawValue).format("DD/MM/YYYY") : null;
            vet[date]["input"] =
                rawValue != null ? moment(rawValue).format("YYYY-MM-DD") : null;
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

    static update = (vet) => {
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
}

export default VeterinariansManager;
