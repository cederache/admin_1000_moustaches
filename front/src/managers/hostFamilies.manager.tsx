import HostFamily from "../entities/HostFamily";
import AnimalsToHostFamiliesManager from "./animalsToHostFamilies.manager";

const API_URL = process.env.REACT_APP_API_URL;

class HostFamiliesManager {
    static createHostFamily = () => {
        return new HostFamily();
    };

    static format = (hostFamily: HostFamily) => {
        return HostFamily.copy(hostFamily);
    };

    static formatForServer = (hostFamily: HostFamily) => {
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

    static getById = (id: number) => {
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

    static getByAnimalId = (id: number) => {
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
                hostFamilies.map(AnimalsToHostFamiliesManager.format)
            );
    };

    static create = (hostFamily: HostFamily) => {
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

    static update = (hostFamily: HostFamily) => {
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

    static delete = (hostFamily: HostFamily) => {
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
