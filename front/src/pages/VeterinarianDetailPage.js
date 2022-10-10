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
import VeterinariansManager from "../managers/veterinarians.manager";
import { useState } from "react";
import {
    MdDirections,
    MdOutlineModeEdit,
    MdRefresh,
    MdSave,
} from "react-icons/md";
import SourceLink from "../components/SourceLink";

import NotificationSystem from "react-notification-system";
import { NOTIFICATION_SYSTEM_STYLE } from "utils/constants";

function VeterinarianDetailPage({ match, ...props }) {
    const vetId = match.params.id;
    const [veterinarian, setVeterinarian] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );

    const getVeterinarian = () => {
        setVeterinarian(null);
        VeterinariansManager.getById(vetId).then(setVeterinarian);
    };

    useEffect(() => {
        getVeterinarian();
    }, []);

    const save = () => {
        setIsEditing(false);

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
                getVeterinarian();
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la mise à jour des données",
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
                        <Button className="ml-2" onClick={getVeterinarian}>
                            <MdRefresh />
                        </Button>
                    </Col>
                </Row>

                <br />

                <Card>
                    <CardHeader>
                        <h2>{veterinarian.name}</h2>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs={6}>
                                <Row>
                                    <Col xs={12}>
                                        <Label>Téléphone</Label>
                                        <Input
                                            value={veterinarian.phone}
                                            readOnly={!isEditing}
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
                                            readOnly={!isEditing}
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
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        setVeterinarian({
                                            ...veterinarian,
                                            address: evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3}>
                                <Label>Gestion des urgences</Label>
                                <Input
                                    value={
                                        veterinarian.emergencies === true
                                            ? "Oui"
                                            : veterinarian.emergencies === false
                                            ? "Non"
                                            : "NSP"
                                    }
                                    readOnly={!isEditing}
                                    onChange={(evt) =>
                                        console.log(evt.target.value)
                                    }
                                />
                            </Col>
                            <Col xs={9}>
                                <Label>
                                    Méthode de confirmation de rendez-vous
                                </Label>
                                <Input
                                    type="textarea"
                                    value={
                                        veterinarian.appointment_confirmation_procedure
                                    }
                                    readOnly={!isEditing}
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
                                    readOnly={!isEditing}
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
                                    readOnly={!isEditing}
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
        >
            {content}

            <NotificationSystem
                dismissible={false}
                ref={(aNotificationSystem) =>
                    setNotificationSystem(aNotificationSystem)
                }
                style={NOTIFICATION_SYSTEM_STYLE}
            />
        </Page>
    );
}
export default VeterinarianDetailPage;
