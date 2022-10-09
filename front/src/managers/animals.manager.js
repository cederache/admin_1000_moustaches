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
            .then((response) => response.json())
            .then((animals) => animals.map(AnimalsManager.format))
            .catch((err) => {
                console.log(err);
            });
    };

    static getById = (id) => {
        return fetch(`${API_URL}/animals/${id}`, { method: "GET" })
            .then((response) => response.json())
            .then(AnimalsManager.format)
            .catch((err) => {
                console.log(err);
            });
    };

    static getByHostFamilyId = (hostFamilyId) => {
        return fetch(
            `${API_URL}/animalsToHostFamilies/withHostFamilyId/${hostFamilyId}`,
            { method: "GET" }
        )
            .then((response) => response.json())
            .then((animals) => animals.map(AnimalsManager.format))
            .then((debug) => {
                console.log(debug);
                return debug;
            })
            .catch((err) => {
                console.log(err);
            });
    };
}

export default AnimalsManager;
