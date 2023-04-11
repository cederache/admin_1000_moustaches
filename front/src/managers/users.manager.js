import moment from "moment";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

const API_URL = process.env.REACT_APP_API_URL;

class UsersManager {
    static dateFields = [];

    static createUser = () => {
        const user = { is_referent: false };
        this.dateFields.forEach((dateField) => {
            user[dateField] = null;
            user[`${dateField}_object`] = {
                readable: null,
                input: null,
            };
        });
        return user;
    };

    static format = (user) => {
        this.dateFields.forEach((date) => {
            const rawValue = user[date];
            user[date] = {};
            user[date]["readable"] =
                rawValue != null ? moment(rawValue).format("DD/MM/YYYY") : null;
            user[date]["input"] =
                rawValue != null ? moment(rawValue).format("YYYY-MM-DD") : null;
        });
        user["display_name"] = `${user?.firstname} ${user?.name}`
        return user;
    };

    static formatForServer = (user) => {
        this.dateFields.forEach((dateField) => {
            if (
                user[`${dateField}_object`]["input"] === undefined ||
                user[`${dateField}_object`]["input"] === null
            ) {
                user[dateField] = null;
            } else {
                user[dateField] = moment(
                    user[`${dateField}_object`]["input"]
                ).format("YYYYMMDD");
            }
        });
        return user;
    };

    static getAll = () => {
        return fetch(`${API_URL}/users`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((users) => users.map(UsersManager.format));
    };

    static getAllReferents = () => {
        return fetch(`${API_URL}/users`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then((users) =>
                users
                    .filter((usr) => usr.is_referent === 1)
                    .map(UsersManager.format)
            );
    };

    static getById = (id) => {
        return fetch(`${API_URL}/users/${id}`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return response.json().then((json) => {
                    throw new Error(`Server error - ${json.message}`);
                });
            })
            .then(UsersManager.format);
    };

    static create = (user) => {
        const userToUpload = this.formatForServer(user);

        console.log("Will call post on users");
        return fetch(`${API_URL}/users`, {
            method: "POST",
            body: JSON.stringify(userToUpload),
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
            .then(UsersManager.format);
    };

    static update = (user) => {
        this.dateFields.forEach((dateField) => {
            if (
                user[`${dateField}_object`]["input"] === undefined ||
                user[`${dateField}_object`]["input"] === null
            ) {
                user[dateField] = null;
            } else {
                user[dateField] = moment(
                    user[`${dateField}_object`]["input"]
                ).format("YYYYMMDD");
            }
        });

        return fetch(`${API_URL}/users/${user.id}`, {
            method: "PUT",
            body: JSON.stringify(user),
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
            .then(UsersManager.format);
    };

    static delete = (user) => {
        return fetch(`${API_URL}/users/${user.id}`, {
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

    static getLoggedUser = () => {
        return new Promise((resolve, reject) => {
            const firebaseUser = auth.currentUser;
            if (firebaseUser !== null) {
                this.getAll()
                    .then((users) => {
                        resolve(
                            users.find(
                                (usr) => usr.email === firebaseUser.email
                            )
                        );
                    })
                    .catch((error) => {
                        console.error(error);
                        resolve(null);
                    });
            } else {
                onAuthStateChanged(auth, (user) => {
                    this.getAll()
                        .then((users) => {
                            resolve(
                                users.find((usr) => usr.email === user.email)
                            );
                        })
                        .catch((error) => {
                            console.error(error);
                            resolve(null);
                        });
                });
            }
        });
    };
}

export default UsersManager;
