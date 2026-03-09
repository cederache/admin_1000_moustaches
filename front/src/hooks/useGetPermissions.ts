import { useState, useEffect } from "react";
import Permissions, { Ressource } from "../logic/entities/Permissions";

//Récupère les permissions stockées lorsque l'utilisateurice se connecte
const getPermissions = (): Permissions[] | null => {
    const permissions = sessionStorage.getItem("permissions");
    return permissions ? JSON.parse(permissions) : null;
};

const defaultPermission = (ressource: Ressource): Permissions =>
    new Permissions(ressource, false, false, false, false);

const useGetPermissions = (ressources: Ressource[]) => {
    //Record<K, T> est un type générique qui permet de définir un objet dont les clés sont de type K et les valeurs sont de type T.
    const [permissionsRecord, setPermissionsRecord] = useState<Record<string, Permissions>>(() => {
        const initial: Record<string, Permissions> = {};
        ressources.forEach((r) => {
            initial[r] = defaultPermission(r);
        });
        return initial;
    });

    useEffect(() => {
        const allPermissions = getPermissions();
        const permissionsFound: Record<string, Permissions> = {};
        ressources.forEach((ressource) => {
            const permissionFound = allPermissions?.find((perm) => perm.ressource_name === ressource);
            permissionsFound[ressource] = permissionFound
                ? new Permissions(
                      permissionFound.ressource_name,
                      permissionFound.can_create,
                      permissionFound.can_read,
                      permissionFound.can_update,
                      permissionFound.can_delete
                  )
                : defaultPermission(ressource);
        });
        setPermissionsRecord(permissionsFound);
    }, [ressources.join(",")]);

    return permissionsRecord;
};

export default useGetPermissions;
