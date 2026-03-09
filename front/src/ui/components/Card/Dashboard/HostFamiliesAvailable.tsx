import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import hostFamiliesAvailabledManager from "../../../../managers/hostFamiliesAvailable.manager";
import SpeciesCounts from "../../../../logic/entities/SpeciesCounts";
import HostFamiliesCard from "./HostFamiliesCard";

const HostFamiliesAvailable = () => {
    const { t } = useTranslation();
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

    return <HostFamiliesCard title={t("dashboard.card.hostFamiliesAvailable")} datas={hostFamiliesAvailableData} />;
};
export default HostFamiliesAvailable;
