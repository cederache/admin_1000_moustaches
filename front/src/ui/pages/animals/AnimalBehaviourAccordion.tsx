import React, { FC } from "react";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Col, Input, Label, Row } from "reactstrap";
import BooleanNullableDropdown from "../../components/BooleanNullableDropdown";
import NullableDropdown from "../../components/NullableDropdown";
import Animal from "../../../logic/entities/Animal";

interface AnimalBehaviourAccordionProps {
    animal: Animal;
    isEditing: boolean;
    canUpdate: boolean;
    openId: string;
    onToggle: (id: string) => void;
    onAnimalChange: (updates: Partial<Animal>) => void;
}

const AnimalBehaviourAccordion: FC<AnimalBehaviourAccordionProps> = ({
    animal,
    isEditing,
    canUpdate,
    openId,
    onToggle,
    onAnimalChange,
}) => {
    const disabled = !isEditing || !canUpdate;
    return (
        <Accordion className="pb-3" open={openId} toggle={onToggle}>
            <AccordionItem>
                <AccordionHeader targetId="1">Comportement</AccordionHeader>
                <AccordionBody accordionId="1">
                    <Row>
                        <Col xs={12}>
                            <Label>Caractère</Label>
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
                            <Label>Besoin congénère</Label>
                            <BooleanNullableDropdown
                                withNewLine={true}
                                value={animal.needFriends ?? null}
                                disabled={disabled}
                                onChange={(newValue) => onAnimalChange({ needFriends: newValue ?? undefined })}
                            />
                        </Col>
                        <Col xs={6} md={3}>
                            <Label>Attitude</Label>
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
                                        ? "NSP"
                                        : value === "fearfull"
                                        ? "Craintif"
                                        : value === "shy"
                                        ? "Peureux"
                                        : value === "sociable"
                                        ? "Sociable"
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
                            <Label>OK chats</Label>
                            <BooleanNullableDropdown
                                withNewLine={true}
                                value={animal.catsOk ?? null}
                                disabled={disabled}
                                onChange={(newValue) => onAnimalChange({ catsOk: newValue ?? undefined })}
                            />
                        </Col>
                        <Col xs={6} md={3}>
                            <Label>OK chiens</Label>
                            <BooleanNullableDropdown
                                withNewLine={true}
                                value={animal.dogsOk ?? null}
                                disabled={disabled}
                                onChange={(newValue) => onAnimalChange({ dogsOk: newValue ?? undefined })}
                            />
                        </Col>
                        <Col xs={6} md={3}>
                            <Label>OK enfants</Label>
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
                            <Label>Particularité</Label>
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
