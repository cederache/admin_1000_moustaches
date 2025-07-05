import React, { useEffect, useState } from "react";
import AnimalsNonAdoptedManager from "../../../../managers/AnimalsNonAdopted.manager";
import SpeciesCounts from "../../../../logic/entities/SpeciesCounts";
import AnimalsCard from "./AnimalsCard";

const AnimalsNonAdopted = () => {
    const [animalsNonAdoptedData, setAnimalsNonAdoptedData] = useState<SpeciesCounts | null>(null);

    useEffect(() => {
        AnimalsNonAdoptedManager.getAll()
            .then((data) => {
                setAnimalsNonAdoptedData(data);
            })
            .catch((err) => {
                console.error("Erreur lors du chargement des données:", err);
            });
    }, []);
    return <AnimalsCard title="Nombre d'animaux présents dans l'association" datas={animalsNonAdoptedData} />;
};
export default AnimalsNonAdopted;
