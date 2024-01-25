import Veterinarian from "../entities/Veterinarian";

const API_URL = process.env.REACT_APP_API_URL;

class VeterinariansManager {
    static dateFields = [];

    static createVeterinarian = () => {
        return new Veterinarian();
    };

    // TODO: set vet as VeterinarianDTO
    static format = (vet: any) => {
        switch (vet.price_level) {
            case 0:
                vet.price_level_text = "€";
                vet.price_level_tooltip = "Pas cher";
                break;
            case 1:
                vet.price_level_text = "€€";
                vet.price_level_tooltip = "Cher";
                break;
            case 2:
                vet.price_level_text = "€€€";
                vet.price_level_tooltip = "Cher sa mère";
                break;
            default:
                vet.price_level_text = null;
                vet.price_level_tooltip = "Ne sait pas";
                break;
        }
        vet.emergencies = vet.emergencies === 1;
        return vet as Veterinarian;
    };

    static formatForServer = (vet: Veterinarian) => {
        return vet;
    };

    static getAll = (): Promise<[Veterinarian]> => {
        return fetch(`${API_URL}/veterinarians`, { method: "GET" })
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
        return fetch(`${API_URL}/veterinarians/${id}`, { method: "GET" })
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
        return fetch(`${API_URL}/veterinarians`, {
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
        return fetch(`${API_URL}/veterinarians/${vet.id}`, {
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
        return fetch(`${API_URL}/veterinarians/${veterinarian.id}`, {
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
