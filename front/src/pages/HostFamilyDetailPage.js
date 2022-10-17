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
} from "react-icons/md";
import AnimalsManager from "../managers/animals.manager";
import BooleanNullableDropdown from "../components/BooleanNullableDropdown";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

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

    const showDetail = (animalToHostFamily) => {
        props.history.push(`/animals/${animalToHostFamily.animal_id}`);
    };

    const save = () => {
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
                                className="ml-2"
                                color="primary"
                                onClick={() => setIsEditing(true)}
                            >
                                <MdOutlineModeEdit />
                            </Button>
                        )}
                        {isEditing && (
                            <Button
                                className="ml-2"
                                color="success"
                                onClick={() => save()}
                            >
                                <MdSave />
                            </Button>
                        )}
                        {hostFamilyId !== "new" && (
                            <Button className="ml-2" onClick={refresh}>
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
                        {hostFamilyId === "new" && (
                            <Row>
                                <Col xs={6}>
                                    <Label>Prénom</Label>
                                    <Input
                                        value={hostFamily.firstname || ""}
                                        readOnly={!isEditing}
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
                                        readOnly={!isEditing}
                                        onChange={(evt) =>
                                            setHostFamily({
                                                ...hostFamily,
                                                name: evt.target.value,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col xs={6}>
                                <Label>Téléphone</Label>
                                <Input
                                    type="phone"
                                    value={hostFamily.phone || ""}
                                    readOnly={!isEditing}
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
                                    readOnly={!isEditing}
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
                            <Col xs={12}>
                                <Label>Pseudo</Label>
                                <Input
                                    value={
                                        hostFamily.social_network_alias || ""
                                    }
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        setHostFamily({
                                            ...hostFamily,
                                            social_network_alias:
                                                evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Label>Nombre d'enfant</Label>
                                <Input
                                    value={
                                        hostFamily.nb_children?.toString() || ""
                                    }
                                    readOnly={!isEditing}
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
                                    readOnly={!isEditing}
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
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        setHostFamily({
                                            ...hostFamily,
                                            animals_infos: evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Label>Permis de conduire</Label>
                                <br />
                                <BooleanNullableDropdown
                                    value={hostFamily.driver_license}
                                    readOnly={!isEditing}
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
                                <br />
                                <BooleanNullableDropdown
                                    value={
                                        hostFamily.can_provide_veterinary_care
                                    }
                                    readOnly={!isEditing}
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
                                <br />
                                <BooleanNullableDropdown
                                    value={
                                        hostFamily.can_provide_sociabilisation
                                    }
                                    readOnly={!isEditing}
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
                        <Row>
                            <Col xs={4}>
                                <Label>
                                    Peut accueillir des animaux handicapés
                                </Label>
                                <br />
                                <BooleanNullableDropdown
                                    value={hostFamily.can_host_disable_animal}
                                    readOnly={!isEditing}
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
                                <br />
                                <BooleanNullableDropdown
                                    value={hostFamily.can_provide_night_care}
                                    readOnly={!isEditing}
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
                                <br />
                                <BooleanNullableDropdown
                                    value={hostFamily.can_isolate}
                                    readOnly={!isEditing}
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
                                    readOnly={!isEditing}
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
                                    readOnly={!isEditing}
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
