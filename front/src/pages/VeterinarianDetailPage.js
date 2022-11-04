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
} from "reactstrap";
import VeterinariansManager from "../managers/veterinarians.manager";
import { useState } from "react";
import {
    MdDelete,
    MdDirections,
    MdOutlineModeEdit,
    MdRefresh,
    MdSave,
} from "react-icons/md";
import SourceLink from "../components/SourceLink";
import BooleanNullableDropdown from "../components/BooleanNullableDropdown";
import PriceLevelDropdown from "../components/PriceLevelDropdown";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Geocode from "../utils/geocode";

function VeterinarianDetailPage({ match, ...props }) {
    const vetId = match.params.id;
    const [veterinarian, setVeterinarian] = useState(null);
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

    const getVeterinarian = () => {
        if (veterinarian !== null) {
            setVeterinarian(null);
        }
        VeterinariansManager.getById(vetId)
            .then((vet) => {
                setPreviousAddress(vet.address);
                setVeterinarian(vet);
            })
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
        if (vetId !== "new") {
            getVeterinarian();
        } else {
            setVeterinarian(VeterinariansManager.createVeterinarian());
            setIsEditing(true);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        if (veterinarian !== null && previousAddress !== veterinarian.address) {
            console.log(previousAddress, veterinarian.address);
            setPreviousAddress(veterinarian.address);

            if (
                veterinarian.address !== null &&
                veterinarian.address !== undefined &&
                veterinarian.address.length > 10
            ) {
                // Geocode address
                setIsGeocoding(true);
                setGeocodeFound(null);
                Geocode.getCoordinatesFromAddress(veterinarian.address)
                    .then((coordinates) => {
                        if (coordinates !== null && coordinates.length > 1) {
                            veterinarian.latitude = coordinates[1];
                            veterinarian.longitude = coordinates[0];
                        } else {
                            console.warn("Can't get coordinates for address");
                            veterinarian.latitude = null;
                            veterinarian.longitude = null;
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
    }, [veterinarian]);

    useEffect(() => {
        if (!isGeocoding && shouldSave) {
            saveIfNeeded();
        }
    }, [shouldSave, isGeocoding]);

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

        setShouldSave(false);
        if (vetId === "new") {
            // Send new data to API
            VeterinariansManager.create(veterinarian)
                .then((updatedVeterinarian) => {
                    notificationSystem.addNotification({
                        message: "Vétérinaire créé",
                        level: "success",
                    });
                    props.history.push(
                        `/veterinarians/${updatedVeterinarian.id}`
                    );
                    setVeterinarian(updatedVeterinarian);
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
        VeterinariansManager.update(veterinarian)
            .then(() => {
                getVeterinarian();
                notificationSystem.addNotification({
                    message: "Vétérinaire mis à jour",
                    level: "success",
                });
            })
            .catch((err) => {
                console.error(err);
                getVeterinarian();
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la mise à jour des données",
                    level: "error",
                });
            });
    };

    const deleteV = () => {
        VeterinariansManager.delete(veterinarian)
            .then(() => {
                notificationSystem.addNotification({
                    message: "Vétérinaire supprimé",
                    level: "success",
                });
                props.history.push("/veterinarians");
            })
            .catch((err) => {
                console.error(err);
                getVeterinarian();
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la suppression des données",
                    level: "error",
                });
            });
    };

    let content = <div>Chargement...</div>;
    if (veterinarian === undefined) {
        content = <div>Vétérinaire non trouvé</div>;
    } else if (veterinarian === null) {
        content = <div>Chargement...</div>;
    } else {
        content = (
            <div>
                <Row className={"justify-content-end"}>
                    <Col xs={"auto"}>
                        {vetId !== "new" && isEditing && (
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
                                onClick={save}
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
                        {vetId === "new" && <h2>Nouveau vétérinaire</h2>}
                        {vetId !== "new" && <h2>{veterinarian.name}</h2>}
                    </CardHeader>
                    <CardBody>
                        {vetId === "new" && (
                            <Row>
                                <Col xs={12}>
                                    <Label>Nom</Label>
                                    <Input
                                        value={veterinarian.name || ""}
                                        disabled={!isEditing}
                                        onChange={(evt) =>
                                            setVeterinarian({
                                                ...veterinarian,
                                                name: evt.target.value,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col xs={6}>
                                <Row>
                                    <Col xs={12}>
                                        <Label>Téléphone</Label>
                                        <Input
                                            value={veterinarian.phone}
                                            disabled={!isEditing}
                                            onChange={(evt) =>
                                                setVeterinarian({
                                                    ...veterinarian,
                                                    phone: evt.target.value,
                                                })
                                            }
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <Label>E-mail</Label>
                                        <Input
                                            value={veterinarian.mail}
                                            disabled={!isEditing}
                                            onChange={(evt) =>
                                                setVeterinarian({
                                                    ...veterinarian,
                                                    mail: evt.target.value,
                                                })
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Label>
                                    <SourceLink
                                        link={`https://www.google.com/maps/place/${veterinarian.address}`}
                                    >
                                        <span>
                                            Adresse <MdDirections />
                                        </span>
                                    </SourceLink>
                                </Label>
                                <Input
                                    type="textarea"
                                    value={veterinarian.address}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setVeterinarian({
                                            ...veterinarian,
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
                            <Col xs={3}>
                                <Label>Gestion des urgences</Label>
                                <BooleanNullableDropdown
                                    value={veterinarian.emergencies}
                                    disabled={!isEditing}
                                    onChange={(newValue) => {
                                        setVeterinarian({
                                            ...veterinarian,
                                            emergencies: newValue,
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs={3}>
                                <Label>Niveau de prix</Label>
                                <br />
                                <PriceLevelDropdown
                                    title={
                                        isEditing
                                            ? ""
                                            : veterinarian.price_level_tooltip
                                    }
                                    value={veterinarian.price_level}
                                    disabled={!isEditing}
                                    onChange={(newValue) => {
                                        setVeterinarian({
                                            ...veterinarian,
                                            price_level: newValue,
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>
                                    Méthode de confirmation de rendez-vous
                                </Label>
                                <Input
                                    type="textarea"
                                    value={
                                        veterinarian.appointment_confirmation_procedure
                                    }
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setVeterinarian({
                                            ...veterinarian,
                                            appointment_confirmation_procedure:
                                                evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Date de paiement</Label>
                                <Input
                                    type="textarea"
                                    value={veterinarian.invoice_payment_date}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setVeterinarian({
                                            ...veterinarian,
                                            invoice_payment_date:
                                                evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>Moyen de paiement</Label>
                                <Input
                                    type="textarea"
                                    value={veterinarian.payment_method}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setVeterinarian({
                                            ...veterinarian,
                                            payment_method: evt.target.value,
                                        })
                                    }
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
            className="VeterinarianPage"
            title="Détail du vétérinaire"
            breadcrumbs={[
                { name: "Vétérinaires", to: "/veterinarians" },
                { name: "Vétérinaire", active: true },
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
                        deleteV();
                    }
                }}
                bodyEntityName={"un Vétérinaire"}
            />
        </Page>
    );
}
export default VeterinarianDetailPage;
