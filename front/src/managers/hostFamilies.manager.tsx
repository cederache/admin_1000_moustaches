import AnimalToHostFamilyDTO from "../logic/dto/AnimalToHostFamilyDTO";
import HostFamilyDTO from "../logic/dto/HostFamilyDTO";
import AnimalToHostFamily from "../logic/entities/AnimalToHostFamily";
import HostFamily from "../logic/entities/HostFamily";
import fetchWithAuth from "../middleware/fetch-middleware";

const API_URL = process.env.REACT_APP_API_URL;

class HostFamiliesManager {
    static createHostFamily = () => {
        return new HostFamily();
    };

    static format = (hostFamily: any): HostFamily => {
        return new HostFamilyDTO(hostFamily).toEntity();
    };

    static formatForServer = (hostFamily: HostFamily) => {
        return hostFamily;
    };

    static getAll = () => {
        return fetchWithAuth(`${API_URL}/hostFamilies`, { method: "GET" })
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
        return fetchWithAuth(`${API_URL}/hostFamilies/${id}`, { method: "GET" })
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

    static getByAnimalId = (id: number): Promise<AnimalToHostFamily[]> => {
        return fetchWithAuth(
            `${API_URL}/animalsToHostFamilies/withAnimalId/${id}`,
            {
                method: "GET",
            }
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((athfs) =>
                athfs.map((athf: any) =>
                    new AnimalToHostFamilyDTO(athf).toEntity()
                )
            );
    };

    static create = (hostFamily: HostFamily): Promise<HostFamily> => {
        const hostFamilyToUpload = this.formatForServer(hostFamily);

        return fetchWithAuth(`${API_URL}/hostFamilies`, {
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

    static update = (hostFamily: HostFamily): Promise<HostFamily> => {
        const hostFamilyToUpload = this.formatForServer(hostFamily);

        return fetchWithAuth(`${API_URL}/hostFamilies/${hostFamily.id}`, {
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
        return fetchWithAuth(`${API_URL}/hostFamilies/${hostFamily.id}`, {
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
