import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import UsersManager from "./users.manager";
import { setLoggedUser } from "../hooks/useLoggedUser";
import PermissionsManager from "./permissions.manager";

class AuthManager {
    static savePermissions = async () => {
        return PermissionsManager.getAll().then((permissions) => {
            sessionStorage.setItem("permissions", JSON.stringify(permissions));
        });
    };

    static async login(email: string, password: string): Promise<void> {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            const token = await response.user.getIdToken();
            // Store auth token in sessionStorage
            sessionStorage.setItem("Auth Token", token);

            // Fetch the current user from the database
            const currentUser = await UsersManager.getLoggedUser();
            if (!currentUser) {
                sessionStorage.removeItem("Auth Token");
                throw new Error("User not found in database");
            }
            // Store user in sessionStorage
            setLoggedUser(currentUser);
            // Save permissions
            await this.savePermissions();
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    static async logout(): Promise<void> {
        await signOut(auth);
        // Clear user from sessionStorage
        sessionStorage.removeItem("User");
    }
}

export default AuthManager;
