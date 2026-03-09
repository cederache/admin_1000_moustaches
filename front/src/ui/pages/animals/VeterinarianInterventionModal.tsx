import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdDelete, MdOutlineModeEdit } from "react-icons/md";
import { Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Dropdown from "../../components/Dropdown";
import VeterinarianInterventionsManager from "../../../managers/veterinarianInterventions.manager";
import VeterinariansManager from "../../../managers/veterinarians.manager";
import VeterinarianIntervention from "../../../logic/entities/VeterinarianIntervention";
import Veterinarian from "../../../logic/entities/Veterinarian";
import toast from "react-hot-toast";
import Animal from "../../../logic/entities/Animal";

interface VeterinarianInterventionModalProps {
    animal: Animal;
    veterinarianIntervention: VeterinarianIntervention;
    show: boolean;
    handleClose: (close: boolean) => void;
}

const VeterinarianInterventionModal: FC<VeterinarianInterventionModalProps> = ({
    animal,
    veterinarianIntervention: vetInter,
    show,
    handleClose,
    ...props
}) => {
    const { t } = useTranslation();
    const [veterinarianIntervention, setVeterinarianIntervention] = useState<VeterinarianIntervention>(vetInter);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);
    const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);

    const getVeterinarians = () => {
        VeterinariansManager.getAll()
            .then(setVeterinarians)
            .catch((err) => {
                console.error(err);
                toast.error(`${t("common.errorFetch")}\n${err}`);
            });
    };

    useEffect(() => {
        getVeterinarians();
        setIsEditing(vetInter.id === -1);
    }, []);

    const save = () => {
        setIsEditing(false);
        if (veterinarianIntervention.id === -1) {
            // Send new data to API
            VeterinarianInterventionsManager.create({
                ...veterinarianIntervention,
                animalId: animal.id,
            })
                .then((_) => {
                    toast.success(t("animals.message.interventionCreated"));
                    handleClose(true);
                })
                .catch((err) => {
                    console.error(err);
                    setIsEditing(true);
                    toast.error(`${t("common.errorCreate")}\n${err}`);
                });
            return;
        }

        // Send new data to API
        VeterinarianInterventionsManager.update(veterinarianIntervention)
            .then(() => {
                toast.success(t("animals.message.interventionUpdated"));
                handleClose(true);
            })
            .catch((err) => {
                console.error(err);
                setIsEditing(true);
                toast.error(`${t("common.errorUpdate")}\n${err}`);
            });
    };

    const deleteVetInter = () => {
        VeterinarianInterventionsManager.delete(veterinarianIntervention)
            .then(() => {
                toast.success(t("animals.message.interventionDeletedAlt"));
                handleClose(true);
            })
            .catch((err) => {
                console.error(err);
                toast.error(`${t("common.errorDelete")}\n${err}`);
            });
    };

    return (
        <Modal isOpen={show} {...props}>
            <ModalHeader closeButton>
                <Row className={"justify-content-end"}>
                    <Col>
                        <h1>{t("animals.modal.veterinarianInterventionTitle")}</h1>
                    </Col>
                    <Col xs={"auto"}>
                        {veterinarianIntervention.id !== -1 && isEditing && (
                            <Button color="danger" onClick={() => setShowDeleteConfirmationModal(true)}>
                                <MdDelete />
                            </Button>
                        )}
                        {!isEditing && (
                            <Button className="ms-2" color="primary" onClick={() => setIsEditing(true)}>
                                <MdOutlineModeEdit />
                            </Button>
                        )}
                    </Col>
                </Row>
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs={6}>
                        <Label>{t("animals.modal.veterinarianInterventionDate")}</Label>
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
                        <Label>{t("animals.modal.veterinarianInterventionVeterinarian")}</Label>
                        <Dropdown
                            withNewLine={true}
                            withSearch={true}
                            withSort={true}
                            color={"primary"}
                            disabled={!isEditing}
                            value={{
                                id: veterinarianIntervention.veterinarianId,
                                name: veterinarians.find((vet) => vet.id === veterinarianIntervention.veterinarianId)?.name || "",
                            }}
                            values={veterinarians}
                            valueDisplayName={(vet) => vet.name}
                            valueActiveCheck={(vet) => vet.id === veterinarianIntervention.veterinarianId}
                            key={"veterinarian"}
                            onChange={(newVet) =>
                                setVeterinarianIntervention({
                                    ...veterinarianIntervention,
                                    veterinarianId: newVet.id,
                                })
                            }
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Label>{t("animals.modal.veterinarianInterventionDescription")}</Label>
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
                    bodyEntityName={t("animals.modal.interventionEntityName")}
                />
            </ModalBody>
            <ModalFooter>
                {isEditing && (
                    <>
                        <Button
                            color="danger"
                            onClick={() => {
                                if (veterinarianIntervention.id === -1) {
                                    handleClose(false);
                                } else {
                                    setVeterinarianIntervention(vetInter);
                                    setIsEditing(false);
                                }
                            }}
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button color="primary" onClick={() => save()}>
                            {t("common.save")}
                        </Button>
                    </>
                )}
                {!isEditing && (
                    <Button color="primary" onClick={() => handleClose(false)}>
                        {t("common.close")}
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
};

export default VeterinarianInterventionModal;
