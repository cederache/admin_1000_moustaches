import React, { useEffect, useState } from "react";
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
import NullableDropdown from "../../components/NullableDropdown";
import AnimalsToHostFamiliesManager from "../../managers/animalsToHostFamilies.manager";
import PropTypes from "../../utils/propTypes";

const AnimalToHostFamilyModal = ({
    hostFamilies,
    animalToHostFamily: athf,
    currentAnimalToHostFamily,
    show,
    handleClose,
    notificationSystem,
    ...props
}) => {
    const [animalToHostFamily, setAnimalToHostFamily] = useState({
        ...athf,
    });

    useEffect(() => {}, []);

    const save = () => {
        AnimalsToHostFamiliesManager.create(animalToHostFamily)
            .then(() => {
                if (currentAnimalToHostFamily !== undefined) {
                    return AnimalsToHostFamiliesManager.update({ ...currentAnimalToHostFamily, exit_date_object: animalToHostFamily.entry_date_object })
                } else {
                    return Promise.resolve()
                }
            })
            .then((updatedAnimalToHostFamily) => {
                notificationSystem.addNotification({
                    message: "Lien Animal / Famille d'accueil créé",
                    level: "success",
                });
                handleClose(true);
            })
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
                    message: `Une erreur s'est produite pendant la création des données\n${err}`,
                    level: "error",
                });
            });
        return;
    };

    return (
        <Modal isOpen={show} {...props}>
            <ModalHeader closeButton>
                <h1>Animal / Famille d'accueil</h1>
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs={6}>
                        <Label>Famille d'accueil</Label>
                        <NullableDropdown
                            withNewLine={true}
                            withSearch={true}
                            withSort={true}
                            color={"primary"}
                            value={hostFamilies.find(
                                (hf) =>
                                    hf.id === animalToHostFamily.host_family_id
                            )}
                            values={[
                                ...hostFamilies.filter(
                                    (hf) =>
                                        hf.id !==
                                        currentAnimalToHostFamily?.host_family_id
                                ),
                                undefined,
                            ]}
                            valueDisplayName={(hf) =>
                                hf === undefined
                                    ? "-"
                                    : `${hf.firstname} ${hf.name}`
                            }
                            valueActiveCheck={(hf) =>
                                hf === undefined
                                    ? animalToHostFamily.host_family_id ===
                                      undefined
                                    : hf.id ===
                                      animalToHostFamily.host_family_id
                            }
                            key={"hostFamily"}
                            onChange={(newHf) =>
                                setAnimalToHostFamily({
                                    ...animalToHostFamily,
                                    host_family_id: newHf.id,
                                })
                            }
                        />
                    </Col>
                    <Col xs={6}>
                        <Label>Date d'entrée</Label>
                        <Input
                            type="date"
                            value={animalToHostFamily.entry_date_object.input}
                            onChange={(evt) =>
                                setAnimalToHostFamily({
                                    ...animalToHostFamily,
                                    entry_date_object: {
                                        ...animalToHostFamily.entry_date_object,
                                        input: evt.target.value,
                                    },
                                })
                            }
                        />
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={() => handleClose(false)}>
                    Annuler
                </Button>
                <Button
                    color="primary"
                    onClick={() => save()}
                    disabled={
                        animalToHostFamily.host_family_id === undefined ||
                        animalToHostFamily.entry_date_object.input === undefined
                    }
                >
                    Sauvegarder
                </Button>
            </ModalFooter>
        </Modal>
    );
};

AnimalToHostFamilyModal.propTypes = {
    hostFamilies: PropTypes.array.isRequired,
    animalToHostFamily: PropTypes.object.isRequired,
    currentAnimalToHostFamily: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    notificationSystem: PropTypes.object.isRequired
};

export default AnimalToHostFamilyModal;
