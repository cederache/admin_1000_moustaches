import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AnimalsNonAdoptedManager from "../../../../managers/AnimalsNonAdopted.manager";
import SpeciesCounts from "../../../../logic/entities/SpeciesCounts";
import AnimalsCard from "./AnimalsCard";

const AnimalsNonAdopted = () => {
    const { t } = useTranslation();
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
    return <AnimalsCard title={t("dashboard.card.animalsNonAdopted")} datas={animalsNonAdoptedData} />;
};
export default AnimalsNonAdopted;
