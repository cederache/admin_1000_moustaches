import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import Page, { CustomBreadcrumbItem } from "../components/Page";
import { Ressource } from "../../logic/entities/Permissions";
import AnimalsNonAdopted from "../components/Card/Dashboard/AnimalsNonAdopted";
import AnimalsAdopted from "../components/Card/Dashboard/AnimalsAdopted";
import HostFamiliesAvailable from "../components/Card/Dashboard/HostFamiliesAvailable";
import useGetPermissions from "../../hooks/useGetPermissions";

interface Cards {
    ressourceName: Ressource;
    component: React.ComponentType;
}

const cardItems: Cards[] = [
    {
        ressourceName: Ressource.CARD_ANIMALS_NON_ADOPTED,
        component: AnimalsNonAdopted,
    },
    {
        ressourceName: Ressource.CARD_ANIMALS_ADOPTED,
        component: AnimalsAdopted,
    },
    {
        ressourceName: Ressource.CARD_HOST_FAMILIES_AVAILABLE,
        component: HostFamiliesAvailable,
    },
];

const DashboardPage: FC = () => {
    const { t } = useTranslation();
    const permissionsName: Ressource[] = cardItems
        .map((item) => item?.ressourceName) //Récupère toutes les ressourceName de cardItems et si il n'y en a pas met undefined
        .filter((name) => name !== undefined) as Ressource[]; //Filtre pour ne pas avoir dans les résultats les undefined.
    const pagePermissions = useGetPermissions(permissionsName);

    return (
        <Page
            className="DashboardPage"
            title={t("dashboard.title")}
            breadcrumbs={[
                {
                    name: t("dashboard.breadcrumb"),
                    active: true,
                    to: null,
                } as CustomBreadcrumbItem,
            ]}
        >
            <div
                className="d-grid"
                style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 450px))",
                    gap: "1rem",
                    maxWidth: "1400px",
                    margin: "0 auto",
                }}
            >
                {cardItems.map((cardItem, index) => {
                    if (cardItem.ressourceName === undefined || (cardItem.ressourceName !== undefined && pagePermissions[cardItem.ressourceName]?.can_read)) {
                        const Component = cardItem.component;
                        return <Component key={index} />;
                    }
                })}
            </div>
        </Page>
    );
};

export default DashboardPage;
