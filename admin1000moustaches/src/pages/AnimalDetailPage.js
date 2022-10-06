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
import AnimalsManager from "../managers/animals.manager";
import { useState } from "react";
import { MdRefresh } from "react-icons/md";

function AnimalDetailPage({ match, ...props }) {
    const animalId = match.params.id;
    const [animal, setAnimal] = useState({});

    const getAnimal = () => {
        AnimalsManager.getById(animalId).then(setAnimal);
    };

    useEffect(() => {
        getAnimal();
    }, []);

    if (animal === undefined) {
        return (
            <Page
                className="AnimalPage"
                title="Détail de l'animal"
                breadcrumbs={[
                    { name: "Animaux", to: "/animals" },
                    { name: "Animal", active: true },
                ]}
            >
                <div>Animal non trouvé</div>
            </Page>
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
            <Row>
                <Col xs={{ span: 1, offset: 11 }}>
                    <Button onClick={getAnimal}>
                        <MdRefresh />
                    </Button>
                </Col>
            </Row>

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
                            {(animal.birthdate || {}).rawValue == null && (
                                <Input value="-" readOnly />
                            )}
                            {(animal.birthdate || {}).rawValue != null && (
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
                            {(animal.entry_date || {}).rawValue == null && (
                                <Input value="-" readOnly />
                            )}
                            {(animal.entry_date || {}).rawValue != null && (
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
                            {(animal.exit_date || {}).rawValue == null && (
                                <Input value="-" readOnly />
                            )}
                            {(animal.exit_date || {}).rawValue != null && (
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
                            {(animal.death_date || {}).rawValue == null && (
                                <Input value="-" readOnly />
                            )}
                            {(animal.death_date || {}).rawValue != null && (
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
        </Page>
    );
}
export default AnimalDetailPage;
