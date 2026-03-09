import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import NullableDropdown from "../../components/NullableDropdown";
import AnimalToHostFamily from "../../../logic/entities/AnimalToHostFamily";
import HostFamily from "../../../logic/entities/HostFamily";
import toast from "react-hot-toast";
import { useCreateAnimalToHostFamily } from "../../../hooks/animalHostFamilies/useCreateAnimalToHostFamily";
import { useUpdateAnimalToHostFamily } from "../../../hooks/animalHostFamilies/useUpdateAnimalToHostFamily";

interface AnimalToHostFamilyModalProps {
    hostFamilies: HostFamily[];
    animalToHostFamily: AnimalToHostFamily;
    currentAnimalToHostFamily: AnimalToHostFamily | null;
    show: boolean;
    handleClose: (shouldReload: boolean) => void;
}

const AnimalToHostFamilyModal: FC<AnimalToHostFamilyModalProps> = ({
    hostFamilies,
    animalToHostFamily: athf,
    currentAnimalToHostFamily,
    show,
    handleClose,
    ...props
}) => {
    const { t } = useTranslation();
    const [animalToHostFamily, setAnimalToHostFamily] = useState<AnimalToHostFamily>(athf);
    const modification = !!athf.hostFamily;

    useEffect(() => {
        setAnimalToHostFamily(athf);
    }, [athf]);

    const { mutate: createAthfMutation } = useCreateAnimalToHostFamily();
    const { mutate: updateAthfMutation } = useUpdateAnimalToHostFamily();

    const save = () => {
        if (modification) {
            updateAthfMutation(animalToHostFamily, {
                onSuccess: () => {
                    toast.success(t("animals.message.linkUpdated"));
                    handleClose(true);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(`${t("common.errorUpdateData")}\n${err}`);
                },
            });
        } else {
            createAthfMutation(animalToHostFamily, {
                onSuccess: () => {
                    toast.success(t("animals.message.linkCreated"));
                    handleClose(true);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(`${t("common.errorCreate")}\n${err}`);
                },
            });
        }
    };

    return (
        <Modal isOpen={show} {...props}>
            <ModalHeader closeButton>
                <h1>{t("animals.modal.animalToHostFamilyTitle")}</h1>
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs={6}>
                        <Label>{t("animals.modal.animalToHostFamilyHostFamily")}</Label>
                        <NullableDropdown
                            withNewLine={true}
                            withSearch={true}
                            withSort={true}
                            color="primary"
                            value={hostFamilies.find((hf) => hf.id === animalToHostFamily.hostFamily?.id)}
                            values={[
                                ...hostFamilies.filter(
                                    (hf) => hf.id !== currentAnimalToHostFamily?.hostFamily?.id
                                ),
                                undefined,
                            ]}
                            valueDisplayName={(hf) => (hf === undefined ? "-" : `${hf.firstname} ${hf.name}`)}
                            valueActiveCheck={(hf) =>
                                hf === undefined
                                    ? animalToHostFamily.hostFamily?.id === undefined
                                    : hf.id === animalToHostFamily.hostFamily?.id
                            }
                            key="hostFamily"
                            onChange={(newHf) =>
                                setAnimalToHostFamily({
                                    ...animalToHostFamily,
                                    hostFamily: newHf ?? undefined,
                                })
                            }
                        />
                    </Col>
                    <Col xs={6}>
                        <Label>{t("animals.modal.animalToHostFamilyEntryDate")}</Label>
                        <Input
                            type="date"
                            value={animalToHostFamily.entryDate}
                            onChange={(evt) =>
                                setAnimalToHostFamily({
                                    ...animalToHostFamily,
                                    entryDate: evt.target.value,
                                })
                            }
                        />
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={() => handleClose(false)}>
                    {t("common.cancel")}
                </Button>
                <Button
                    color="primary"
                    onClick={() => save()}
                    disabled={!animalToHostFamily.hostFamily}
                >
                    {t("common.save")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AnimalToHostFamilyModal;
