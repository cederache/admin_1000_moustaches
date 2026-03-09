import React from "react";
import { useTranslation } from "react-i18next";
import { useDashboardHostFamiliesAvailable } from "../../../../hooks/dashboard/useDashboardHostFamiliesAvailable";
import HostFamiliesCard from "./HostFamiliesCard";

const HostFamiliesAvailable = () => {
    const { t } = useTranslation();
    const { data: hostFamiliesAvailableData } = useDashboardHostFamiliesAvailable();

    return (
        <HostFamiliesCard
            title={t("dashboard.card.hostFamiliesAvailable")}
            datas={hostFamiliesAvailableData ?? null}
        />
    );
};
export default HostFamiliesAvailable;
