import HostFamilyKindDTO from "../../logic/dto/HostFamilyKindDTO";
import HostFamilyKind from "../../logic/entities/HostFamilyKind";
import fetchWithAuth from "../../middleware/fetch-middleware";
import HostFamiliesManager from "./hostFamilies.manager";

const API_URL = import.meta.env.VITE_API_URL;

class HostFamilyKindsManager {
    static format = (hostFamily: HostFamilyKind) => {
        return HostFamilyKind.copy(hostFamily);
    };

    static formatForServer = (hostFamily: HostFamilyKind) => {
        return new HostFamilyKindDTO(hostFamily);
    };

    static getAll = (): Promise<HostFamilyKind[]> => {
        return fetchWithAuth(`${API_URL}/host-family-kinds`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((hostFamilyKinds) => hostFamilyKinds.map(HostFamilyKindsManager.format));
    };

    static getById = (id: number): Promise<HostFamilyKind> => {
        return fetchWithAuth(`${API_URL}/host-family-kinds/${id}`, {
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
            .then(HostFamilyKindsManager.format);
    };

    static getByHostFamilyId = (id: number): Promise<HostFamilyKind[]> => {
        return fetchWithAuth(`${API_URL}/host-family-kinds/${id}`, {
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
            .then(HostFamiliesManager.format)
            .then((hf) => hf.hostFamilyKinds ?? []);
    };
}

export default HostFamilyKindsManager;
