import moment from "moment";

const API_URL = process.env.REACT_APP_API_URL;

class HostFamiliesManager {
    static dateFields = ["entry_date", "exit_date"];

    static format = (hostFamily) => {
        this.dateFields.forEach((date) => {
            const rawValue = hostFamily[date];
            hostFamily[`${date}_object`] = {};
            hostFamily[`${date}_object`]["rawValue"] = rawValue;
            hostFamily[`${date}_object`]["readable"] =
                rawValue != null ? moment(rawValue).format("DD/MM/YYYY") : null;
            hostFamily[`${date}_object`]["input"] =
                rawValue != null ? moment(rawValue).format("YYYY-MM-DD") : null;
        });
        hostFamily[
            "display_name"
        ] = `${hostFamily.firstname} ${hostFamily.name}`;
        return hostFamily;
    };

    static getAll = () => {
        return fetch(`${API_URL}/hostFamilies`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            })
            .then((hostFamilies) =>
                hostFamilies.map(HostFamiliesManager.format)
            );
    };

    static getById = (id) => {
        return fetch(`${API_URL}/hostFamilies/${id}`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            })
            .then(HostFamiliesManager.format);
    };

    static getByAnimalId = (id) => {
        return fetch(`${API_URL}/animalsToHostFamilies/withAnimalId/${id}`, {
            method: "GET",
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            })
            .then((hostFamilies) =>
                hostFamilies.map(HostFamiliesManager.format)
            );
    };

    static update = (hostFamily) => {
        this.dateFields.forEach((dateField) => {
            if (
                hostFamily[`${dateField}_object`]["input"] === undefined ||
                hostFamily[`${dateField}_object`]["input"] === null
            ) {
                hostFamily[dateField] = null;
            } else {
                hostFamily[dateField] = moment(
                    hostFamily[`${dateField}_object`]["input"]
                ).format("YYYYMMDD");
            }
        });

        return fetch(`${API_URL}/hostFamilies/${hostFamily.id}`, {
            method: "PUT",
            body: JSON.stringify(hostFamily),
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
            .then(HostFamiliesManager.format);
    };
}

export default HostFamiliesManager;
