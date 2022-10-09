import moment from "moment";

const API_URL = process.env.REACT_APP_API_URL;

class HostFamiliesManager {
    static format = (hostFamily) => {
        ["entry_date", "exit_date"].forEach((date) => {
            const rawValue = hostFamily[date];
            hostFamily[date] = {};
            hostFamily[date]["rawValue"] = rawValue;
            hostFamily[date]["readable"] =
                rawValue != null ? moment(rawValue).format("DD/MM/YYYY") : null;
            hostFamily[date]["input"] =
                rawValue != null ? moment(rawValue).format("YYYY-MM-DD") : null;
        });
        hostFamily[
            "display_name"
        ] = `${hostFamily.firstname} ${hostFamily.name}`;
        return hostFamily;
    };

    static getAll = () => {
        return fetch(`${API_URL}/hostFamilies`, { method: "GET" })
            .then((response) => response.json())
            .then((hostFamilies) =>
                hostFamilies.map(HostFamiliesManager.format)
            )
            .catch((err) => {
                console.log(err);
            });
    };

    static getById = (id) => {
        return fetch(`${API_URL}/hostFamilies/${id}`, { method: "GET" })
            .then((response) => response.json())
            .then(HostFamiliesManager.format)
            .catch((err) => {
                console.log(err);
            });
    };

    static getByAnimalId = (id) => {
        return fetch(`${API_URL}/animalsToHostFamilies/withAnimalId/${id}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((hostFamilies) =>
                hostFamilies.map(HostFamiliesManager.format)
            )
            .catch((err) => {
                console.log(err);
            });
    };
}

export default HostFamiliesManager;
