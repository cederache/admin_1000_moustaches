import moment from "moment";

const API_URL = process.env.REACT_APP_API_URL;

class HostFamiliesManager {
    static dateFields = ["entry_date", "exit_date"];

    static createHostFamily = () => {
        const hostFamily = {
            on_break: false,
            membership_up_to_date: true,
            is_temporary: false,
        };
        this.dateFields.forEach((dateField) => {
            hostFamily[dateField] = undefined;
            hostFamily[`${dateField}_object`] = {
                readable: undefined,
                input: undefined,
            };
        });
        return hostFamily;
    };

    static format = (hostFamily) => {
        this.dateFields.forEach((date) => {
            const rawValue = hostFamily[date];
            hostFamily[`${date}_object`] = {};
            hostFamily[`${date}_object`]["readable"] =
                rawValue != null
                    ? moment(rawValue).format("DD/MM/YYYY")
                    : undefined;
            hostFamily[`${date}_object`]["input"] =
                rawValue != null
                    ? moment(rawValue).format("YYYY-MM-DD")
                    : undefined;
        });
        hostFamily[
            "display_name"
        ] = `${hostFamily.name} ${hostFamily.firstname}`;

        hostFamily["hostFamilyKinds"] =
            hostFamily.host_family_kinds?.split(",") ?? [];
        return hostFamily;
    };

    static formatForServer = (hostFamily) => {
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
        return hostFamily;
    };

    static getAll = () => {
        return fetch(`${API_URL}/hostFamilies`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
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
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
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
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((hostFamilies) =>
                hostFamilies.map(HostFamiliesManager.format)
            );
    };

    static create = (hostFamily) => {
        const hostFamilyToUpload = this.formatForServer(hostFamily);

        return fetch(`${API_URL}/hostFamilies`, {
            method: "POST",
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
            .then(HostFamiliesManager.format);
    };

    static update = (hostFamily) => {
        const hostFamilyToUpload = this.formatForServer(hostFamily);

        return fetch(`${API_URL}/hostFamilies/${hostFamily.id}`, {
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
            .then(HostFamiliesManager.format);
    };

    static delete = (hostFamily) => {
        return fetch(`${API_URL}/hostFamilies/${hostFamily.id}`, {
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

export default HostFamiliesManager;
