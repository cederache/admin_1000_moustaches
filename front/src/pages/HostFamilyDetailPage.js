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
import { nullableBoolToString } from "../utils/nullableBool";

function HostFamilyDetailPage({ match, ...props }) {
    const hostFamilyId = match.params.id;
    const [hostFamily, setHostFamily] = useState(null);

    const getHostFamily = () => {
        setHostFamily(null);
        HostFamiliesManager.getById(hostFamilyId).then(setHostFamily);
    };

    useEffect(() => {
        getHostFamily();
    }, []);

    let content = <div>Chargement...</div>;

    if (hostFamily === undefined) {
        content = <div>Famille d'Accueil non trouvé</div>;
    } else if (hostFamily === null) {
        content = <div>Chargement...</div>;
    } else {
        content = (
            <div>
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
                                <Input
                                    type="phone"
                                    value={hostFamily.phone}
                                    readOnly
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>E-mail</Label>
                                <Input
                                    type="mail"
                                    value={hostFamily.mail}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Label>Pseudo</Label>
                                <Input
                                    value={hostFamily.social_network_alias}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Label>Nombre d'enfant</Label>
                                <Input
                                    value={nullableBoolToString(
                                        hostFamily.nb_children,
                                        "Oui",
                                        "Non",
                                        "NSP"
                                    )}
                                    readOnly
                                />
                            </Col>
                            <Col xs={8}>
                                <Label>Informations enfant(s)</Label>
                                <Input
                                    type="textarea"
                                    value={hostFamily.children_infos}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Label>Informations animaux</Label>
                                <Input
                                    type="textarea"
                                    value={hostFamily.animals_info}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Label>Permis de conduire</Label>
                                <Input
                                    value={nullableBoolToString(
                                        hostFamily.driver_license,
                                        "Oui",
                                        "Non",
                                        "NSP"
                                    )}
                                    readOnly
                                />
                            </Col>
                            <Col xs={4}>
                                <Label>Peut donner soins véto</Label>
                                <Input
                                    value={nullableBoolToString(
                                        hostFamily.can_provide_veterinary_care,
                                        "Oui",
                                        "Non",
                                        "NSP"
                                    )}
                                    readOnly
                                />
                            </Col>
                            <Col xs={4}>
                                <Label>Peut sociabiliser</Label>
                                <Input
                                    value={nullableBoolToString(
                                        hostFamily.can_provide_sociabilisation,
                                        "Oui",
                                        "Non",
                                        "NSP"
                                    )}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Label>
                                    Peut accueillir des animaux handicapés
                                </Label>
                                <Input
                                    value={nullableBoolToString(
                                        hostFamily.can_host_disable_animal,
                                        "Oui",
                                        "Non",
                                        "NSP"
                                    )}
                                    readOnly
                                />
                            </Col>
                            <Col xs={4}>
                                <Label>Peut donner des soins de nuit</Label>
                                <Input
                                    value={nullableBoolToString(
                                        hostFamily.can_provide_night_care,
                                        "Oui",
                                        "Non",
                                        "NSP"
                                    )}
                                    readOnly
                                />
                            </Col>
                            <Col xs={4}>
                                <Label>Peut isoler</Label>
                                <Input
                                    value={nullableBoolToString(
                                        hostFamily.can_isolate,
                                        "Oui",
                                        "Non",
                                        "NSP"
                                    )}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Label>Observations</Label>
                                <Input
                                    type="textarea"
                                    value={hostFamily.observations}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Label>Informations sur le logement</Label>
                                <Input
                                    type="textarea"
                                    value={hostFamily.housing_informations}
                                    readOnly
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
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
            {content}
        </Page>
    );
}
export default HostFamilyDetailPage;
