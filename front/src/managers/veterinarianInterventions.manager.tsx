import VeterinarianIntervention from "../entities/VeterinarianIntervention";

const API_URL = process.env.REACT_APP_API_URL;

class VeterinarianInterventionsManager {
    static createVeterinarianIntervention = (): VeterinarianIntervention => {
        return new VeterinarianIntervention();
    };

    static format = (
        vetInter: VeterinarianIntervention
    ): VeterinarianIntervention => {
        return VeterinarianIntervention.copy(vetInter);
    };

    static formatForServer = (
        vetInter: VeterinarianIntervention
    ): VeterinarianIntervention => {
        return vetInter;
    };

    static getAll = () => {
        return fetch(`${API_URL}/veterinarianInterventions`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((vetInters) =>
                vetInters.map(VeterinarianInterventionsManager.format)
            );
    };

    static getById = (id: number) => {
        return fetch(`${API_URL}/veterinarianInterventions/${id}`, {
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
            .then(VeterinarianInterventionsManager.format);
    };

    static getByAnimalId = (animalId: number) => {
        return fetch(
            `${API_URL}/veterinarianInterventions/withAnimalId/${animalId}`,
            { method: "GET" }
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((vetInters) =>
                vetInters.map(VeterinarianInterventionsManager.format)
            );
    };

    static getByVeterinarianId = (vetId: number) => {
        return fetch(
            `${API_URL}/veterinarianInterventions/withVeterinarianId/${vetId}`,
            { method: "GET" }
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((vetInters) =>
                vetInters.map(VeterinarianInterventionsManager.format)
            );
    };

    static create = (vetInter: VeterinarianIntervention) => {
        const vetInterToUpload = this.formatForServer(vetInter);

        return fetch(`${API_URL}/veterinarianInterventions`, {
            method: "POST",
            body: JSON.stringify(vetInterToUpload),
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
            .then(VeterinarianInterventionsManager.format);
    };

    static update = (vetInter: VeterinarianIntervention) => {
        return fetch(`${API_URL}/veterinarianInterventions/${vetInter.id}`, {
            method: "PUT",
            body: JSON.stringify(vetInter),
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
            .then(VeterinarianInterventionsManager.format);
    };

    static delete = (vetInter: VeterinarianIntervention) => {
        return fetch(`${API_URL}/veterinarianInterventions/${vetInter.id}`, {
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

export default VeterinarianInterventionsManager;
