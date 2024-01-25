import HostFamilyKind from "../entities/HostFamilyKind";

const API_URL = process.env.REACT_APP_API_URL;

class HostFamilyKindsManager {
    static format = (hostFamily: HostFamilyKind) => {
        return HostFamilyKind.copy(hostFamily);
    };

    static formatForServer = (hostFamily: HostFamilyKind) => {
        return hostFamily;
    };

    static getAll = (): Promise<HostFamilyKind[]> => {
        return fetch(`${API_URL}/hostFamilyKinds`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((hostFamilyKinds) =>
                hostFamilyKinds.map(HostFamilyKindsManager.format)
            );
    };

    static getById = (id: number): Promise<HostFamilyKind> => {
        return fetch(`${API_URL}/hostFamilyKinds/${id}`, { method: "GET" })
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
        return fetch(
            `${API_URL}/hostFamilyToHostFamilyKinds/withHostFamilyId/${id}`,
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
            .then((hostFamilyKinds) =>
                hostFamilyKinds.map(HostFamilyKindsManager.format)
            );
    };

    static createHostFamilyLink = (
        hostFamilyKindId: number,
        hostFamilyId: number
    ) => {
        return fetch(`${API_URL}/hostFamilyToHostFamilyKinds`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                host_family_id: hostFamilyId,
                host_family_kind_id: hostFamilyKindId,
            }),
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            return response.json().then((json) => {
                throw new Error(`Server error - ${json.message}`);
            });
        });
    };

    static deleteHostFamilyLink = (
        hostFamilyKindId: number,
        hostFamilyId: number
    ) => {
        return fetch(
            `${API_URL}/hostFamilyToHostFamilyKinds/hostFamilyKind/${hostFamilyKindId}/hostFamily/${hostFamilyId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            return response.json().then((json) => {
                throw new Error(`Server error - ${json.message}`);
            });
        });
    };
}

export default HostFamilyKindsManager;
