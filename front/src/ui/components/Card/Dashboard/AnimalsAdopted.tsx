import React, { useEffect, useState } from "react";
import AnimalsAdoptedManager from "../../../../managers/AnimalsAdopted.manager";
import SpeciesCounts from "../../../../logic/entities/SpeciesCounts";
import AnimalsCard from "./AnimalsCard";

const AnimalsAdopted = () => {
    const [animalsAdoptedData, setAnimalsAdoptedData] = useState<SpeciesCounts | null>(null);

    useEffect(() => {
        AnimalsAdoptedManager.getAll()
            .then((data) => {
                setAnimalsAdoptedData(data);
            })
            .catch((err) => {
                console.error("Erreur lors du chargement des données:", err);
            });
    }, []);

    return <AnimalsCard title="Nombre d'animaux adoptés" datas={animalsAdoptedData} />;
};
export default AnimalsAdopted;
