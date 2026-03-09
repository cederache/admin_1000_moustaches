import PermissionsDTO from "../../logic/dto/PermissionsDTO";
import Permissions from "../../logic/entities/Permissions";
import fetchWithAuth from "../../middleware/fetch-middleware";

const API_URL = import.meta.env.VITE_API_URL;

class PermissionsManager {
    static dateFields = [];

    static format = (permissions: any): Permissions => {
        return new PermissionsDTO(permissions).toEntity();
    };

    static getAll = (): Promise<Permissions[]> => {
        return fetchWithAuth(`${API_URL}/permissions`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((permissions) => permissions.map(PermissionsManager.format));
    };
}

export default PermissionsManager;
