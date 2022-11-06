import moment from "moment";

const API_URL = process.env.REACT_APP_API_URL;

class HostFamilyKindsManager {
    static dateFields = [];

    static format = (hostFamily) => {
        this.dateFields.forEach((date) => {
            const rawValue = hostFamily[date];
            hostFamily[`${date}_object`] = {};
            hostFamily[`${date}_object`]["readable"] =
                rawValue != null ? moment(rawValue).format("DD/MM/YYYY") : null;
            hostFamily[`${date}_object`]["input"] =
                rawValue != null ? moment(rawValue).format("YYYY-MM-DD") : null;
        });
        if (hostFamily.firstname !== undefined) {
            hostFamily[
                "display_name"
            ] = `${hostFamily.firstname} ${hostFamily.name}`;
        }
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
        return fetch(`${API_URL}/hostFamilyKinds`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            })
            .then((hostFamilyKinds) =>
                hostFamilyKinds.map(HostFamilyKindsManager.format)
            );
    };

    static getById = (id) => {
        return fetch(`${API_URL}/hostFamilyKinds/${id}`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
            })
            .then(HostFamilyKindsManager.format);
    };

    static getByHostFamilyId = (id) => {
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
                throw new Error("Server error");
            })
            .then((hostFamilyKinds) =>
                hostFamilyKinds.map(HostFamilyKindsManager.format)
            );
    };

    static createHostFamilyLink = (hostFamilyKindId, hostFamilyId) => {
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
            throw new Error("Server error");
        });
    };

    static deleteHostFamilyLink = (hostFamilyKindId, hostFamilyId) => {
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
            throw new Error("Server error");
        });
    };
}

export default HostFamilyKindsManager;
