import React from "react";
import { useTranslation } from "react-i18next";
import { useDashboardAnimalsAdopted } from "../../../../api/hooks/dashboard/useDashboardAnimalsAdopted";
import AnimalsCard from "./AnimalsCard";

const AnimalsAdopted = () => {
    const { t } = useTranslation();
    const { data: animalsAdoptedData } = useDashboardAnimalsAdopted();

    return <AnimalsCard title={t("dashboard.card.animalsAdopted")} datas={animalsAdoptedData ?? null} />;
};
export default AnimalsAdopted;
