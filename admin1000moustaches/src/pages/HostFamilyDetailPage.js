import Page from "components/Page";
import React, { useEffect } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Input,
    Label,
    Row,
} from "reactstrap";
import HostFamiliesManager from "../managers/hostFamilies.manager";
import { useState } from "react";
import { MdRefresh } from "react-icons/md";

function HostFamilyDetailPage({ match, ...props }) {
    const hostFamilyId = match.params.id;
    const [hostFamily, setHostFamily] = useState({});

    const getHostFamily = () => {
        HostFamiliesManager.getById(hostFamilyId).then(setHostFamily);
    };

    useEffect(() => {
        getHostFamily();
    }, []);

    if (hostFamily === undefined) {
        return (
            <Page
                className="HostFamilyPage"
                title="Détail de la Famille d'Accueil"
                breadcrumbs={[
                    { name: "Familles d'Accueil", to: "/hostFamilies" },
                    { name: "Famille d'Accueil", active: true },
                ]}
            >
                <div>Famille d'Accueil non trouvé</div>
            </Page>
        );
    }

    return (
        <Page
            className="HostFamilyPage"
            title="Détail de la Famille d'Accueil"
            breadcrumbs={[
                { name: "Familles d'Accueil", to: "/hostFamilies" },
                { name: "Famille d'Accueil", active: true },
            ]}
        >
            <Row>
                <Col xs={{ span: 1, offset: 11 }}>
                    <Button onClick={getHostFamily}>
                        <MdRefresh />
                    </Button>
                </Col>
            </Row>

            <Card>
                <CardHeader>
                    <h2>{hostFamily.display_name}</h2>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs={6}>
                            <Label>Téléphone</Label>
                            <Input value={hostFamily.phone} readOnly />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Page>
    );
}
export default HostFamilyDetailPage;
