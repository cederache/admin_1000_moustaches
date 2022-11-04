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
import HostFamiliesManager from "../managers/hostFamilies.manager";
import { useState } from "react";
import {
    MdRefresh,
    MdAssignment,
    MdOutlineModeEdit,
    MdSave,
    MdDelete,
    MdDirections,
} from "react-icons/md";
import AnimalsManager from "../managers/animals.manager";
import BooleanNullableDropdown from "../components/BooleanNullableDropdown";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Geocode from "../utils/geocode";
import SourceLink from "../components/SourceLink";

function HostFamilyDetailPage({ match, ...props }) {
    const hostFamilyId = match.params.id;
    const [hostFamily, setHostFamily] = useState(null);
    const [animalsToHostFamily, setAnimalsToHostFamily] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
        useState(false);

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );
    const [geocodeFound, setGeocodeFound] = useState(null);
    const [previousAddress, setPreviousAddress] = useState(null);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [shouldSave, setShouldSave] = useState(false);

    const getHostFamily = () => {
        setHostFamily(null);
        HostFamiliesManager.getById(hostFamilyId)
            .then((hostFamily) => setHostFamily(hostFamily))
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la récupération des données",
                    level: "error",
                });
            });
    };

    const getAnimalsToHostFamily = () => {
        setAnimalsToHostFamily([]);
        AnimalsManager.getByHostFamilyId(hostFamilyId)
            .then(setAnimalsToHostFamily)
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la récupération des données",
                    level: "error",
                });
            });
    };

    const refresh = () => {
        if (hostFamilyId !== "new") {
            getHostFamily();
            getAnimalsToHostFamily();
        } else {
            setHostFamily(HostFamiliesManager.createHostFamily());
            setIsEditing(true);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        if (hostFamily !== null && previousAddress !== hostFamily.address) {
            setPreviousAddress(hostFamily.address);

            if (
                hostFamily.address !== null &&
                hostFamily.address !== undefined &&
                hostFamily.address.length > 10
            ) {
                // Geocode address
                setIsGeocoding(true);
                setGeocodeFound(null);
                Geocode.getCoordinatesFromAddress(hostFamily.address)
                    .then((coordinates) => {
                        if (coordinates !== null && coordinates.length > 1) {
                            hostFamily.latitude = coordinates[1];
                            hostFamily.longitude = coordinates[0];
                        } else {
                            console.warn("Can't get coordinates for address");
                            hostFamily.latitude = null;
                            hostFamily.longitude = null;
                        }
                        setIsGeocoding(false);
                        setGeocodeFound(true);

                        saveIfNeeded();
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsGeocoding(false);
                        setGeocodeFound(false);

                        saveIfNeeded();
                    });
            }
        }
    }, [hostFamily]);

    useEffect(() => {
        if (!isGeocoding && shouldSave) {
            saveIfNeeded();
        }
    }, [shouldSave, isGeocoding]);

    const showDetail = (animalToHostFamily) => {
        props.history.push(`/animals/${animalToHostFamily.animal_id}`);
    };

    const save = () => {
        if (!isGeocoding) {
            setIsEditing(false);
            setShouldSave(true);
        } else {
            setShouldSave(true);
        }
    };

    const saveIfNeeded = () => {
        if (shouldSave === false) {
            return;
        }

        setIsEditing(false);
        if (hostFamilyId === "new") {
            // Send new data to API
            HostFamiliesManager.create(hostFamily)
                .then((updatedHostFamily) => {
                    notificationSystem.addNotification({
                        message: "Famille d'Accueil créée",
                        level: "success",
                    });
                    props.history.push(`/hostFamilies/${updatedHostFamily.id}`);
                    setHostFamily(updatedHostFamily);
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
        HostFamiliesManager.update(hostFamily)
            .then(() => {
                getHostFamily();
                notificationSystem.addNotification({
                    message: "Famille d'Accueil mis à jour",
                    level: "success",
                });
            })
            .catch((err) => {
                console.error(err);
                getHostFamily();
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la mise à jour des données",
                    level: "error",
                });
            });
    };

    const deleteHF = () => {
        HostFamiliesManager.delete(hostFamily)
            .then(() => {
                notificationSystem.addNotification({
                    message: "Famille d'Accueil supprimée",
                    level: "success",
                });
                props.history.push("/hostFamilies");
            })
            .catch((err) => {
                console.error(err);
                getHostFamily();
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la suppression des données",
                    level: "error",
                });
            });
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
                        {hostFamilyId !== "new" && isEditing && (
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
                        {hostFamilyId !== "new" && (
                            <Button className="ms-2" onClick={refresh}>
                                <MdRefresh />
                            </Button>
                        )}
                    </Col>
                </Row>

                <br />

                <Card>
                    <CardHeader>
                        {hostFamilyId === "new" && (
                            <h2>Nouvelle famille d'accueil</h2>
                        )}
                        {hostFamilyId !== "new" && (
                            <h2>{hostFamily.display_name}</h2>
                        )}
                    </CardHeader>
                    <CardBody>
                        {hostFamilyId === "new" ||
                            (isEditing && (
                                <Row>
                                    <Col xs={6}>
                                        <Label>Prénom</Label>
                                        <Input
                                            value={hostFamily.firstname || ""}
                                            disabled={!isEditing}
                                            onChange={(evt) =>
                                                setHostFamily({
                                                    ...hostFamily,
                                                    firstname: evt.target.value,
                                                })
                                            }
                                        />
                                    </Col>
                                    <Col xs={6}>
                                        <Label>Nom</Label>
                                        <Input
                                            value={hostFamily.name || ""}
                                            disabled={!isEditing}
                                            onChange={(evt) =>
                                                setHostFamily({
                                                    ...hostFamily,
                                                    name: evt.target.value,
                                                })
                                            }
                                        />
                                    </Col>
                                </Row>
                            ))}
                        <Row>
                            <Col xs={6}>
                                <Label>Téléphone</Label>
                                <Input
                                    type="phone"
                                    value={hostFamily.phone || ""}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setHostFamily({
                                            ...hostFamily,
                                            phone: evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>E-mail</Label>
                                <Input
                                    type="mail"
                                    value={hostFamily.mail || ""}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setHostFamily({
                                            ...hostFamily,
                                            mail: evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Pseudo</Label>
                                <Input
                                    value={
                                        hostFamily.social_network_alias || ""
                                    }
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setHostFamily({
                                            ...hostFamily,
                                            social_network_alias:
                                                evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>
                                    <SourceLink
                                        link={`https://www.google.com/maps/place/${hostFamily.address}`}
                                    >
                                        <span>
                                            Adresse <MdDirections />
                                        </span>
                                    </SourceLink>
                                </Label>
                                <Input
                                    type="textarea"
                                    value={hostFamily.address}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setHostFamily({
                                            ...hostFamily,
                                            address: evt.target.value,
                                        })
                                    }
                                />
                                {geocodeFound !== null && (
                                    <p
                                        className={
                                            geocodeFound === true
                                                ? "text-success"
                                                : "text-danger"
                                        }
                                    >
                                        <small>
                                            {geocodeFound === true
                                                ? "Adresse valide"
                                                : "Adresse non trouvée"}
                                        </small>
                                    </p>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Label>Nombre d'enfant</Label>
                                <Input
                                    value={
                                        hostFamily.nb_children?.toString() || ""
                                    }
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setHostFamily({
                                            ...hostFamily,
                                            nb_children:
                                                evt.target.value === ""
                                                    ? null
                                                    : evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col xs={8}>
                                <Label>Informations enfant(s)</Label>
                                <Input
                                    type="textarea"
                                    value={hostFamily.children_infos || ""}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setHostFamily({
                                            ...hostFamily,
                                            children_infos: evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Label>Informations animaux</Label>
                                <Input
                                    type="textarea"
                                    value={hostFamily.animals_infos || ""}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setHostFamily({
                                            ...hostFamily,
                                            animals_infos: evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row className="text-center">
                            <Col xs={4}>
                                <Label>Permis de conduire</Label>
                                <BooleanNullableDropdown
                                    value={hostFamily.driver_license}
                                    disabled={!isEditing}
                                    onChange={(newValue) => {
                                        setHostFamily({
                                            ...hostFamily,
                                            driver_license: newValue,
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs={4}>
                                <Label>Peut donner soins véto</Label>
                                <BooleanNullableDropdown
                                    value={
                                        hostFamily.can_provide_veterinary_care
                                    }
                                    disabled={!isEditing}
                                    onChange={(newValue) => {
                                        setHostFamily({
                                            ...hostFamily,
                                            can_provide_veterinary_care:
                                                newValue,
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs={4}>
                                <Label>Peut sociabiliser</Label>
                                <BooleanNullableDropdown
                                    value={
                                        hostFamily.can_provide_sociabilisation
                                    }
                                    disabled={!isEditing}
                                    onChange={(newValue) => {
                                        setHostFamily({
                                            ...hostFamily,
                                            can_provide_sociabilisation:
                                                newValue,
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="text-center">
                            <Col xs={4}>
                                <Label>
                                    Peut accueillir des animaux handicapés
                                </Label>
                                <BooleanNullableDropdown
                                    value={hostFamily.can_host_disable_animal}
                                    disabled={!isEditing}
                                    onChange={(newValue) => {
                                        setHostFamily({
                                            ...hostFamily,
                                            can_host_disable_animal: newValue,
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs={4}>
                                <Label>Peut donner des soins de nuit</Label>
                                <BooleanNullableDropdown
                                    value={hostFamily.can_provide_night_care}
                                    disabled={!isEditing}
                                    onChange={(newValue) => {
                                        setHostFamily({
                                            ...hostFamily,
                                            can_provide_night_care: newValue,
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs={4}>
                                <Label>Peut isoler</Label>
                                <BooleanNullableDropdown
                                    value={hostFamily.can_isolate}
                                    disabled={!isEditing}
                                    onChange={(newValue) => {
                                        setHostFamily({
                                            ...hostFamily,
                                            can_isolate: newValue,
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Label>Observations</Label>
                                <Input
                                    type="textarea"
                                    value={hostFamily.observations || ""}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setHostFamily({
                                            ...hostFamily,
                                            observations: evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Label>Informations sur le logement</Label>
                                <Input
                                    type="textarea"
                                    value={
                                        hostFamily.housing_informations || ""
                                    }
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setHostFamily({
                                            ...hostFamily,
                                            housing_informations:
                                                evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <br />

                {hostFamilyId !== "new" && (
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
                                                    {
                                                        animalToHostFamily.animal_name
                                                    }
                                                </th>
                                                <td>
                                                    {
                                                        animalToHostFamily
                                                            .host_entry_date_object
                                                            .readable
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        animalToHostFamily
                                                            .host_exit_date_object
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
                )}
            </div>
        );
    }

    return (
        <>
            <Page
                className="HostFamilyPage"
                title="Détail de la Famille d'Accueil"
                breadcrumbs={[
                    { name: "Familles d'Accueil", to: "/hostFamilies" },
                    { name: "Famille d'Accueil", active: true },
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
                            deleteHF();
                        }
                    }}
                    bodyEntityName={"une Famille d'Accueil"}
                />
            </Page>
        </>
    );
}
export default HostFamilyDetailPage;
