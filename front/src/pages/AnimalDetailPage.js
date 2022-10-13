import Page from "../components/Page";
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
import {
    MdRefresh,
    MdAssignment,
    MdOutlineModeEdit,
    MdSave,
} from "react-icons/md";

function AnimalDetailPage({ match, ...props }) {
    const animalId = match.params.id;
    const [animal, setAnimal] = useState(null);
    const [animalToHostFamilies, setAnimalToHostFamilies] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );

    const getAnimal = () => {
        setAnimal(null);
        AnimalsManager.getById(animalId)
            .then(setAnimal)
            .catch((err) => {
                console.error(err);
                // notificationSystem.addNotification({
                //     message:
                //         "Une erreur s'est produite pendant la récupération des données",
                //     level: "error",
                // });
            });
    };

    const getHostFamilies = () => {
        setAnimalToHostFamilies([]);
        HostFamiliesManager.getByAnimalId(animalId)
            .then(setAnimalToHostFamilies)
            .catch((err) => {
                console.error(err);
                // notificationSystem.addNotification({
                //     message:
                //         "Une erreur s'est produite pendant la récupération des données",
                //     level: "error",
                // });
            });
    };

    const refresh = () => {
        getAnimal();
        getHostFamilies();
    };

    useEffect(() => {
        refresh();
    }, []);

    const showDetail = (animalToHostFamily) => {
        props.history.push(
            `/hostFamilies/${animalToHostFamily.host_family_id}`
        );
    };

    const save = () => {
        setIsEditing(false);

        // Send new data to API
        AnimalsManager.update(animal)
            .then(() => {
                getAnimal();
                // notificationSystem.addNotification({
                //     message: "Animal mis à jour",
                //     level: "success",
                // });
            })
            .catch((err) => {
                console.error(err);
                getAnimal();
                // notificationSystem.addNotification({
                //     message:
                //         "Une erreur s'est produite pendant la mise à jour des données",
                //     level: "error",
                // });
            });
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
                        {!isEditing && (
                            <Button
                                color="primary"
                                onClick={() => setIsEditing(true)}
                            >
                                <MdOutlineModeEdit />
                            </Button>
                        )}
                        {isEditing && (
                            <Button color="success" onClick={() => save()}>
                                <MdSave />
                            </Button>
                        )}
                        <Button className="ml-2" onClick={refresh}>
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
                                            value={animal.icad}
                                            readOnly={!isEditing}
                                            onChange={(evt) =>
                                                setAnimal({
                                                    ...animal,
                                                    icad: evt.target.value,
                                                })
                                            }
                                        />
                                    </Col>
                                    <Col xs={12}>
                                        <Label>Espèce</Label>
                                        <Input
                                            value={animal.species}
                                            readOnly={!isEditing}
                                            onChange={(evt) =>
                                                setAnimal({
                                                    ...animal,
                                                    species: evt.target.value,
                                                })
                                            }
                                        />
                                    </Col>
                                    <Col xs={12}>
                                        <Label>Race</Label>
                                        <Input
                                            value={animal.race}
                                            readOnly={!isEditing}
                                            onChange={(evt) =>
                                                setAnimal({
                                                    ...animal,
                                                    race: evt.target.value,
                                                })
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Date de naissance</Label>
                                <Input
                                    type="date"
                                    value={animal.birthdate_object.input}
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        setAnimal({
                                            ...animal,
                                            birthdate_object: {
                                                ...animal.birthdate_object,
                                                input: evt.target.value,
                                            },
                                        })
                                    }
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>Signes distinctifs</Label>
                                <Input
                                    type="textarea"
                                    value={animal.distinctive_signs}
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        setAnimal({
                                            ...animal,
                                            distinctive_signs: evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Date de PEC</Label>
                                <Input
                                    type="date"
                                    value={animal.entry_date_object.input}
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        setAnimal({
                                            ...animal,
                                            entry_date_object: {
                                                ...animal.entry_date_object,
                                                input: evt.target.value,
                                            },
                                        })
                                    }
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>Lieu de PEC</Label>
                                <Input
                                    type="textarea"
                                    value={animal.place_of_care}
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        setAnimal({
                                            ...animal,
                                            place_of_care: evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Raisons de PEC</Label>
                                <Input
                                    type="textarea"
                                    value={animal.reason_for_care}
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        setAnimal({
                                            ...animal,
                                            reason_for_care: evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>Informations de PEC</Label>
                                <Input
                                    type="textarea"
                                    value={animal.care_infos}
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        setAnimal({
                                            ...animal,
                                            care_infos: evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Date de sortie</Label>
                                <Input
                                    type="date"
                                    value={animal.exit_date_object.input}
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        setAnimal({
                                            ...animal,
                                            exit_date_object: {
                                                ...animal.exit_date_object,
                                                input: evt.target.value,
                                            },
                                        })
                                    }
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>Raison de sortie</Label>
                                <Input
                                    type="textarea"
                                    value={animal.exit_reason}
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        setAnimal({
                                            ...animal,
                                            exit_reason: evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Date de décès</Label>
                                <Input
                                    type="date"
                                    value={animal.death_date_object.input}
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        setAnimal({
                                            ...animal,
                                            death_date_object: {
                                                ...animal.death_date_object,
                                                input: evt.target.value,
                                            },
                                        })
                                    }
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>Raison du décès</Label>
                                <Input
                                    type="textarea"
                                    value={animal.death_reason}
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        setAnimal({
                                            ...animal,
                                            death_reason: evt.target.value,
                                        })
                                    }
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
            notificationSystemCallback={(notifSystem) => {
                setNotificationSystem(notifSystem);
            }}
        >
            {content}
        </Page>
    );
}
export default AnimalDetailPage;
