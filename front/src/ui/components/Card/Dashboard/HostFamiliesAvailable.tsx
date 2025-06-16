import React, { useEffect, useState } from "react";
import hostFamiliesAvailabledManager from "../../../../managers/hostFamiliesAvailable.manager";
import SpeciesCounts from "../../../../logic/entities/SpeciesCounts";
import AnimalsCard from "./AnimalsCard";
import HostFamiliesCard from "./HostFamiliesCard";

const HostFamiliesAvailable = () => {
    const [hostFamiliesAvailableData, setHostFamiliesAvailableData] = useState<SpeciesCounts | null>(null);

    useEffect(() => {
        hostFamiliesAvailabledManager
            .getAll()
            .then((data) => {
                setHostFamiliesAvailableData(data);
            })
            .catch((err) => {
                console.error("Erreur lors du chargement des données:", err);
            });
    }, []);

    return <HostFamiliesCard title="Nombre de familles d'accueil disponibles" datas={hostFamiliesAvailableData} />;
};
export default HostFamiliesAvailable;
