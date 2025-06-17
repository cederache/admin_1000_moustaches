import React, { FC, useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import Page, { CustomBreadcrumbItem } from "../components/Page";
import logo from "../../assets/img/logo/Logo1000Moustaches.png";
import PermissionsManager from "../../managers/permissions.manager";
import Permissions from "../../logic/entities/Permissions";
import AnimalsNonAdopted from "../components/Card/Dashboard/AnimalsNonAdopted";
import AnimalsAdopted from "../components/Card/Dashboard/AnimalsAdopted";
import HostFamiliesCard from "../components/Card/Dashboard/HostFamiliesCard";
import HostFamiliesAvailable from "../components/Card/Dashboard/HostFamiliesAvailable";

type PagePermissions = {
    canReadPets?: boolean;
    canReadVets?: boolean;
    petPermission?: Permissions;
};

const DashboardPage: FC = () => {
    const handleAnimalsClick = (): void => {
        window.location.href = "/animals";
    };

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
                <AnimalsNonAdopted />
                <AnimalsAdopted />
                <HostFamiliesAvailable />
            </div>
        </Page>
    );
};

export default DashboardPage;
