import moment from "moment";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const API_URL = process.env.REACT_APP_API_URL;

class UsersManager {
    static dateFields = [];

    static createUser = () => {
        const user = {};
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
                throw new Error("Server error");
            })
            .then((users) => users.map(UsersManager.format));
    };

    static getById = (id) => {
        return fetch(`${API_URL}/users/${id}`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Server error");
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
                throw new Error("Server error");
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
                throw new Error("Server error");
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
            throw new Error("Server error");
        });
    };

    static getLoggedUser = () => {
        return new Promise((resolve, reject) => {
            const auth = getAuth();
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
