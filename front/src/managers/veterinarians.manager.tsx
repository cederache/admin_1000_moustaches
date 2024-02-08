import Veterinarian from "../logic/entities/Veterinarian";
import VeterinarianDTO from "../logic/dto/VeterinarianDTO";
import fetchWithAuth from "../middleware/fetch-middleware";

const API_URL = process.env.REACT_APP_API_URL;

class VeterinariansManager {
    static dateFields = [];

    static createVeterinarian = () => {
        return new Veterinarian();
    };

    static format = (vetDTO: any) => {
        return new VeterinarianDTO(vetDTO).toEntity();
    };

    static formatForServer = (vet: Veterinarian) => {
        return vet;
    };

    static getAll = (): Promise<[Veterinarian]> => {
        return fetchWithAuth(`${API_URL}/veterinarians`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((vets) => vets.map(VeterinariansManager.format));
    };

    static getById = (id: number): Promise<Veterinarian> => {
        return fetchWithAuth(`${API_URL}/veterinarians/${id}`, {
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
            .then(VeterinariansManager.format);
    };

    static create = (veterinarian: Veterinarian): Promise<Veterinarian> => {
        const veterinarianToUpload = this.formatForServer(veterinarian);
        return fetchWithAuth(`${API_URL}/veterinarians`, {
            method: "POST",
            body: JSON.stringify(veterinarianToUpload),
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
            .then(VeterinariansManager.format);
    };

    static update = (vet: Veterinarian): Promise<Veterinarian> => {
        return fetchWithAuth(`${API_URL}/veterinarians/${vet.id}`, {
            method: "PUT",
            body: JSON.stringify(vet),
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
            .then(VeterinariansManager.format);
    };

    static delete = (veterinarian: Veterinarian): Promise<Veterinarian> => {
        return fetchWithAuth(`${API_URL}/veterinarians/${veterinarian.id}`, {
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

export default VeterinariansManager;
