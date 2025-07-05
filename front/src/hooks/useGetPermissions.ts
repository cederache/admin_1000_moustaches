import { useState, useEffect } from "react";
import Permissions, { Ressource } from "../logic/entities/Permissions";

//Récupère les permissions stockées lorsque l'utilisateurice se connecte
const getPermissions = (): Permissions[] | null => {
    const permissions = sessionStorage.getItem("permissions");
    return permissions ? JSON.parse(permissions) : null;
};

const useGetPermissions = (ressources: Ressource[]) => {
    //Record<K, T> est un type générique qui permet de définir un objet dont les clés sont de type K et les valeurs sont de type T.
    const [permissionsRecord, setPermissionsRecord] = useState<Record<string, Permissions>>({});

    useEffect(() => {
        const allPermissions = getPermissions();
        const permissionsFound: Record<string, Permissions> = {};
        ressources.forEach((ressource) => {
            // Search current ressource in allPermissions array
            const permissionFound = allPermissions?.find((perm) => perm.ressource_name === ressource);
            if (permissionFound) {
                permissionsFound[ressource] = permissionFound;
            }
        });
        setPermissionsRecord(permissionsFound);
    }, []);

    return permissionsRecord;
};

export default useGetPermissions;
