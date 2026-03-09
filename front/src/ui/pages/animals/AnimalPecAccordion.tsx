import React, { FC } from "react";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Col, Input, Label, Row } from "reactstrap";
import Animal from "../../../logic/entities/Animal";

interface AnimalPecAccordionProps {
    animal: Animal;
    isEditing: boolean;
    canUpdate: boolean;
    openId: string;
    onToggle: (id: string) => void;
    onAnimalChange: (updates: Partial<Animal>) => void;
}

const AnimalPecAccordion: FC<AnimalPecAccordionProps> = ({
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
                <AccordionHeader targetId="1">Prise en charge</AccordionHeader>
                <AccordionBody accordionId="1">
                    <Row>
                        <Col xs={6}>
                            <Label>Date de PEC</Label>
                            <Input
                                type="date"
                                value={animal.entryDate}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ entryDate: evt.target.value })}
                            />
                        </Col>
                        <Col xs={6}>
                            <Label>Lieu de PEC</Label>
                            <Input
                                type="textarea"
                                value={animal.placeOfCare || ""}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ placeOfCare: evt.target.value })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <Label>Raisons de PEC</Label>
                            <Input
                                type="textarea"
                                value={animal.reasonForCare || ""}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ reasonForCare: evt.target.value })}
                            />
                        </Col>
                        <Col xs={6}>
                            <Label>Informations de PEC</Label>
                            <Input
                                type="textarea"
                                value={animal.careInfos || ""}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ careInfos: evt.target.value })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Label>Cédant</Label>
                            <Input
                                type="textarea"
                                value={animal.transferor || ""}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ transferor: evt.target.value })}
                            />
                        </Col>
                    </Row>
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    );
};

export default AnimalPecAccordion;
