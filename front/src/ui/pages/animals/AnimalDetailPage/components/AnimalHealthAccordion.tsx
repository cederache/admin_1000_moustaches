import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Col, Input, Label, Row } from "reactstrap";
import BooleanNullableDropdown from "../../../../components/BooleanNullableDropdown";
import { SPECIES_ID } from "../../../../../utils/constants";
import Animal from "../../../../../logic/entities/Animal";

interface AnimalHealthAccordionProps {
    animal: Animal;
    isEditing: boolean;
    canUpdate: boolean;
    openId: string;
    onToggle: (id: string) => void;
    onAnimalChange: (updates: Partial<Animal>) => void;
}

const AnimalHealthAccordion: FC<AnimalHealthAccordionProps> = ({ animal, isEditing, canUpdate, openId, onToggle, onAnimalChange }) => {
    const { t } = useTranslation();
    const disabled = !isEditing || !canUpdate;
    const isCat = animal.species?.id === SPECIES_ID.CAT;
    return (
        <Accordion className="pb-3" open={openId} toggle={onToggle}>
            <AccordionItem>
                <AccordionHeader targetId="1">{t("animals.accordion.health")}</AccordionHeader>
                <AccordionBody accordionId="1">
                    <Row>
                        <Col xs={6}>
                            <Label>{t("animals.accordion.healthPrimoVaccination")}</Label>
                            <Input
                                type="date"
                                value={animal.firstVaccinationDate}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ firstVaccinationDate: evt.target.value })}
                            />
                        </Col>
                        <Col xs={6}>
                            <Label>{t("animals.accordion.healthVaccineRecall")}</Label>
                            <Input
                                type="date"
                                value={animal.secondVaccinationDate}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ secondVaccinationDate: evt.target.value })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} md={3}>
                            <Label>{t("animals.accordion.healthSterilized")}</Label>
                            <BooleanNullableDropdown
                                withNewLine={true}
                                value={animal.sterilised ?? null}
                                disabled={disabled}
                                onChange={(newValue) => onAnimalChange({ sterilised: newValue ?? undefined })}
                            />
                        </Col>
                        {isCat && (
                            <>
                                <Col xs={6} md={3}>
                                    <Label>{t("animals.accordion.healthOutdoorRequired")}</Label>
                                    <BooleanNullableDropdown
                                        withNewLine={true}
                                        value={animal.needExternalAccess ?? null}
                                        disabled={disabled}
                                        onChange={(newValue) => onAnimalChange({ needExternalAccess: newValue ?? undefined })}
                                    />
                                </Col>
                                <Col xs={6} md={3}>
                                    <Label>{t("animals.accordion.healthFivNegative")}</Label>
                                    <BooleanNullableDropdown
                                        withNewLine={true}
                                        value={animal.fivNegative ?? null}
                                        disabled={disabled}
                                        onChange={(newValue) => onAnimalChange({ fivNegative: newValue ?? undefined })}
                                    />
                                </Col>
                                <Col xs={6} md={3}>
                                    <Label>{t("animals.accordion.healthFelvNegative")}</Label>
                                    <BooleanNullableDropdown
                                        withNewLine={true}
                                        value={animal.felvNegative ?? null}
                                        disabled={disabled}
                                        onChange={(newValue) => onAnimalChange({ felvNegative: newValue ?? undefined })}
                                    />
                                </Col>
                            </>
                        )}
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <Label>{t("animals.accordion.healthAntiparasiticDate")}</Label>
                            <Input
                                type="date"
                                value={animal.antiParasiticDate}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ antiParasiticDate: evt.target.value })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Label>{t("animals.accordion.healthParticularity")}</Label>
                            <Input
                                type="textarea"
                                value={animal.healthIssues || ""}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ healthIssues: evt.target.value })}
                            />
                        </Col>
                    </Row>
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    );
};

export default AnimalHealthAccordion;
