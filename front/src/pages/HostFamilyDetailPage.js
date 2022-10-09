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
    Table,
} from "reactstrap";
import HostFamiliesManager from "../managers/hostFamilies.manager";
import { useState } from "react";
import { MdRefresh, MdAssignment } from "react-icons/md";
import { nullableBoolToString } from "../utils/nullableBool";
import AnimalsManager from "../managers/animals.manager";

function HostFamilyDetailPage({ match, ...props }) {
    const hostFamilyId = match.params.id;
    const [hostFamily, setHostFamily] = useState(null);
    const [animalsToHostFamily, setAnimalsToHostFamily] = useState([]);

    const getHostFamily = () => {
        setHostFamily(null);
        HostFamiliesManager.getById(hostFamilyId).then(setHostFamily);
    };

    const getAnimalsToHostFamily = () => {
        setAnimalsToHostFamily([]);
        AnimalsManager.getByHostFamilyId(hostFamilyId).then(
            setAnimalsToHostFamily
        );
    };

    const refresh = () => {
        getHostFamily();
        getAnimalsToHostFamily();
    };

    useEffect(() => {
        refresh();
    }, []);

    const showDetail = (animalToHostFamily) => {
        props.history.push(`/animals/${animalToHostFamily.animal_id}`);
    };

    let content = <div>Chargement...</div>;

    if (hostFamily === undefined) {
        content = <div>Famille d'Accueil non trouvé</div>;
    } else if (hostFamily === null) {
        content = <div>Chargement...</div>;
    } else {
        content = (
            <div>
                <Row className={"justify-content-end"}>
                    <Col xs={"auto"}>
                        <Button onClick={refresh}>
                            <MdRefresh />
                        </Button>
                    </Col>
                </Row>

                <br />

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

                <br />

                <Card>
                    <CardHeader>
                        <h3>Historique des animaux</h3>
                    </CardHeader>
                    <CardBody>
                        <Table {...{ striped: true }}>
                            <thead>
                                <tr>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Date d'entrée</th>
                                    <th scope="col">Date de sortie</th>
                                    <th scope="col">Fiche de l'animal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {animalsToHostFamily.map(
                                    (animalToHostFamily, index) => (
                                        <tr>
                                            <th scope="row">
                                                {animalToHostFamily.animal_name}
                                            </th>
                                            <td>
                                                {
                                                    animalToHostFamily
                                                        .host_entry_date
                                                        .readable
                                                }
                                            </td>
                                            <td>
                                                {
                                                    animalToHostFamily
                                                        .host_exit_date.readable
                                                }
                                            </td>
                                            <td>
                                                <Button
                                                    color="info"
                                                    onClick={() =>
                                                        showDetail(
                                                            animalToHostFamily
                                                        )
                                                    }
                                                >
                                                    <MdAssignment />
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </Table>
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
