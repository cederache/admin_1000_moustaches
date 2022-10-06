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
import VeterinariansManager from "../managers/veterinarians.manager";
import { useState } from "react";
import { MdDirections, MdRefresh } from "react-icons/md";
import SourceLink from "../components/SourceLink";

function VeterinarianDetailPage({ match, ...props }) {
    const vetId = match.params.id;
    const [veterinarian, setVeterinarian] = useState([]);

    const getVeterinarian = () => {
        VeterinariansManager.getById(vetId).then(setVeterinarian);
    };

    useEffect(() => {
        getVeterinarian();
    }, []);

    return (
        <Page
            className="VeterinarianPage"
            title="Détail du vétérinaire"
            breadcrumbs={[
                { name: "Vétérinaires", to: "/veterinarians" },
                { name: "Vétérinaire", active: true },
            ]}
        >
            <Row>
                <Col xs={{ span: 1, offset: 11 }}>
                    <Button onClick={getVeterinarian}>
                        <MdRefresh />
                    </Button>
                </Col>
            </Row>

            <Card>
                <CardHeader>
                    <h2>{veterinarian.name}</h2>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs={6}>
                            <Row>
                                <Col xs={12}>
                                    <Label>Téléphone</Label>
                                    <Input
                                        value={veterinarian.phone}
                                        readOnly
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <Label>E-mail</Label>
                                    <Input value={veterinarian.mail} readOnly />
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={6}>
                            <Label>
                                <SourceLink
                                    link={`https://www.google.com/maps/place/${veterinarian.address}`}
                                >
                                    <span>
                                        Adresse <MdDirections />
                                    </span>
                                </SourceLink>
                            </Label>
                            <Input
                                type="textarea"
                                value={veterinarian.address}
                                readOnly
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3}>
                            <Label>Gestion des urgences</Label>
                            <Input
                                value={
                                    veterinarian.emergencies == true
                                        ? "Oui"
                                        : veterinarian.emergencies == false
                                        ? "Non"
                                        : "NSP"
                                }
                                readOnly
                            />
                        </Col>
                        <Col xs={9}>
                            <Label>
                                Méthode de confirmation de rendez-vous
                            </Label>
                            <Input
                                type="textarea"
                                value={
                                    veterinarian.appointment_confirmation_procedure
                                }
                                readOnly
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <Label>Date de paiement</Label>
                            <Input
                                type="textarea"
                                value={veterinarian.invoice_payment_date}
                                readOnly
                            />
                        </Col>
                        <Col xs={6}>
                            <Label>Moyen de paiement</Label>
                            <Input
                                type="textarea"
                                value={veterinarian.payment_method}
                                readOnly
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Page>
    );
}
export default VeterinarianDetailPage;
