import HostFamilyRelationDTO from "../logic/dto/AnimalToHostFamilyDTO";
import HostFamilyDTO from "../logic/dto/HostFamilyDTO";
import AnimalToHostFamily from "../logic/entities/AnimalToHostFamily";
import HostFamily from "../logic/entities/HostFamily";
import fetchWithAuth from "../middleware/fetch-middleware";

const API_URL = import.meta.env.VITE_API_URL;

type GetAllParams = {
    kinds?: number[];
    isActive?: boolean;
    isAvailable?: boolean;
};

class HostFamiliesManager {
    static createHostFamily = () => {
        return new HostFamily();
    };

    static format = (hostFamily: any): HostFamily => {
        let hfDTO = new HostFamilyDTO(hostFamily);

        return hfDTO.toEntity();
    };

    static formatForServer = (hostFamily: HostFamily) => {
        const dto = new HostFamilyDTO(hostFamily);
        const { animalRelations, ...rest } = dto;
        return {
            ...rest,
        };
    };

    static getAll = ({ kinds, isAvailable }: GetAllParams = {}) => {
        const params = {
            kinds: kinds ?? null,
            isAvailable: isAvailable ?? null,
        };

        const queryString = new URLSearchParams(
            Object.entries(params)
                .filter(([_, value]) => value !== null)
                .flatMap(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value.map((v) => [key, String(v)]);
                    }
                    return [[key, String(value)]];
                })
        ).toString();

        return fetchWithAuth(`${API_URL}/host-families${queryString ? `?${queryString}` : ""}`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((hostFamilies) => hostFamilies.map((hf: any) => HostFamiliesManager.format(hf)) as HostFamily[]);
    };

    static getById = (id: number) => {
        return fetchWithAuth(`${API_URL}/host-families/${id}`, {
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
            .then((hf: any) => HostFamiliesManager.format(hf));
    };

    static getByAnimalId = (id: number): Promise<AnimalToHostFamily[]> => {
        return fetchWithAuth(`${API_URL}/animalsToHostFamilies/withAnimalId/${id}`, {
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
            .then((athfs) => athfs.map((athf: any) => new HostFamilyRelationDTO(athf).toEntity()));
    };

    static create = (hostFamily: HostFamily): Promise<HostFamily> => {
        const hostFamilyToUpload = this.formatForServer(hostFamily);
        return fetchWithAuth(`${API_URL}/host-families`, {
            method: "POST",
            body: JSON.stringify(hostFamilyToUpload),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.status === 201) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((hf: any) => HostFamiliesManager.format(hf));
    };

    static update = (hostFamily: HostFamily): Promise<HostFamily> => {
        const hostFamilyToUpload = this.formatForServer(hostFamily);
        return fetchWithAuth(`${API_URL}/host-families/${hostFamily.id}`, {
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
            .then((hf: any) => HostFamiliesManager.format(hf));
    };

    static delete = (hostFamily: HostFamily) => {
        return fetchWithAuth(`${API_URL}/host-families/${hostFamily.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            if (response.status === 204) {
                return true;
            }
            return response.json().then((json) => {
                throw new Error(`Server error - ${json.message}`);
            });
        });
    };
}

export default HostFamiliesManager;
