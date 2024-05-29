import React, { FC, useEffect, useState } from "react";
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
import AnimalsManager, { Sexe } from "../../../managers/animals.manager";
import HostFamiliesManager from "../../../managers/hostFamilies.manager";
import { MdRefresh, MdOutlineModeEdit, MdSave, MdDelete } from "react-icons/md";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import BooleanNullableDropdown from "../../components/BooleanNullableDropdown";
import { SPECIES_ID } from "../../../utils/constants";
import HostFamiliesHistory from "./HostFamiliesHistory";
import VeterinarianInterventionsHistory from "./VeterinarianInterventionsHistory";
import VeterinarianInterventionsManager from "../../../managers/veterinarianInterventions.manager";
import Dropdown from "../../components/Dropdown";
import NullableDropdown from "../../components/NullableDropdown";
import AnimalsToHostFamiliesManager from "../../../managers/animalsToHostFamilies.manager";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import NotificationSystem from "react-notification-system";
import AnimalToHostFamily from "../../../logic/entities/AnimalToHostFamily";
import Species from "../../../logic/entities/Species";
import HostFamily from "../../../logic/entities/HostFamily";
import VeterinarianIntervention from "../../../logic/entities/VeterinarianIntervention";
import Animal from "../../../logic/entities/Animal";
import { useHistory } from "react-router-dom";

interface AnimalDetailPageProps {
    match: {
        params: {
            id: string;
        };
    };
    [key: string]: any;
}

const AnimalDetailPage: FC<AnimalDetailPageProps> = ({ match, ...props }) => {
    const animalId = match.params.id;
    const [animal, setAnimal] = useState<Animal | null>(null);
    const [animalToHostFamilies, setAnimalToHostFamilies] = useState<
        AnimalToHostFamily[]
    >([]);
    const [species, setSpecies] = useState<Species[]>([]);
    const [hostFamilies, setHostFamilies] = useState<HostFamily[]>([]);
    const [sexes, setSexes] = useState<Sexe[]>([]);
    const [veterinarianInterventions, setVeterinarianInterventions] = useState<
        VeterinarianIntervention[]
    >([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
        useState<boolean>(false);

    const [notificationSystem, setNotificationSystem] =
        useState<NotificationSystem | null>(null);

    const history = useHistory();

    // Accordions
    const [openInfo, setOpenInfo] = useState("");

    const toggleInfo = (id: string) => {
        if (openInfo === id) {
            setOpenInfo("");
        } else {
            setOpenInfo(id);
        }
    };

    const [openPEC, setOpenPEC] = useState("");

    const togglePEC = (id: string) => {
        if (openPEC === id) {
            setOpenPEC("");
        } else {
            setOpenPEC(id);
        }
    };

    const [openHealth, setOpenHealth] = useState("");

    const toggleHealth = (id: string) => {
        if (openHealth === id) {
            setOpenHealth("");
        } else {
            setOpenHealth(id);
        }
    };

    const [openBehaviour, setOpenBehaviour] = useState("");

    const toggleBehaviour = (id: string) => {
        if (openBehaviour === id) {
            setOpenBehaviour("");
        } else {
            setOpenBehaviour(id);
        }
    };


    const [openExit, setOpenExit] = useState("");

    const toggleExit = (id: string) => {
        if (openExit === id) {
            setOpenExit("");
        } else {
            setOpenExit(id);
        }
    };

    const [openDeath, setOpenDeath] = useState("");

    const toggleDeath = (id: string) => {
        if (openDeath === id) {
            setOpenDeath("");
        } else {
            setOpenDeath(id);
        }
    };

    const getAnimal = () => {
        setAnimal(null);
        let id = parseInt(animalId);
        if (isNaN(id)) {
            return Promise.resolve(null);
        }
        return AnimalsManager.getById(id)
            .then((animal) => {
                if (species.length === 0) {
                    return animal;
                }
                let specie = species.find((sp) => sp.id === animal.species_id);
                if (specie !== undefined) {
                    animal.setSpecies(specie);
                } else {
                    console.warn(
                        "Can't find species for animal",
                        animal,
                        species
                    );
                }
                return animal;
            })
            .then(setAnimal)
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const getAnimalToHostFamilies = () => {
        setAnimalToHostFamilies([]);
        let id = parseInt(animalId);
        if (isNaN(id)) {
            return;
        }
        return HostFamiliesManager.getByAnimalId(id)
            .then(setAnimalToHostFamilies)
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
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
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const getSexes = () => {
        setSexes([]);
        return AnimalsManager.getSexes()
            .then(setSexes)
            .catch((err) => {
                console.log(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const getVeterinarianInterventions = () => {
        setVeterinarianInterventions([]);
        let id = parseInt(animalId);
        if (isNaN(id)) {
            return;
        }
        return VeterinarianInterventionsManager.getByAnimalId(id)
            .then(setVeterinarianInterventions)
            .catch((err) => {
                console.log(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const getHostFamilies = () => {
        setHostFamilies([]);
        return HostFamiliesManager.getAll()
            .then(setHostFamilies)
            .catch((err) => {
                console.log(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const refresh = () => {
        if (animalId !== "new") {
            getSpecies()
                .then(getSexes)
                .then(getAnimal)
                .then(getAnimalToHostFamilies)
                .then(getHostFamilies)
                .then(getVeterinarianInterventions);
        } else {
            setOpenInfo("1");
            setOpenPEC("1");
            setOpenHealth("1");

            getSpecies().then(getSexes).then(getHostFamilies);
            setAnimal(AnimalsManager.createAnimal());
            setIsEditing(true);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    // Auto select first species for new animal
    useEffect(() => {
        if (
            animalId === "new" &&
            animal !== null &&
            species.length > 0 &&
            animal.species_id === undefined
        ) {
            setAnimal({
                ...animal,
                species_name: species[0].name,
            });
        }
    }, [animalId, animal, species]);

    useEffect(() => {
        if (animal !== null && species.length > 0) {
            let specie = species.find((sp) => sp.id === animal.species_id);
            if (specie !== undefined) {
                animal.setSpecies(specie);
            } else {
                console.warn("Can't find species for animal", animal, species);
            }
        }
    }, [species, animal]);

    const save = () => {
        setIsEditing(false);
        if (animal === null) {
            return;
        }
        if (animalId === "new") {
            // Send new data to API
            AnimalsManager.create(animal)
                .then((updatedAnimal) => {
                    notificationSystem?.addNotification({
                        message: "Animal créé",
                        level: "success",
                    });
                    history.push(`/animals/${updatedAnimal.id}`);
                    setAnimal(updatedAnimal);
                })
                .catch((err) => {
                    console.error(err);
                    notificationSystem?.addNotification({
                        message: `Une erreur s'est produite pendant la création des données\n${err}`,
                        level: "error",
                    });
                });
            return;
        }

        // Send new data to API
        AnimalsManager.update(animal)
            .then(() => {
                getAnimal().then(() => {
                    var exitOrDeathDate = animal.death_date || animal.exit_date;
                    if (
                        exitOrDeathDate !== undefined &&
                        exitOrDeathDate !== ""
                    ) {
                        animalToHostFamilies
                            .filter((athf) => athf.exit_date === undefined)
                            .forEach((athf) => {
                                AnimalsToHostFamiliesManager.update(
                                    new AnimalToHostFamily(
                                        athf.animal_id,
                                        athf.animal_name,
                                        athf.host_family_id,
                                        athf.entry_date,
                                        exitOrDeathDate
                                    )
                                );
                            });
                    }
                });
                notificationSystem?.addNotification({
                    message: "Animal mis à jour",
                    level: "success",
                });
            })
            .catch((err) => {
                console.error(err);
                getAnimal();
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la mise à jour des données\n${err}`,
                    level: "error",
                });
            });
    };

    const deleteA = () => {
        if (animal === null) {
            return;
        }
        AnimalsManager.delete(animal)
            .then(() => {
                notificationSystem?.addNotification({
                    message: "Animal supprimé",
                    level: "success",
                });
                history.push("/animals");
            })
            .catch((err) => {
                console.error(err);
                getAnimal();
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la suppression des données\n${err}`,
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
                            <Col md={4} lg={3}>
                                <Label>Diffusable</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={animal.broadcastable ?? null}
                                    disabled={!isEditing || animal.adopted}
                                    onChange={(newValue) =>
                                        setAnimal({
                                            ...animal,
                                            broadcastable:
                                                newValue ?? undefined,
                                        })
                                    }
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>Réservable</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={animal.bookable ?? null}
                                    disabled={!isEditing || animal.adopted}
                                    onChange={(newValue) =>
                                        setAnimal({
                                            ...animal,
                                            bookable: newValue ?? undefined,
                                        })
                                    }
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>Réservé·e</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={animal.reserved ?? null}
                                    disabled={!isEditing || animal.adopted}
                                    onChange={(newValue) =>
                                        setAnimal({
                                            ...animal,
                                            reserved: newValue ?? undefined,
                                        })
                                    }
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>Duplicata ICAD nécessaire ?</Label>
                                <NullableDropdown
                                    withNewLine={true}
                                    color={
                                        animal.need_icad_duplicate === null ||
                                        animal.need_icad_duplicate === undefined
                                            ? "warning"
                                            : animal.need_icad_duplicate ===
                                              "received"
                                            ? "success"
                                            : animal.need_icad_duplicate ===
                                              "waiting"
                                            ? "info"
                                            : "danger"
                                    }
                                    value={animal.need_icad_duplicate}
                                    values={["no", "waiting", "received"]}
                                    valueDisplayName={(value) =>
                                        value === null || value === undefined
                                            ? "NSP"
                                            : value === "received"
                                            ? "Oui, reçu"
                                            : value === "waiting"
                                            ? "Oui, demandé"
                                            : "Non"
                                    }
                                    valueActiveCheck={(value) =>
                                        animal.need_icad_duplicate === value
                                    }
                                    key={"need_icad_duplicate"}
                                    disabled={!isEditing || animal.adopted}
                                    onChange={(newNeedIcadDuplicate) => {
                                        setAnimal({
                                            ...animal,
                                            need_icad_duplicate:
                                                newNeedIcadDuplicate,
                                        });
                                    }}
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>Adopté·e</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={animal.adopted ?? null}
                                    disabled={!isEditing}
                                    onChange={(newValue) =>
                                        setAnimal({
                                            ...animal,
                                            adopted: newValue ?? undefined,
                                        })
                                    }
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>Album créé</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={animal.album_created ?? null}
                                    disabled={!isEditing || animal.adopted}
                                    onChange={(newValue) =>
                                        setAnimal({
                                            ...animal,
                                            album_created:
                                                newValue ?? undefined,
                                        })
                                    }
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>Contrat envoyé</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={animal.contract_sent ?? null}
                                    disabled={!isEditing || animal.adopted}
                                    onChange={(newValue) =>
                                        setAnimal({
                                            ...animal,
                                            contract_sent:
                                                newValue ?? undefined,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Accordion
                            className="pb-3"
                            open={openInfo}
                            {...{
                                toggle: toggleInfo,
                            }}
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
                                            </Row>
                                            <Row>
                                                <Col xs={6}>
                                                    <Label>Espèce</Label>
                                                    <Dropdown
                                                        withNewLine={true}
                                                        color={"primary"}
                                                        disabled={!isEditing}
                                                        value={{
                                                            id: animal.species_id,
                                                            name: animal.species_name,
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
                                                                species_name:
                                                                    newSpecies.name,
                                                                species_id:
                                                                    newSpecies.id,
                                                            })
                                                        }
                                                    />
                                                </Col>
                                                <Col xs={6}>
                                                    <Label>Sexe</Label>
                                                    <NullableDropdown
                                                        withNewLine={true}
                                                        color={"primary"}
                                                        disabled={!isEditing}
                                                        value={
                                                            animal.sexe ===
                                                                undefined ||
                                                            animal.sexe === null
                                                                ? null
                                                                : sexes.find(
                                                                      (aSexe) =>
                                                                          aSexe.key ===
                                                                          animal.sexe
                                                                  )
                                                        }
                                                        values={sexes}
                                                        valueDisplayName={(
                                                            aSexe
                                                        ) => aSexe.value}
                                                        valueActiveCheck={(
                                                            aSexe
                                                        ) =>
                                                            aSexe.key ===
                                                            animal.sexe
                                                        }
                                                        key={"sexes"}
                                                        onChange={(newSexe) =>
                                                            setAnimal({
                                                                ...animal,
                                                                sexe: newSexe.key,
                                                            })
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={6}>
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
                                                value={animal.birthdate}
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        birthdate:
                                                            evt.target.value,
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
                            {...{
                                toggle: togglePEC,
                            }}
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
                                                value={animal.entry_date}
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        entry_date:
                                                            evt.target.value,
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
                                    <Row>
                                        <Col xs={12}>
                                            <Label>Cédant</Label>
                                            <Input
                                                type="textarea"
                                                value={animal.transferor || ""}
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        transferor:
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
                            {...{
                                toggle: toggleHealth,
                            }}
                        >
                            <AccordionItem>
                                <AccordionHeader targetId="1">
                                    Santé
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <Row>
                                        <Col xs={6}>
                                            <Label>Primo vaccination</Label>
                                            <Input
                                                type="date"
                                                value={
                                                    animal.first_vaccination_date
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        first_vaccination_date:
                                                            evt.target.value,
                                                    })
                                                }
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <Label>Rappel de vaccin</Label>
                                            <Input
                                                type="date"
                                                value={
                                                    animal.second_vaccination_date
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        second_vaccination_date:
                                                            evt.target.value,
                                                    })
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6} md={3}>
                                            <Label>Stérilisé·e</Label>
                                            <BooleanNullableDropdown
                                                withNewLine={true}
                                                value={
                                                    animal.sterilised ?? null
                                                }
                                                disabled={!isEditing}
                                                onChange={(newValue) => {
                                                    setAnimal({
                                                        ...animal,
                                                        sterilised:
                                                            newValue ??
                                                            undefined,
                                                    });
                                                }}
                                            />
                                        </Col>
                                        {animal.species_id ===
                                            SPECIES_ID.CAT && (
                                            <>
                                                <Col xs={6} md={3}>
                                                    <Label>
                                                        Extérieur obligatoire
                                                    </Label>
                                                    <BooleanNullableDropdown
                                                        withNewLine={true}
                                                        value={
                                                            animal.need_external_access ??
                                                            null
                                                        }
                                                        disabled={!isEditing}
                                                        onChange={(
                                                            newValue
                                                        ) => {
                                                            setAnimal({
                                                                ...animal,
                                                                need_external_access:
                                                                    newValue ??
                                                                    undefined,
                                                            });
                                                        }}
                                                    />
                                                </Col>
                                                <Col xs={6} md={3}>
                                                    <Label>Négatif FIV</Label>
                                                    <BooleanNullableDropdown
                                                        withNewLine={true}
                                                        value={
                                                            animal.fiv_negative ??
                                                            null
                                                        }
                                                        disabled={!isEditing}
                                                        onChange={(
                                                            newValue
                                                        ) => {
                                                            setAnimal({
                                                                ...animal,
                                                                fiv_negative:
                                                                    newValue ??
                                                                    undefined,
                                                            });
                                                        }}
                                                    />
                                                </Col>
                                                <Col xs={6} md={3}>
                                                    <Label>Négatif FELV</Label>
                                                    <BooleanNullableDropdown
                                                        withNewLine={true}
                                                        value={
                                                            animal.felv_negative ??
                                                            null
                                                        }
                                                        disabled={!isEditing}
                                                        onChange={(
                                                            newValue
                                                        ) => {
                                                            setAnimal({
                                                                ...animal,
                                                                felv_negative:
                                                                    newValue ??
                                                                    undefined,
                                                            });
                                                        }}
                                                    />
                                                </Col>
                                            </>
                                        )}
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Label>
                                                Date des anti-parasitaires
                                            </Label>
                                            <Input
                                                type="date"
                                                value={
                                                    animal.anti_parasitic_date
                                                }
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        anti_parasitic_date:
                                                            evt.target.value,
                                                    })
                                                }
                                            />
                                        </Col>
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
                                   
                                </AccordionBody>
                            </AccordionItem>
                        </Accordion>
                        <Accordion
                            className="pb-3"
                            open={openBehaviour}
                            {...{
                                toggle: toggleBehaviour,
                            }}
                        >
                            <AccordionItem>
                                <AccordionHeader targetId="1">
                                    Comportement
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <Row>
                                        <Col xs={12}>
                                            <Label>Caractère</Label>
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
                                    <Row>
                                        <Col xs={6} md={3}>
                                            <Label>Besoin congénère</Label>
                                            <BooleanNullableDropdown
                                                withNewLine={true}
                                                value={
                                                    animal.need_friend ?? null
                                                }
                                                disabled={!isEditing}
                                                onChange={(newValue) => {
                                                    setAnimal({
                                                        ...animal,
                                                        need_friend:
                                                            newValue ??
                                                            undefined,
                                                    });
                                                }}
                                            />
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <Label>Attitude</Label>
                                            <BooleanNullableDropdown
                                                withNewLine={true}
                                                value={
                                                    animal.sterilised ?? null
                                                }
                                                disabled={!isEditing}
                                                onChange={(newValue) => {
                                                    setAnimal({
                                                        ...animal,
                                                        sterilised:
                                                            newValue ??
                                                            undefined,
                                                    });
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6} md={3}>
                                            <Label>OK chats</Label>
                                            <BooleanNullableDropdown
                                                withNewLine={true}
                                                value={
                                                    animal.cats_ok ?? null
                                                }
                                                disabled={!isEditing}
                                                onChange={(newValue) => {
                                                    setAnimal({
                                                        ...animal,
                                                        cats_ok:
                                                            newValue ??
                                                            undefined,
                                                    });
                                                }}
                                            />
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <Label>OK chiens</Label>
                                            <BooleanNullableDropdown
                                                withNewLine={true}
                                                value={
                                                    animal.dogs_ok ?? null
                                                }
                                                disabled={!isEditing}
                                                onChange={(newValue) => {
                                                    setAnimal({
                                                        ...animal,
                                                        dogs_ok:
                                                            newValue ??
                                                            undefined,
                                                    });
                                                }}
                                            />
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <Label>OK enfants</Label>
                                            <BooleanNullableDropdown
                                                withNewLine={true}
                                                value={
                                                    animal.kids_ok ?? null
                                                }
                                                disabled={!isEditing}
                                                onChange={(newValue) => {
                                                    setAnimal({
                                                        ...animal,
                                                        kids_ok:
                                                            newValue ??
                                                            undefined,
                                                    });
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <Label>Particularité</Label>
                                            <Input
                                                type="textarea"
                                                value={animal.behavior_particularity || ""}
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        behavior_particularity:
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
                            {...{
                                toggle: toggleExit,
                            }}
                        >
                            <AccordionItem>
                                <AccordionHeader targetId="1">
                                    Sortie
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <Row>
                                        <Col xs={6} md={4}>
                                            <Label>Certificat de cession</Label>
                                            <BooleanNullableDropdown
                                                withNewLine={true}
                                                value={
                                                    animal.transfer_certificate ??
                                                    null
                                                }
                                                disabled={!isEditing}
                                                onChange={(newValue) => {
                                                    setAnimal({
                                                        ...animal,
                                                        transfer_certificate:
                                                            newValue ??
                                                            undefined,
                                                    });
                                                }}
                                            />
                                        </Col>
                                        <Col xs={6} md={8}>
                                            <Label>Date de sortie</Label>
                                            <Input
                                                type="date"
                                                value={animal.exit_date}
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        exit_date:
                                                            evt.target.value,
                                                    })
                                                }
                                            />
                                        </Col>
                                        <Col xs={12}>
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
                            {...{
                                toggle: toggleDeath,
                            }}
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
                                                value={animal.death_date}
                                                disabled={!isEditing}
                                                onChange={(evt) =>
                                                    setAnimal({
                                                        ...animal,
                                                        death_date:
                                                            evt.target.value,
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
                            animalId={parseInt(animalId)}
                            veterinarianInterventions={
                                veterinarianInterventions
                            }
                            notificationSystem={notificationSystem}
                            shouldRefresh={getVeterinarianInterventions}
                            {...props}
                        />
                        <br />
                        <HostFamiliesHistory
                            animalId={parseInt(animalId)}
                            animalName={animal.name ?? ""}
                            hostFamilies={hostFamilies}
                            animalToHostFamilies={animalToHostFamilies}
                            notificationSystem={notificationSystem}
                            shouldRefresh={() => {
                                getAnimalToHostFamilies()?.then(getAnimal);
                            }}
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
                { name: "Animaux", to: "/animals" } as CustomBreadcrumbItem,
                { name: "Animal", active: true } as CustomBreadcrumbItem,
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
};
export default AnimalDetailPage;
