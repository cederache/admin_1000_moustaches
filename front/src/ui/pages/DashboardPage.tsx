import React, { FC, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import Page, { CustomBreadcrumbItem } from "../components/Page";
import logo from "../../assets/img/logo/Logo1000Moustaches.png";
import PermissionsManager from "../../managers/permissions.manager";
import Permissions from "../../logic/entities/Permissions";
import AnimalsNonAdopted from "../components/Card/Dashboard/AnimalsNonAdopted";
import AnimalsAdopted from "../components/Card/Dashboard/AnimalsAdopted";
import HostFamiliesAvailable from "../components/Card/Dashboard/HostFamiliesAvailable";
import useGetPermissions from "../../hooks/useGetPermissions";

type PagePermissions = {
    // canReadPets?: boolean;
    // canReadVets?: boolean;
    cardAnimalsNonAdopted?: Permissions;
    cardAnimalsAdopted?: Permissions;
    cardHFAvailabe?: Permissions;
};

interface Cards {
    ressourceName: string;
    component: React.ComponentType;
}

const cardItems: Cards[] = [
    {
        ressourceName: "card_animals_non_adopted",
        component: AnimalsNonAdopted,
    },
    {
        ressourceName: "card_animals_adopted",
        component: AnimalsAdopted,
    },
    {
        ressourceName: "card_host_families_available",
        component: HostFamiliesAvailable,
    },
];

const DashboardPage: FC = () => {
    const handleAnimalsClick = (): void => {
        window.location.href = "/animals";
    };
    const permissionsName: string[] = cardItems
        .map((item) => item?.ressourceName) //Récupère toutes les ressourceName de cardItems et si il n'y en a pas met undefined
        .filter((name) => name !== undefined) as string[]; //Filtre pour ne pas avoir dans les résultats les undefined.
    const pagePermissions = useGetPermissions(permissionsName);

    return (
        <Page
            className="DashboardPage"
            title="Dashboard"
            breadcrumbs={[
                {
                    name: "Dashboard",
                    active: true,
                    to: null,
                } as CustomBreadcrumbItem,
            ]}
        >
            <div className="d-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
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
