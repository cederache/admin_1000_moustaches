import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Col, Input, Label, Row } from "reactstrap";
import BooleanNullableDropdown from "../../../../components/BooleanNullableDropdown";
import Animal from "../../../../../logic/entities/Animal";

interface AnimalExitAccordionProps {
    animal: Animal;
    isEditing: boolean;
    canUpdate: boolean;
    openId: string;
    onToggle: (id: string) => void;
    onAnimalChange: (updates: Partial<Animal>) => void;
}

const AnimalExitAccordion: FC<AnimalExitAccordionProps> = ({ animal, isEditing, canUpdate, openId, onToggle, onAnimalChange }) => {
    const { t } = useTranslation();
    const disabled = !isEditing || !canUpdate;
    return (
        <Accordion className="pb-3" open={openId} toggle={onToggle}>
            <AccordionItem>
                <AccordionHeader targetId="1">{t("animals.accordion.exit")}</AccordionHeader>
                <AccordionBody accordionId="1">
                    <Row>
                        <Col xs={6} md={4}>
                            <Label>{t("animals.accordion.exitCessionCertificate")}</Label>
                            <BooleanNullableDropdown
                                withNewLine={true}
                                value={animal.transferCertificate ?? null}
                                disabled={disabled}
                                onChange={(newValue) => onAnimalChange({ transferCertificate: newValue })}
                            />
                        </Col>
                        <Col xs={6} md={8}>
                            <Label>{t("animals.accordion.exitDate")}</Label>
                            <Input type="date" value={animal.exitDate} disabled={disabled} onChange={(evt) => onAnimalChange({ exitDate: evt.target.value })} />
                        </Col>
                        <Col xs={12}>
                            <Label>{t("animals.accordion.exitReason")}</Label>
                            <Input
                                type="textarea"
                                value={animal.exitReason || ""}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ exitReason: evt.target.value })}
                            />
                        </Col>
                    </Row>
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    );
};

export default AnimalExitAccordion;
