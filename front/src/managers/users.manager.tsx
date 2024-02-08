import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import User from "../logic/entities/User";
import UserDTO from "../logic/dto/UserDTO";
import fetchWithAuth from "../middleware/fetch-middleware";

const API_URL = process.env.REACT_APP_API_URL;

class UsersManager {
    static dateFields = [];

    static createUser = (): User => {
        return new User();
    };

    static format = (user: any): User => {
        return new UserDTO(user).toEntity();
    };

    static formatForServer = (user: User): User => {
        return user;
    };

    static getAll = (): Promise<User[]> => {
        return fetchWithAuth(`${API_URL}/users`, { method: "GET" })
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

    static getAllReferents = (): Promise<User[]> => {
        return fetchWithAuth(`${API_URL}/users`, { method: "GET" })
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
                    .filter((usr: User) => usr.is_referent)
                    .map(UsersManager.format)
            );
    };

    static getById = (id: number): Promise<User> => {
        return fetchWithAuth(`${API_URL}/users/${id}`, { method: "GET" })
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

    static create = (user: User): Promise<User> => {
        const userToUpload = this.formatForServer(user);

        console.log("Will call post on users");
        return fetchWithAuth(`${API_URL}/users`, {
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

    static update = (user: User): Promise<User> => {
        return fetchWithAuth(`${API_URL}/users/${user.id}`, {
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

    static delete = (user: User) => {
        return fetchWithAuth(`${API_URL}/users/${user.id}`, {
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

    static getLoggedUser = (): Promise<User | undefined | null> => {
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
                        .then((users: User[]) => {
                            resolve(
                                users.find(
                                    (usr: User) => usr.email === user?.email
                                )
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
