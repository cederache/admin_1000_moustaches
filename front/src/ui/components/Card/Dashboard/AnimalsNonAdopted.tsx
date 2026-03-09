import React from "react";
import { useTranslation } from "react-i18next";
import { useDashboardAnimalsNonAdopted } from "../../../../hooks/dashboard/useDashboardAnimalsNonAdopted";
import AnimalsCard from "./AnimalsCard";

const AnimalsNonAdopted = () => {
    const { t } = useTranslation();
    const { data: animalsNonAdoptedData } = useDashboardAnimalsNonAdopted();

    return <AnimalsCard title={t("dashboard.card.animalsNonAdopted")} datas={animalsNonAdoptedData ?? null} />;
};
export default AnimalsNonAdopted;
