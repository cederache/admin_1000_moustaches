import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Col, Input, Label, Row } from "reactstrap";
import Animal from "../../../logic/entities/Animal";

interface AnimalDeathAccordionProps {
    animal: Animal;
    isEditing: boolean;
    canUpdate: boolean;
    openId: string;
    onToggle: (id: string) => void;
    onAnimalChange: (updates: Partial<Animal>) => void;
}

const AnimalDeathAccordion: FC<AnimalDeathAccordionProps> = ({
    animal,
    isEditing,
    canUpdate,
    openId,
    onToggle,
    onAnimalChange,
}) => {
    const { t } = useTranslation();
    const disabled = !isEditing || !canUpdate;
    return (
        <Accordion className="pb-3" open={openId} toggle={onToggle}>
            <AccordionItem>
                <AccordionHeader targetId="1">{t("animals.accordion.death")}</AccordionHeader>
                <AccordionBody accordionId="1">
                    <Row>
                        <Col xs={6}>
                            <Label>{t("animals.accordion.deathDate")}</Label>
                            <Input
                                type="date"
                                value={animal.deathDate}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ deathDate: evt.target.value })}
                            />
                        </Col>
                        <Col xs={6}>
                            <Label>{t("animals.accordion.deathReason")}</Label>
                            <Input
                                type="textarea"
                                value={animal.deathReason || ""}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ deathReason: evt.target.value })}
                            />
                        </Col>
                    </Row>
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    );
};

export default AnimalDeathAccordion;
