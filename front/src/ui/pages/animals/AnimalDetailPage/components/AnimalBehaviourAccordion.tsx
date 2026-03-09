import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Col, Input, Label, Row } from "reactstrap";
import BooleanNullableDropdown from "../../../../components/BooleanNullableDropdown";
import NullableDropdown from "../../../../components/NullableDropdown";
import Animal from "../../../../../logic/entities/Animal";

interface AnimalBehaviourAccordionProps {
    animal: Animal;
    isEditing: boolean;
    canUpdate: boolean;
    openId: string;
    onToggle: (id: string) => void;
    onAnimalChange: (updates: Partial<Animal>) => void;
}

const AnimalBehaviourAccordion: FC<AnimalBehaviourAccordionProps> = ({ animal, isEditing, canUpdate, openId, onToggle, onAnimalChange }) => {
    const { t } = useTranslation();
    const disabled = !isEditing || !canUpdate;
    return (
        <Accordion className="pb-3" open={openId} toggle={onToggle}>
            <AccordionItem>
                <AccordionHeader targetId="1">{t("animals.accordion.behaviour")}</AccordionHeader>
                <AccordionBody accordionId="1">
                    <Row>
                        <Col xs={12}>
                            <Label>{t("animals.accordion.behaviourCharacter")}</Label>
                            <Input
                                type="textarea"
                                value={animal.behaviour || ""}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ behaviour: evt.target.value })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} md={3}>
                            <Label>{t("animals.accordion.behaviourNeedFriends")}</Label>
                            <BooleanNullableDropdown
                                withNewLine={true}
                                value={animal.needFriends ?? null}
                                disabled={disabled}
                                onChange={(newValue) => onAnimalChange({ needFriends: newValue ?? undefined })}
                            />
                        </Col>
                        <Col xs={6} md={3}>
                            <Label>{t("animals.accordion.behaviourPosture")}</Label>
                            <NullableDropdown
                                withNewLine={true}
                                color={
                                    animal.posture === null || animal.posture === undefined
                                        ? "fearfull"
                                        : animal.posture === "shy"
                                        ? "info"
                                        : animal.posture === "sociable"
                                        ? "success"
                                        : "danger"
                                }
                                value={animal.posture}
                                values={["nsp", "fearfull", "shy", "sociable"]}
                                valueDisplayName={(value) =>
                                    value === null || value === undefined
                                        ? t("common.nsp")
                                        : value === "fearfull"
                                        ? t("animals.dropdown.postureFearful")
                                        : value === "shy"
                                        ? t("animals.dropdown.postureShy")
                                        : value === "sociable"
                                        ? t("animals.dropdown.postureSociable")
                                        : ""
                                }
                                valueActiveCheck={(value) => animal?.posture === value}
                                key="posture"
                                disabled={disabled}
                                onChange={(newPosture) => onAnimalChange({ posture: newPosture })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} md={3}>
                            <Label>{t("animals.accordion.behaviourCatsOk")}</Label>
                            <BooleanNullableDropdown
                                withNewLine={true}
                                value={animal.catsOk ?? null}
                                disabled={disabled}
                                onChange={(newValue) => onAnimalChange({ catsOk: newValue ?? undefined })}
                            />
                        </Col>
                        <Col xs={6} md={3}>
                            <Label>{t("animals.accordion.behaviourDogsOk")}</Label>
                            <BooleanNullableDropdown
                                withNewLine={true}
                                value={animal.dogsOk ?? null}
                                disabled={disabled}
                                onChange={(newValue) => onAnimalChange({ dogsOk: newValue ?? undefined })}
                            />
                        </Col>
                        <Col xs={6} md={3}>
                            <Label>{t("animals.accordion.behaviourKidsOk")}</Label>
                            <BooleanNullableDropdown
                                withNewLine={true}
                                value={animal.kidsOk ?? null}
                                disabled={disabled}
                                onChange={(newValue) => onAnimalChange({ kidsOk: newValue ?? undefined })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Label>{t("animals.accordion.behaviourParticularity")}</Label>
                            <Input
                                type="textarea"
                                value={animal.behaviorParticularity || ""}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ behaviorParticularity: evt.target.value })}
                            />
                        </Col>
                    </Row>
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    );
};

export default AnimalBehaviourAccordion;
