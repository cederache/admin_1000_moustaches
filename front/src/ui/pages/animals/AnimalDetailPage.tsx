import React, { FC, useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Row } from "reactstrap";
import AnimalsManager, { Sexe } from "../../../managers/animals.manager";
import { MdRefresh, MdOutlineModeEdit, MdSave, MdDelete } from "react-icons/md";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import BooleanNullableDropdown from "../../components/BooleanNullableDropdown";
import NullableDropdown from "../../components/NullableDropdown";
import AnimalsToHostFamiliesManager from "../../../managers/animalsToHostFamilies.manager";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import toast from "react-hot-toast";
import AnimalToHostFamily from "../../../logic/entities/AnimalToHostFamily";
import Species from "../../../logic/entities/Species";
import Animal from "../../../logic/entities/Animal";
import { useNavigate, useParams } from "react-router-dom";
import useGetPermissions from "../../../hooks/useGetPermissions";
import { Ressource } from "../../../logic/entities/Permissions";
import HostFamiliesHistory from "./HostFamiliesHistory";
import VeterinarianInterventionsHistory from "./VeterinarianInterventionsHistory";
import AnimalInfoAccordion from "./AnimalInfoAccordion";
import AnimalPecAccordion from "./AnimalPecAccordion";
import AnimalHealthAccordion from "./AnimalHealthAccordion";
import AnimalBehaviourAccordion from "./AnimalBehaviourAccordion";
import AnimalExitAccordion from "./AnimalExitAccordion";
import AnimalDeathAccordion from "./AnimalDeathAccordion";

interface AnimalDetailPageProps {
    [key: string]: any;
}

class AnimalDetailPageData {
    // null when not found
    // undefined when is loading
    animal?: Animal | null;
    species: Species[];
    sexes: Sexe[];

    constructor() {
        this.animal = undefined;
        this.species = [];
        this.sexes = [];
    }
}

enum AnimalDetailPageAccordion {
    INFO = "INFO",
    PEC = "PEC",
    HEALTH = "HEALTH",
    BEHAVIOUR = "BEHAVIOUR",
    EXIT = "EXIT",
    DEATH = "DEATH",
}

class AnimalDetailPageAccordionState {
    type: AnimalDetailPageAccordion;
    id: string;

    constructor(type: AnimalDetailPageAccordion, id: string) {
        this.type = type;
        this.id = id;
    }
}

const permissionsName: Ressource[] = [
    Ressource.PET_INFO,
    Ressource.PET_PICKUP,
    Ressource.PET_HEALTH,
    Ressource.PET_BEHAVIOR,
    Ressource.PET_DIFFUSION,
    Ressource.PET_EXIT,
    Ressource.PET_DEATH,
    Ressource.PET_HIST_VETO,
    Ressource.PET_HIST_HF,
];

const AnimalDetailPage: FC<AnimalDetailPageProps> = ({ props }) => {
    const { id: paramAnimalId } = useParams();
    const animalId = paramAnimalId ?? "new";
    const [data, setData] = useState<AnimalDetailPageData>(new AnimalDetailPageData());
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);


    const navigate = useNavigate();
    const pagePermissions = useGetPermissions(permissionsName);

    // Accordions
    const [accordions, setAccordions] = useState<AnimalDetailPageAccordionState[]>(
        Object.values(AnimalDetailPageAccordion)
            .map((type) => {
                if (typeof type !== "string") return null;
                var accordionType = type as AnimalDetailPageAccordion;
                return new AnimalDetailPageAccordionState(accordionType, "");
            })
            .filter((a) => a !== null) as AnimalDetailPageAccordionState[]
    );

    const toggleAccordion = (type: AnimalDetailPageAccordion, id: string) => {
        let newAccordions = accordions.map((accordion) => {
            if (accordion.type === type) {
                if (accordion.id === id) {
                    accordion.id = "";
                } else {
                    accordion.id = id;
                }
            }
            return accordion;
        });
        setAccordions(newAccordions);
    };

    const onAnimalChange = (updates: Partial<Animal>) => {
        setData((prev) => ({
            ...prev,
            animal: { ...prev.animal!, ...updates },
        }));
    };

    const getAnimal = () => {
        let id = parseInt(animalId);
        if (isNaN(id)) {
            return Promise.resolve(undefined);
        }
        return AnimalsManager.getById(id).catch((err) => {
            console.error(err);
            toast.error(`Une erreur s'est produite pendant la récupération des données\n${err}`);
            return undefined;
        });
    };

    const getSpecies = () => {
        return AnimalsManager.getSpecies()
            .then((species) => species.sort((a, b) => a.name.localeCompare(b.name)))
            .catch((err) => {
                console.error(err);
                toast.error(`Une erreur s'est produite pendant la récupération des données\n${err}`);
                return [] as Species[];
            });
    };

    const getSexes = () => {
        return AnimalsManager.getSexes()
            .then((sexes) => sexes.sort((a, b) => a.value.localeCompare(b.value)))
            .catch((err) => {
                console.error(err);
                toast.error(`Une erreur s'est produite pendant la récupération des données\n${err}`);
                return [] as Sexe[];
            });
    };

    const refresh = () => {
        Promise.all([getSpecies(), getSexes()])
            .then(([species, sexes]) => {
                setData((previousData) => {
                    return {
                        ...previousData,
                        species,
                        sexes,
                    };
                });
            })
            .then(() => {
                if (animalId !== "new") {
                    getAnimal().then((animal) => {
                        if (animal === undefined) {
                            console.error("Animal not found");
                            toast.error("Animal non trouvé");
                            return;
                        }
                        setData((previousData) => {
                            return {
                                ...previousData,
                                animal,
                            };
                        });
                    });
                } else {
                    setAccordions((previousValues) => {
                        return previousValues.map((value) => {
                            switch (value.type) {
                                case AnimalDetailPageAccordion.INFO:
                                case AnimalDetailPageAccordion.PEC:
                                case AnimalDetailPageAccordion.HEALTH:
                                case AnimalDetailPageAccordion.BEHAVIOUR:
                                    return new AnimalDetailPageAccordionState(value.type, "1");
                                case AnimalDetailPageAccordion.EXIT:
                                case AnimalDetailPageAccordion.DEATH:
                                    return new AnimalDetailPageAccordionState(value.type, "");
                            }
                        });
                    });
                    setIsEditing(true);
                    setData((previousData) => {
                        return {
                            ...previousData,
                            animal: AnimalsManager.createAnimal(),
                        };
                    });
                }
            });
    };

    useEffect(() => {
        refresh();
    }, []);

    // Auto select first species for new animal
    useEffect(() => {
        if (animalId === "new" && data.animal !== undefined && data.species.length > 0 && data.animal?.species === undefined) {
            setData((previousData) => {
                return {
                    ...previousData,
                    animal: {
                        ...data.animal!,
                        species: data.species[0],
                    },
                };
            });
        }
    }, [animalId, data.animal, data.species]);

    const save = () => {
        setIsEditing(false);
        if (data.animal === undefined || data.animal === null) {
            return;
        }
        if (animalId === "new") {
            // Send new data to API
            AnimalsManager.create(data.animal)
                .then((updatedAnimal) => {
                    toast.success("Animal créé");
                    navigate(`/animals/${updatedAnimal.id}`);
                    setData((previousData) => {
                        return {
                            ...previousData,
                            animal: updatedAnimal,
                        };
                    });
                })
                .catch((err) => {
                    console.error(err);
                    toast.error(`Une erreur s'est produite pendant la création des données\n${err}`);
                });
            return;
        }

        // Send new data to API
        AnimalsManager.update(data.animal)
            .then(() => {
                getAnimal().then(() => {
                    var exitOrDeathDate = data.animal?.deathDate || data.animal?.exitDate;
                    if (exitOrDeathDate !== undefined && exitOrDeathDate !== "") {
                        data.animal?.hostFamilyRelations
                            ?.filter((athf) => athf.exitDate === undefined)
                            .forEach((athf) => {
                                if (
                                    athf.animal === undefined ||
                                    athf.animal.id === undefined ||
                                    athf.hostFamily === undefined ||
                                    athf.hostFamily.id === undefined
                                ) {
                                    return;
                                }
                                AnimalsToHostFamiliesManager.update(
                                    new AnimalToHostFamily(undefined, athf.animal, athf.hostFamily, athf.entryDate, athf.exitDate)
                                );
                            });
                    }
                });
                toast.success("Animal mis à jour");
            })
            .catch((err) => {
                console.error(err);
                getAnimal();
                toast.error(`Une erreur s'est produite pendant la mise à jour des données\n${err}`);
            });
    };

    const deleteA = () => {
        if (data.animal === undefined || data.animal === null) {
            return;
        }
        AnimalsManager.delete(data.animal)
            .then(() => {
                toast.success("Animal supprimé");
                navigate("/animals");
            })
            .catch((err) => {
                console.error(err);
                getAnimal();
                toast.error(`Une erreur s'est produite pendant la suppression des données\n${err}`);
            });
    };

    let content = <div>Chargement...</div>;

    if (data.animal === null) {
        content = <div>Animal non trouvé</div>;
    } else if (data.animal === undefined) {
        content = <div>Chargement...</div>;
    } else {
        content = (
            <div>
                <Row className={"justify-content-end"}>
                    <Col xs={"auto"}>
                        {animalId !== "new" && isEditing && (
                            <Button color="danger" onClick={() => setShowDeleteConfirmationModal(true)}>
                                <MdDelete />
                            </Button>
                        )}
                        {!isEditing &&
                            (pagePermissions[Ressource.PET_INFO].can_update ||
                                pagePermissions[Ressource.PET_PICKUP].can_update ||
                                pagePermissions[Ressource.PET_HEALTH].can_update ||
                                pagePermissions[Ressource.PET_BEHAVIOR].can_update ||
                                pagePermissions[Ressource.PET_DIFFUSION].can_update ||
                                pagePermissions[Ressource.PET_EXIT].can_update ||
                                pagePermissions[Ressource.PET_DEATH].can_update ||
                                pagePermissions[Ressource.PET_HIST_VETO].can_update ||
                                pagePermissions[Ressource.PET_HIST_HF].can_update) && (
                                <Button className="ms-2" color="primary" onClick={() => setIsEditing(true)}>
                                    <MdOutlineModeEdit />
                                </Button>
                            )}
                        {isEditing && (
                            <Button className="ms-2" color="success" onClick={() => save()}>
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
                        {animalId !== "new" && <h2>{data.animal.name}</h2>}
                    </CardHeader>
                    <CardBody>
                        {(animalId === "new" || isEditing === true) && (
                            <Row>
                                <Col xs={12}>
                                    <Label>Nom</Label>
                                    <Input
                                        value={data.animal.name || ""}
                                        disabled={!isEditing || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                        onChange={(evt) =>
                                            setData((previousData) => {
                                                return {
                                                    ...previousData,
                                                    animal: {
                                                        ...previousData.animal!,
                                                        name: evt.target.value,
                                                    },
                                                };
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
                                    value={data.animal.broadcastable ?? null}
                                    disabled={!isEditing || data.animal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newValue) =>
                                        setData((previousData) => {
                                            return {
                                                ...previousData,
                                                animal: {
                                                    ...previousData.animal!,
                                                    broadcastable: newValue ?? undefined,
                                                },
                                            };
                                        })
                                    }
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>Réservable</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={data.animal.bookable ?? null}
                                    disabled={!isEditing || data.animal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newValue) =>
                                        setData((previousData) => {
                                            return {
                                                ...previousData,
                                                animal: {
                                                    ...previousData.animal!,
                                                    bookable: newValue ?? undefined,
                                                },
                                            };
                                        })
                                    }
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>Réservé·e</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={data.animal.reserved ?? null}
                                    disabled={!isEditing || data.animal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newValue) =>
                                        setData((previousData) => {
                                            return {
                                                ...previousData,
                                                animal: {
                                                    ...previousData.animal!,
                                                    reserved: newValue ?? undefined,
                                                },
                                            };
                                        })
                                    }
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>Duplicata ICAD nécessaire ?</Label>
                                <NullableDropdown
                                    withNewLine={true}
                                    color={
                                        data.animal.needIcadDuplicate === null || data.animal.needIcadDuplicate === undefined
                                            ? "warning"
                                            : data.animal.needIcadDuplicate === "received"
                                            ? "success"
                                            : data.animal.needIcadDuplicate === "waiting"
                                            ? "info"
                                            : "danger"
                                    }
                                    value={data.animal.needIcadDuplicate}
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
                                    valueActiveCheck={(value) => data.animal?.needIcadDuplicate === value}
                                    key={"needIcadDuplicate"}
                                    disabled={!isEditing || data.animal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newNeedIcadDuplicate) => {
                                        setData((previousData) => {
                                            return {
                                                ...previousData,
                                                animal: {
                                                    ...previousData.animal!,
                                                    needIcadDuplicate: newNeedIcadDuplicate,
                                                },
                                            };
                                        });
                                    }}
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>Adopté·e</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={data.animal.adopted ?? null}
                                    disabled={!isEditing || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newValue) =>
                                        setData((previousData) => {
                                            return {
                                                ...previousData,
                                                animal: {
                                                    ...previousData.animal!,
                                                    adopted: newValue ?? undefined,
                                                },
                                            };
                                        })
                                    }
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>Album créé</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={data.animal.albumCreated ?? null}
                                    disabled={!isEditing || data.animal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newValue) =>
                                        setData((previousData) => {
                                            return {
                                                ...previousData,
                                                animal: {
                                                    ...previousData.animal!,
                                                    albumCreated: newValue ?? undefined,
                                                },
                                            };
                                        })
                                    }
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>Contrat envoyé</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={data.animal.contractSent ?? null}
                                    disabled={!isEditing || data.animal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newValue) =>
                                        setData((previousData) => {
                                            return {
                                                ...previousData,
                                                animal: {
                                                    ...previousData.animal!,
                                                    contractSent: newValue ?? undefined,
                                                },
                                            };
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        {pagePermissions[Ressource.PET_INFO].can_read && (
                            <AnimalInfoAccordion
                                animal={data.animal}
                                species={data.species}
                                sexes={data.sexes}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.PET_INFO]?.can_update}
                                openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.INFO)?.id ?? ""}
                                onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.INFO, id)}
                                onAnimalChange={onAnimalChange}
                            />
                        )}
                        {pagePermissions[Ressource.PET_PICKUP].can_read && (
                            <AnimalPecAccordion
                                animal={data.animal}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.PET_PICKUP]?.can_update}
                                openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.PEC)?.id ?? ""}
                                onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.PEC, id)}
                                onAnimalChange={onAnimalChange}
                            />
                        )}
                        {pagePermissions[Ressource.PET_HEALTH].can_read && (
                            <AnimalHealthAccordion
                                animal={data.animal}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.PET_HEALTH]?.can_update}
                                openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.HEALTH)?.id ?? ""}
                                onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.HEALTH, id)}
                                onAnimalChange={onAnimalChange}
                            />
                        )}
                        {pagePermissions[Ressource.PET_BEHAVIOR].can_read && (
                            <AnimalBehaviourAccordion
                                animal={data.animal}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.PET_BEHAVIOR]?.can_update}
                                openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.BEHAVIOUR)?.id ?? ""}
                                onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.BEHAVIOUR, id)}
                                onAnimalChange={onAnimalChange}
                            />
                        )}

                        {pagePermissions[Ressource.PET_EXIT].can_read && (
                            <AnimalExitAccordion
                                animal={data.animal}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.PET_EXIT]?.can_update}
                                openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.EXIT)?.id ?? ""}
                                onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.EXIT, id)}
                                onAnimalChange={onAnimalChange}
                            />
                        )}
                        {pagePermissions[Ressource.PET_DEATH].can_read && (
                            <AnimalDeathAccordion
                                animal={data.animal}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.PET_DEATH]?.can_update}
                                openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.DEATH)?.id ?? ""}
                                onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.DEATH, id)}
                                onAnimalChange={onAnimalChange}
                            />
                        )}
                    </CardBody>
                </Card>
                <br />
                {pagePermissions[Ressource.PET_HIST_VETO].can_read && (
                    <VeterinarianInterventionsHistory animal={data.animal} />
                )}
                <br />
                {pagePermissions[Ressource.PET_HIST_HF].can_read && (
                    <HostFamiliesHistory
                        animal={data.animal}
                        onAnimalUpdated={() => {
                            getAnimal().then((animal) => {
                                if (animal) setData((prev) => ({ ...prev, animal }));
                            });
                        }}
                    />
                )}
            </div>
        );
    }

    return (
        <Page
            className="AnimalPage"
            title="Détail de l'animal"
            breadcrumbs={[
                { name: "Animaux", to: "/animals", active: false } as CustomBreadcrumbItem,
                { name: "Animal", active: true, to: null } as CustomBreadcrumbItem
            ]}
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
