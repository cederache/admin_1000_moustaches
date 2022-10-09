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
import AnimalsManager from "../managers/animals.manager";
import HostFamiliesManager from "../managers/hostFamilies.manager";
import { useState } from "react";
import { MdRefresh, MdAssignment } from "react-icons/md";

function AnimalDetailPage({ match, ...props }) {
    const animalId = match.params.id;
    const [animal, setAnimal] = useState(null);
    const [animalToHostFamilies, setAnimalToHostFamilies] = useState([]);

    const getAnimal = () => {
        setAnimal(null);
        AnimalsManager.getById(animalId).then(setAnimal);
    };

    const getHostFamilies = () => {
        setAnimalToHostFamilies([]);
        HostFamiliesManager.getByAnimalId(animalId).then(
            setAnimalToHostFamilies
        );
    };

    const refresh = () => {
        getAnimal();
        getHostFamilies();
    };

    useEffect(() => {
        refresh();
    }, []);

    console.log(animalToHostFamilies);

    const showDetail = (animalToHostFamily) => {
        props.history.push(
            `/hostFamilies/${animalToHostFamily.host_family_id}`
        );
    };

    let content = <div>Chargement...</div>;

    if (animal === undefined) {
        content = <div>Animal non trouvé</div>;
    } else if (animal === null) {
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
                        <h2>{animal.name}</h2>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs={6}>
                                <Label>Photo</Label>
                            </Col>
                            <Col xs={6}>
                                <Row>
                                    <Col xs={12}>
                                        <Label>ICAD</Label>
                                        <Input
                                            value={animal.icad || "-"}
                                            readOnly
                                        />
                                    </Col>
                                    <Col xs={12}>
                                        <Label>Espèce</Label>
                                        <Input
                                            value={animal.species || "-"}
                                            readOnly
                                        />
                                    </Col>
                                    <Col xs={12}>
                                        <Label>Race</Label>
                                        <Input
                                            value={animal.race || "-"}
                                            readOnly
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Date de naissance</Label>
                                {(animal.birthdate || {}).input === null && (
                                    <Input value="-" readOnly />
                                )}
                                {(animal.birthdate || {}).input !== null && (
                                    <Input
                                        type="date"
                                        value={animal.birthdate.input}
                                        readOnly
                                    />
                                )}
                            </Col>
                            <Col xs={6}>
                                <Label>Signes distinctifs</Label>
                                <Input
                                    type="textarea"
                                    value={animal.distinctive_signs || "-"}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Date de PEC</Label>
                                {(animal.entry_date || {}).input === null && (
                                    <Input value="-" readOnly />
                                )}
                                {(animal.entry_date || {}).input !== null && (
                                    <Input
                                        type="date"
                                        value={animal.entry_date.input}
                                        readOnly
                                    />
                                )}
                            </Col>
                            <Col xs={6}>
                                <Label>Lieu de PEC</Label>
                                <Input
                                    type="textarea"
                                    value={animal.place_of_care || "-"}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Raisons de PEC</Label>
                                <Input
                                    type="textarea"
                                    value={animal.reason_for_care || "-"}
                                    readOnly
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>Informations de PEC</Label>
                                <Input
                                    type="textarea"
                                    value={animal.care_infos || "-"}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Date de sortie</Label>
                                {(animal.exit_date || {}).input === null && (
                                    <Input value="-" readOnly />
                                )}
                                {(animal.exit_date || {}).input !== null && (
                                    <Input
                                        type="date"
                                        value={animal.exit_date.input}
                                        readOnly
                                    />
                                )}
                            </Col>
                            <Col xs={6}>
                                <Label>Raison de sortie</Label>
                                <Input
                                    type="textarea"
                                    value={animal.exit_reason || "-"}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Date de décès</Label>
                                {(animal.death_date || {}).input === null && (
                                    <Input value="-" readOnly />
                                )}
                                {(animal.death_date || {}).input !== null && (
                                    <Input
                                        type="date"
                                        value={animal.death_date.input}
                                        readOnly
                                    />
                                )}
                            </Col>
                            <Col xs={6}>
                                <Label>Raison du décès</Label>
                                <Input
                                    type="textarea"
                                    value={animal.death_reason || "-"}
                                    readOnly
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <br />

                <Card>
                    <CardHeader>
                        <h3>Historique des Familles d'Accueil</h3>
                    </CardHeader>
                    <CardBody>
                        <Table {...{ striped: true }}>
                            <thead>
                                <tr>
                                    <th scope="col">Nom Prénom</th>
                                    <th scope="col">Date d'entrée</th>
                                    <th scope="col">Date de sortie</th>
                                    <th scope="col">Fiche de la FA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {animalToHostFamilies.map(
                                    (animalToHostFamily, index) => (
                                        <tr>
                                            <th scope="row">
                                                {
                                                    animalToHostFamily.display_name
                                                }
                                            </th>
                                            <td>
                                                {
                                                    animalToHostFamily
                                                        .entry_date.readable
                                                }
                                            </td>
                                            <td>
                                                {
                                                    animalToHostFamily.exit_date
                                                        .readable
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
            className="AnimalPage"
            title="Détail de l'animal"
            breadcrumbs={[
                { name: "Animaux", to: "/animals" },
                { name: "Animal", active: true },
            ]}
        >
            {content}
        </Page>
    );
}
export default AnimalDetailPage;
