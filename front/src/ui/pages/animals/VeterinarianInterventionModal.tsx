import React, { FC, useEffect, useState } from "react";
import { MdDelete, MdOutlineModeEdit } from "react-icons/md";
import {
    Button,
    Col,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
} from "reactstrap";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Dropdown from "../../components/Dropdown";
import VeterinarianInterventionsManager from "../../../managers/veterinarianInterventions.manager";
import VeterinariansManager from "../../../managers/veterinarians.manager";
import VeterinarianIntervention from "../../../logic/entities/VeterinarianIntervention";
import Veterinarian from "../../../logic/entities/Veterinarian";
import NotificationSystem from "react-notification-system";

interface VeterinarianInterventionModalProps {
    animalId: number;
    veterinarianIntervention: VeterinarianIntervention;
    show: boolean;
    handleClose: (close: boolean) => void;
    notificationSystem?: NotificationSystem | null;
}

const VeterinarianInterventionModal: FC<VeterinarianInterventionModalProps> = ({
    animalId,
    veterinarianIntervention: vetInter,
    show,
    handleClose,
    notificationSystem,
    ...props
}) => {
    const [veterinarianIntervention, setVeterinarianIntervention] =
        useState<VeterinarianIntervention>(vetInter);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
        useState<boolean>(false);
    const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);

    const getVeterinarians = () => {
        VeterinariansManager.getAll()
            .then(setVeterinarians)
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    useEffect(() => {
        getVeterinarians();
        setIsEditing(vetInter.id === undefined);
    }, []);

    const save = () => {
        setIsEditing(false);
        if (veterinarianIntervention.id === undefined) {
            // Send new data to API
            VeterinarianInterventionsManager.create({
                ...veterinarianIntervention,
                animal_id: animalId,
            })
                .then((_) => {
                    notificationSystem?.addNotification({
                        message: "Intervention vétérinaire créée",
                        level: "success",
                    });
                    handleClose(true);
                })
                .catch((err) => {
                    console.error(err);
                    setIsEditing(true);
                    notificationSystem?.addNotification({
                        message: `Une erreur s'est produite pendant la création des données\n${err}`,
                        level: "error",
                    });
                });
            return;
        }

        // Send new data to API
        VeterinarianInterventionsManager.update(veterinarianIntervention)
            .then(() => {
                notificationSystem?.addNotification({
                    message: "Intervention vétérinaire mise à jour",
                    level: "success",
                });
                handleClose(true);
            })
            .catch((err) => {
                console.error(err);
                setIsEditing(true);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la mise à jour des données\n${err}`,
                    level: "error",
                });
            });
    };

    const deleteVetInter = () => {
        VeterinarianInterventionsManager.delete(veterinarianIntervention)
            .then(() => {
                notificationSystem?.addNotification({
                    message: "Intervention Vétérinaire supprimée",
                    level: "success",
                });
                handleClose(true);
            })
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la suppression des données\n${err}`,
                    level: "error",
                });
            });
    };

    console.log(veterinarianIntervention);

    return (
        <Modal isOpen={show} {...props}>
            <ModalHeader closeButton>
                <Row className={"justify-content-end"}>
                    <Col>
                        <h1>Intervention vétérinaire</h1>
                    </Col>
                    <Col xs={"auto"}>
                        {veterinarianIntervention.id !== undefined &&
                            isEditing && (
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
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs={6}>
                        <Label>Date</Label>
                        <Input
                            type="date"
                            value={veterinarianIntervention.date}
                            disabled={!isEditing}
                            onChange={(evt) =>
                                setVeterinarianIntervention({
                                    ...veterinarianIntervention,
                                    date: evt.target.value,
                                })
                            }
                        />
                    </Col>
                    <Col xs={6}>
                        <Label>Vétérinaire</Label>
                        <Dropdown
                            withNewLine={true}
                            withSearch={true}
                            withSort={true}
                            color={"primary"}
                            disabled={!isEditing}
                            value={{
                                id: veterinarianIntervention.veterinarian_id,
                                name:
                                    veterinarians.find(
                                        (vet) =>
                                            vet.id ===
                                            veterinarianIntervention.veterinarian_id
                                    )?.name || "",
                            }}
                            values={veterinarians}
                            valueDisplayName={(vet) => vet.name}
                            valueActiveCheck={(vet) =>
                                vet.id ===
                                veterinarianIntervention.veterinarian_id
                            }
                            key={"veterinarian"}
                            onChange={(newVet) =>
                                setVeterinarianIntervention({
                                    ...veterinarianIntervention,
                                    veterinarian_id: newVet.id,
                                })
                            }
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Label>Description</Label>
                        <Input
                            type="textarea"
                            value={veterinarianIntervention.description}
                            disabled={!isEditing}
                            onChange={(evt) =>
                                setVeterinarianIntervention({
                                    ...veterinarianIntervention,
                                    description: evt.target.value,
                                })
                            }
                        />
                    </Col>
                </Row>

                <DeleteConfirmationModal
                    show={showDeleteConfirmationModal}
                    handleClose={(confirmed) => {
                        setShowDeleteConfirmationModal(false);
                        if (confirmed) {
                            deleteVetInter();
                        }
                    }}
                    bodyEntityName={"une Intervention Vétérinaire"}
                />
            </ModalBody>
            <ModalFooter>
                {isEditing && (
                    <>
                        <Button
                            color="danger"
                            onClick={() => {
                                if (veterinarianIntervention.id === undefined) {
                                    handleClose(false);
                                } else {
                                    setVeterinarianIntervention(vetInter);
                                    setIsEditing(false);
                                }
                            }}
                        >
                            Annuler
                        </Button>
                        <Button color="primary" onClick={() => save()}>
                            Sauvegarder
                        </Button>
                    </>
                )}
                {!isEditing && (
                    <Button color="primary" onClick={() => handleClose(false)}>
                        Fermer
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
};

export default VeterinarianInterventionModal;
