import React, { FC } from "react";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Col, Input, Label, Row } from "reactstrap";
import Dropdown from "../../components/Dropdown";
import NullableDropdown from "../../components/NullableDropdown";
import Animal from "../../../logic/entities/Animal";
import Species from "../../../logic/entities/Species";
import { Sexe } from "../../../managers/animals.manager";

interface AnimalInfoAccordionProps {
    animal: Animal;
    species: Species[];
    sexes: Sexe[];
    isEditing: boolean;
    canUpdate: boolean;
    openId: string;
    onToggle: (id: string) => void;
    onAnimalChange: (updates: Partial<Animal>) => void;
}

const AnimalInfoAccordion: FC<AnimalInfoAccordionProps> = ({
    animal,
    species,
    sexes,
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
                <AccordionHeader targetId="1">Informations</AccordionHeader>
                <AccordionBody accordionId="1">
                    <Row>
                        <Col xs={6}>
                            <Label>Photo</Label>
                        </Col>
                        <Col xs={6}>
                            <Row>
                                <Col xs={12}>
                                    <Label>ICAD</Label>
                                    <Input
                                        value={animal.icad || ""}
                                        disabled={disabled}
                                        onChange={(evt) => onAnimalChange({ icad: evt.target.value })}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6}>
                                    <Label>Espèce</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color="primary"
                                        disabled={disabled}
                                        value={{ id: animal.species?.id, name: animal.species?.name }}
                                        values={species}
                                        valueDisplayName={(aSpecies) => aSpecies.name}
                                        valueActiveCheck={(aSpecies) => aSpecies.id === animal?.species?.id}
                                        key="species"
                                        onChange={(newSpecies) => onAnimalChange({ species: newSpecies })}
                                    />
                                </Col>
                                <Col xs={6}>
                                    <Label>Sexe</Label>
                                    <NullableDropdown
                                        withNewLine={true}
                                        color="primary"
                                        disabled={disabled}
                                        value={
                                            animal.sexe === undefined || animal.sexe === null
                                                ? null
                                                : sexes.find((aSexe) => aSexe.key === animal?.sexe)
                                        }
                                        values={sexes}
                                        valueDisplayName={(aSexe) => aSexe.value}
                                        valueActiveCheck={(aSexe) => aSexe.key === animal?.sexe}
                                        key="sexes"
                                        onChange={(newSexe) => onAnimalChange({ sexe: newSexe?.key })}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6}>
                                    <Label>Race</Label>
                                    <Input
                                        value={animal.race || ""}
                                        disabled={disabled}
                                        onChange={(evt) => onAnimalChange({ race: evt.target.value })}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <Label>Date de naissance</Label>
                            <Input
                                type="date"
                                value={animal.birthdate}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ birthdate: evt.target.value })}
                            />
                        </Col>
                        <Col xs={6}>
                            <Label>Signes distinctifs</Label>
                            <Input
                                type="textarea"
                                value={animal.distinctiveSigns || ""}
                                disabled={disabled}
                                onChange={(evt) => onAnimalChange({ distinctiveSigns: evt.target.value })}
                            />
                        </Col>
                    </Row>
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    );
};

export default AnimalInfoAccordion;
