import moment from "moment";

const API_URL = process.env.REACT_APP_API_URL;

class AnimalsManager {
    static format = (animal) => {
        [
            "birthdate",
            "entry_date",
            "exit_date",
            "death_date",
            "host_entry_date",
            "host_exit_date",
        ].forEach((date) => {
            const rawValue = animal[date];
            animal[date] = {};
            animal[date]["rawValue"] = rawValue;
            animal[date]["readable"] =
                rawValue != null ? moment(rawValue).format("DD/MM/YYYY") : null;
            animal[date]["input"] =
                rawValue != null ? moment(rawValue).format("YYYY-MM-DD") : null;
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
}

export default AnimalsManager;
