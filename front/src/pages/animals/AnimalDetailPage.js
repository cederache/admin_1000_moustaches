import Page from "../../components/Page";
import React, { useEffect } from "react";
import {
    Accordion,
    AccordionItem,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Input,
    Label,
    Row,
    AccordionHeader,
    AccordionBody,
} from "reactstrap";
import AnimalsManager from "../../managers/animals.manager";
import HostFamiliesManager from "../../managers/hostFamilies.manager";
import { useState } from "react";
import { MdRefresh, MdOutlineModeEdit, MdSave, MdDelete } from "react-icons/md";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import BooleanNullableDropdown from "../../components/BooleanNullableDropdown";
import BooleanDropdown from "../../components/BooleanDropdown";
import { SPECIES_ID } from "../../utils/constants";
import HostFamiliesHistory from "./HostFamiliesHistory";
import VeterinarianInterventionsHistory from "./VeterinarianInterventionsHistory";
import VeterinarianInterventionsManager from "../../managers/veterinarianInterventions.manager";
import Dropdown from "../../components/Dropdown";

function AnimalDetailPage({ match, ...props }) {
    const animalId = match.params.id;
    const [animal, setAnimal] = useState(null);
    const [animalToHostFamilies, setAnimalToHostFamilies] = useState([]);
    const [species, setSpecies] = useState([]);
    const [veterinarianInterventions, setVeterinarianInterventions] = useState(
        []
    );
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
        useState(false);

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );

    // Accordions
    const [openInfo, setOpenInfo] = useState("");

    const toggleInfo = (id) => {
        if (openInfo === id) {
            setOpenInfo();
        } else {
            setOpenInfo(id);
        }
    };

    const [openPEC, setOpenPEC] = useState("");

    const togglePEC = (id) => {
        if (openPEC === id) {
            setOpenPEC();
        } else {
            setOpenPEC(id);
        }
    };

    const [openHealth, setOpenHealth] = useState("");

    const toggleHealth = (id) => {
        if (openHealth === id) {
            setOpenHealth();
        } else {
            setOpenHealth(id);
        }
    };

    const [openExit, setOpenExit] = useState("");

    const toggleExit = (id) => {
        if (openExit === id) {
            setOpenExit();
        } else {
            setOpenExit(id);
        }
    };

    const [openDeath, setOpenDeath] = useState("");

    const toggleDeath = (id) => {
        if (openDeath === id) {
            setOpenDeath();
        } else {
            setOpenDeath(id);
        }
    };

    const getAnimal = () => {
        setAnimal(null);
        return AnimalsManager.getById(animalId)
            .then(setAnimal)
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la récupération des données",
                    level: "error",
                });
            });
    };

    const getHostFamilies = () => {
        setAnimalToHostFamilies([]);
        return HostFamiliesManager.getByAnimalId(animalId)
            .then(setAnimalToHostFamilies)
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la récupération des données",
                    level: "error",
                });
            });
    };

    const getSpecies = () => {
        setSpecies([]);
        return AnimalsManager.getSpecies()
            .then(setSpecies)
            .catch((err) => {
                console.log(err);
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la récupération des données",
                    level: "error",
                });
            });
    };

    const getVeterinarianInterventions = () => {
        setVeterinarianInterventions([]);
        return VeterinarianInterventionsManager.getByAnimalId(animalId)
            .then(setVeterinarianInterventions)
            .catch((err) => {
                console.log(err);
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la récupération des données",
                    level: "error",
                });
            });
    };

    const refresh = () => {
        if (animalId !== "new") {
            getSpecies()
                .then(getAnimal)
                .then(getHostFamilies)
                .then(getVeterinarianInterventions);
        } else {
            getSpecies();
            setAnimal(AnimalsManager.createAnimal());
            setIsEditing(true);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        if (
            animalId === "new" &&
            animal !== null &&
            species.length > 0 &&
            animal.species_id === undefined
        ) {
            setAnimal({
                ...animal,
                species: species[0].name,
                species_id: species[0].id,
            });
        }
    }, [animal, species]);

    const showDetail = (animalToHostFamily) => {
        props.history.push(
            `/hostFamilies/${animalToHostFamily.host_family_id}`
        );
    };

    const save = () => {
        setIsEditing(false);
        if (animalId === "new") {
            // Send new data to API
            AnimalsManager.create(animal)
                .then((updatedAnimal) => {
                    notificationSystem.addNotification({
                        message: "Animal créé",
                        level: "success",
                    });
                    props.history.push(`/animals/${updatedAnimal.id}`);
                    setAnimal(updatedAnimal);
                })
                .catch((err) => {
                    console.error(err);
                    notificationSystem.addNotification({
                        message:
                            "Une erreur s'est produite pendant la création des données",
                        level: "error",
                    });
                });
            return;
        }

        // Send new data to API
        AnimalsManager.update(animal)
            .then(() => {
                getAnimal();
                notificationSystem.addNotification({
                    message: "Animal mis à jour",
                    level: "success",
                });
            })
            .catch((err) => {
                console.error(err);
                getAnimal();
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la mise à jour des données",
                    level: "error",
                });
            });
    };

    const deleteA = () => {
        AnimalsManager.delete(animal)
            .then(() => {
                notificationSystem.addNotification({
                    message: "Animal supprimé",
                    level: "success",
                });
                props.history.push("/animals");
            })
            .catch((err) => {
                console.error(err);
                getAnimal();
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la suppression des données",
                    level: "error",
                });
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
                        {animalId !== "new" && isEditing && (
                            <Button
                                color="danger"
                                onClick={() =>
                                    setShowDeleteConfirmationModal(true)
                                }
                            >
                                <MdDelete />
                            </Button>
                        )}
                        {!isEditing && (
                            <Button
                                className="ms-2"
                                color="primary"
                                onClick={() => setIsEditing(true)}
                            >
                                <MdOutlineModeEdit />
                            </Button>
                        )}
                        {isEditing && (
                            <Button
                                className="ms-2"
                                color="success"
                                onClick={() => save()}
                            >
                                <MdSave />
                            </Button>
                        )}
                        <Button className="ms-2" onClick={refresh}>
                            <MdRefresh />
                        </Button>
                    </Col>
                </Row>

                <br />

                <Card>
                    <CardHeader>
                        {animalId === "new" && <h2>Nouvel Animal</h2>}
                        {animalId !== "new" && <h2>{animal.name}</h2>}
                    </CardHeader>
                    <CardBody>
                        {(animalId === "new" || isEditing === true) && (
                            <Row>
                                <Col xs={12}>
                                    <Label>Nom</Label>
                                    <Input
                                        value={animal.name || ""}
                                        disabled={!isEditing}
                                        onChange={(evt) =>
                                            setAnimal({
                                                ...animal,
                                                name: evt.target.value,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                        )}
                        <Row className="text-center">
                            <Col xs={4}>
                                <Label>Diffusable</Label>
                                <BooleanDropdown
                                    value={animal.broadcastable}
                                    disabled={!isEditing}
                                    onChange={(newValue) =>
                                        setAnimal({
                                            ...animal,
                                            broadcastable: newValue,
                                        })
                                    }
                                />
                            </Col>
                            <Col xs={4}>
                                <Label>Réservable</Label>
                                <BooleanDropdown
                                    value={animal.bookable}
                                    disabled={!isEditing}
                                    onChange={(newValue) =>
                                        setAnimal({
                                            ...animal,
                                            bookable: newValue,
                                        })
                                    }
                                />
                            </Col>
                            <Col xs={4}>
                                <Label>Adopté.e</Label>
                                <BooleanDropdown
                                    value={animal.adopted}
                                    disabled={!isEditing}
                                    onChange={(newValue) =>
                                        setAnimal({
                                            ...animal,
                                            adopted: newValue,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Accordion
                            className="pb-3"
                            open={openInfo}
                            toggle={toggleInfo}
                        >
                            <AccordionItem>
                                <AccordionHeader targetId="1">
                                    Informations
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <Row>
                                        <Col xs={6}>
                                            <Label>Photo</Label>
                                        </Col>
                                        <Col xs={6}>
                                            <Row>
                                                <Col xs={12}>
                                                    <Label>ICAD</Label>
                                                    <Input
                                                        value={
                                                            animal.icad || ""
                                                        }
                                                        disabled={!isEditing}
                                                        onChange={(evt) =>
                                                            setAnimal({
                                                                ...animal,
                                                                icad: evt.target
                                                                    .value,
                                                            })
                                                        }
                                                    />
                                                </Col>
                                                <Col xs={12}>
                                                    <Label>Espèce</Label>
                                                    <Dropdown
                                                        withNewLine={true}
                                                        color={"primary"}
                                                        disabled={!isEditing}
                                                        value={{
                                                            id: animal.species_id,
                                                            name: animal.species,
                                                        }}
                                                        values={species}
                                                        valueDisplayName={(
                                                            aSpecies
                                                        ) => aSpecies.name}
                                                        valueActiveCheck={(
                                                            aSpecies
                                                        ) =>
                                                            aSpecies.id ===
                                                            animal.species_id
                                                        }
                                                        key={"species"}
                                                        onChange={(
                                                            newSpecies
                                                        ) =>
                                                            setAnimal({
                                                                ...animal,
                                                                species:
                                                                    newSpecies.name,
                                                                species_id:
                                                                    newSpecies.id,
                                                            })
                                                        }
                                                    />
                                                </Col>
                                                <Col xs={12}>
                                                    <Label>Race</Label>
                                                    <Input
                                                        value={
                                                            animal.race || ""
                                                        }
                                                        disabled={!isEditing}
                                                        onChange={(evt) =>
                                                            setAnimal({
                                                                ...animal,
                                                                race: evt.target
                                                                    .value,
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
                                                value={
                                                    animal.birthdate_object
                                                        .input
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        birthdate_object: {
                                                            ...animal.birthdate_object,
                                                            input: evt.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <Label>Signes distinctifs</Label>
                                            <Input
                                                type="textarea"
                                                value={
                                                    animal.distinctive_signs ||
                                                    ""
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        distinctive_signs:
                                                            evt.target.value,
                                                    })
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </AccordionBody>
                            </AccordionItem>
                        </Accordion>
                        <Accordion
                            className="pb-3"
                            open={openPEC}
                            toggle={togglePEC}
                        >
                            <AccordionItem>
                                <AccordionHeader targetId="1">
                                    Prise en charge
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <Row>
                                        <Col xs={6}>
                                            <Label>Date de PEC</Label>
                                            <Input
                                                type="date"
                                                value={
                                                    animal.entry_date_object
                                                        .input
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        entry_date_object: {
                                                            ...animal.entry_date_object,
                                                            input: evt.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <Label>Lieu de PEC</Label>
                                            <Input
                                                type="textarea"
                                                value={
                                                    animal.place_of_care || ""
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        place_of_care:
                                                            evt.target.value,
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
                                                value={
                                                    animal.reason_for_care || ""
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        reason_for_care:
                                                            evt.target.value,
                                                    })
                                                }
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <Label>Informations de PEC</Label>
                                            <Input
                                                type="textarea"
                                                value={animal.care_infos || ""}
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        care_infos:
                                                            evt.target.value,
                                                    })
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </AccordionBody>
                            </AccordionItem>
                        </Accordion>
                        <Accordion
                            className="pb-3"
                            open={openHealth}
                            toggle={toggleHealth}
                        >
                            <AccordionItem>
                                <AccordionHeader targetId="1">
                                    Santé / Comportement
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <Row>
                                        <Col xs={6}>
                                            <Label>Primo vaccination</Label>
                                            <Input
                                                type="date"
                                                value={
                                                    animal
                                                        .first_vaccination_date_object
                                                        .input
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        first_vaccination_date_object:
                                                            {
                                                                ...animal.first_vaccination_date_object,
                                                                input: evt
                                                                    .target
                                                                    .value,
                                                            },
                                                    })
                                                }
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <Label>Rappel de vaccin</Label>
                                            <Input
                                                type="date"
                                                value={
                                                    animal
                                                        .second_vaccination_date_object
                                                        .input
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        second_vaccination_date_object:
                                                            {
                                                                ...animal.second_vaccination_date_object,
                                                                input: evt
                                                                    .target
                                                                    .value,
                                                            },
                                                    })
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <Label>Date de stérilisation</Label>
                                            <Input
                                                type="date"
                                                value={
                                                    animal
                                                        .sterilisation_date_object
                                                        .input
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        sterilisation_date_object:
                                                            {
                                                                ...animal.sterilisation_date_object,
                                                                input: evt
                                                                    .target
                                                                    .value,
                                                            },
                                                    })
                                                }
                                            />
                                        </Col>
                                        {animal.species_id ===
                                            SPECIES_ID.CAT && (
                                            <>
                                                <Col xs={6} md={3}>
                                                    <Label>Négatif FIV</Label>
                                                    <BooleanNullableDropdown
                                                        value={
                                                            animal.fiv_negative
                                                        }
                                                        disabled={!isEditing}
                                                        onChange={(
                                                            newValue
                                                        ) => {
                                                            setAnimal({
                                                                ...animal,
                                                                fiv_negative:
                                                                    newValue,
                                                            });
                                                        }}
                                                    />
                                                </Col>
                                                <Col xs={6} md={3}>
                                                    <Label>Négatif FELV</Label>
                                                    <BooleanNullableDropdown
                                                        value={
                                                            animal.felv_negative
                                                        }
                                                        disabled={!isEditing}
                                                        onChange={(
                                                            newValue
                                                        ) => {
                                                            setAnimal({
                                                                ...animal,
                                                                felv_negative:
                                                                    newValue,
                                                            });
                                                        }}
                                                    />
                                                </Col>
                                            </>
                                        )}
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <Label>
                                                Particularité de santé
                                            </Label>
                                            <Input
                                                type="textarea"
                                                value={
                                                    animal.health_issues || ""
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        health_issues:
                                                            evt.target.value,
                                                    })
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <Label>Comportement</Label>
                                            <Input
                                                type="textarea"
                                                value={animal.behaviour || ""}
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        behaviour:
                                                            evt.target.value,
                                                    })
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </AccordionBody>
                            </AccordionItem>
                        </Accordion>
                        <Accordion
                            className="pb-3"
                            open={openExit}
                            toggle={toggleExit}
                        >
                            <AccordionItem>
                                <AccordionHeader targetId="1">
                                    Sortie
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <Row>
                                        <Col xs={6}>
                                            <Label>Date de sortie</Label>
                                            <Input
                                                type="date"
                                                value={
                                                    animal.exit_date_object
                                                        .input
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        exit_date_object: {
                                                            ...animal.exit_date_object,
                                                            input: evt.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <Label>Raison de sortie</Label>
                                            <Input
                                                type="textarea"
                                                value={animal.exit_reason || ""}
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        exit_reason:
                                                            evt.target.value,
                                                    })
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </AccordionBody>
                            </AccordionItem>
                        </Accordion>
                        <Accordion
                            className="pb-3"
                            open={openDeath}
                            toggle={toggleDeath}
                        >
                            <AccordionItem>
                                <AccordionHeader targetId="1">
                                    Décès
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <Row>
                                        <Col xs={6}>
                                            <Label>Date de décès</Label>
                                            <Input
                                                type="date"
                                                value={
                                                    animal.death_date_object
                                                        .input
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        death_date_object: {
                                                            ...animal.death_date_object,
                                                            input: evt.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <Label>Raison du décès</Label>
                                            <Input
                                                type="textarea"
                                                value={
                                                    animal.death_reason || ""
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        death_reason:
                                                            evt.target.value,
                                                    })
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </AccordionBody>
                            </AccordionItem>
                        </Accordion>
                    </CardBody>
                </Card>

                {animalId !== "new" && (
                    <>
                        <br />
                        <VeterinarianInterventionsHistory
                            animalId={animalId}
                            veterinarianInterventions={
                                veterinarianInterventions
                            }
                            notificationSystem={notificationSystem}
                            shouldRefresh={() => getVeterinarianInterventions()}
                            {...props}
                        />
                        <br />
                        <HostFamiliesHistory
                            animalToHostFamilies={animalToHostFamilies}
                            {...props}
                        />
                    </>
                )}
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

            <DeleteConfirmationModal
                show={showDeleteConfirmationModal}
                handleClose={(confirmed) => {
                    setShowDeleteConfirmationModal(false);
                    if (confirmed) {
                        deleteA();
                    }
                }}
                bodyEntityName={"un Animal"}
            />
        </Page>
    );
}
export default AnimalDetailPage;
