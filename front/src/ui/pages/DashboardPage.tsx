import React, { FC } from "react";
import { Button, Col, Row } from "reactstrap";
import Page, { CustomBreadcrumbItem } from "../components/Page";
import logo from "../../assets/img/logo/Logo1000Moustaches.png";

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
            <Row>
                <Col xs={{ size: 2, offset: 5 }}>
                    <img src={logo} height="100" alt="1000 Moustaches" />
                </Col>
            </Row>
            <Row>
                <Col xs={6} md={4} lg={2}>
                    <Button color="primary" onClick={handleAnimalsClick}>
                        Animaux
                    </Button>
                </Col>
                <Col xs={6} md={4} lg={2}>
                    <Button
                        color="primary"
                        onClick={() => {
                            window.location.href = "/veterinarians";
                        }}
                    >
                        Vétérinaires
                    </Button>
                </Col>
                <Col xs={6} md={4} lg={2}>
                    <Button
                        color="primary"
                        onClick={() => {
                            window.location.href = "/hostFamilies";
                        }}
                    >
                        Familles d'accueil
                    </Button>
                </Col>
                <Col xs={6} md={4} lg={2}>
                    <Button
                        color="primary"
                        onClick={() => {
                            window.location.href = "/users";
                        }}
                    >
                        Utilisateur·ice·s
                    </Button>
                </Col>
            </Row>
        </Page>
    );
};

export default DashboardPage;
