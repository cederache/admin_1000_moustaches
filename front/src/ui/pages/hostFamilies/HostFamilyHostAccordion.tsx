import React, { FC } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionBody,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import BooleanNullableDropdown from "../../components/BooleanNullableDropdown";
import NullableDropdown from "../../components/NullableDropdown";
import HostFamily from "../../../logic/entities/HostFamily";
import HostFamilyKind from "../../../logic/entities/HostFamilyKind";

interface HostFamilyHostAccordionProps {
    hostFamily: HostFamily;
    hostFamilyKinds: HostFamilyKind[];
    isEditing: boolean;
    canUpdate: boolean;
    openId: string;
    onToggle: (id: string) => void;
    onHostFamilyChange: (updates: Partial<HostFamily>) => void;
}

const HostFamilyHostAccordion: FC<HostFamilyHostAccordionProps> = ({
    hostFamily,
    hostFamilyKinds,
    isEditing,
    canUpdate,
    openId,
    onToggle,
    onHostFamilyChange,
}) => {
    const disabled = !isEditing || !canUpdate;
    const currentKinds = hostFamily.hostFamilyKinds ?? [];

    const handleKindToggle = (hfk: HostFamilyKind, checked: boolean) => {
        if (checked) {
            const exists = currentKinds.some((k) => k.id === hfk.id);
            if (!exists) {
                onHostFamilyChange({ hostFamilyKinds: [...currentKinds, hfk] });
            }
        } else {
            onHostFamilyChange({
                hostFamilyKinds: currentKinds.filter((k) => k.id !== hfk.id),
            });
        }
    };

    return (
        <Accordion className="pb-3" open={openId} {...{ toggle: onToggle }}>
            <AccordionItem>
                <AccordionHeader targetId="1">Information sur l'accueil</AccordionHeader>
                <AccordionBody accordionId="1">
                    <Row>
                        <Col xs={12}>
                            <Label>Type de Famille d'Accueil</Label>
                            <FormGroup check>
                                {hostFamilyKinds.map((hfk) => (
                                    <Row key={hfk.id}>
                                        <Col>
                                            <Label check>
                                                <Input
                                                    type="checkbox"
                                                    id={String(hfk.id)}
                                                    checked={currentKinds.some((k) => k.id === hfk.id)}
                                                    onChange={(evt) => handleKindToggle(hfk, evt.target.checked)}
                                                    disabled={disabled}
                                                />
                                                {hfk.name}
                                            </Label>
                                        </Col>
                                    </Row>
                                ))}
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4} lg={3}>
                            <Label>Peut donner soins véto</Label>
                            <BooleanNullableDropdown
                                withNewLine={true}
                                value={hostFamily.canProvideVeterinaryCare ?? null}
                                disabled={disabled}
                                onChange={(newValue) =>
                                    onHostFamilyChange({ canProvideVeterinaryCare: newValue ?? undefined })
                                }
                            />
                        </Col>
                        <Col xs={4} lg={3}>
                            <Label>Peut sociabiliser</Label>
                            <BooleanNullableDropdown
                                withNewLine={true}
                                value={hostFamily.canProvideSociabilisation ?? null}
                                disabled={disabled}
                                onChange={(newValue) =>
                                    onHostFamilyChange({ canProvideSociabilisation: newValue ?? undefined })
                                }
                            />
                        </Col>
                        <Col xs={4} lg={3}>
                            <Label>Peut accueillir des animaux handicapés</Label>
                            <BooleanNullableDropdown
                                withNewLine={true}
                                value={hostFamily.canHostDisableAnimal ?? null}
                                disabled={disabled}
                                onChange={(newValue) =>
                                    onHostFamilyChange({ canHostDisableAnimal: newValue ?? undefined })
                                }
                            />
                        </Col>
                        <Col xs={4} lg={3}>
                            <Label>Peut donner des soins de nuit</Label>
                            <BooleanNullableDropdown
                                withNewLine={true}
                                value={hostFamily.canProvideNightCare ?? null}
                                disabled={disabled}
                                onChange={(newValue) =>
                                    onHostFamilyChange({ canProvideNightCare: newValue ?? undefined })
                                }
                            />
                        </Col>
                        <Col xs={4} lg={3}>
                            <Label>Peut isoler</Label>
                            <NullableDropdown
                                withNewLine={true}
                                color={
                                    hostFamily.canIsolate === undefined
                                        ? "warning"
                                        : hostFamily.canIsolate === true
                                        ? "success"
                                        : "danger"
                                }
                                value={hostFamily.canIsolate}
                                values={["no", "yes_short", "yes_long"]}
                                valueDisplayName={(value) =>
                                    value === null || value === undefined
                                        ? "NSP"
                                        : value === "yes_short"
                                        ? "Oui, qqs jours"
                                        : value === "yes_long"
                                        ? "Oui, ok long terme"
                                        : "Non"
                                }
                                valueActiveCheck={(value) => hostFamily.canIsolate === value}
                                key="can_isolate"
                                disabled={disabled}
                                onChange={(newCanIsolate) => onHostFamilyChange({ canIsolate: newCanIsolate })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Label>Conditions d'accueil (nb animaux, ...)</Label>
                            <Input
                                type="textarea"
                                disabled={disabled}
                                value={hostFamily.hostConditions || ""}
                                onChange={(evt) => onHostFamilyChange({ hostConditions: evt.target.value })}
                            />
                        </Col>
                    </Row>
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    );
};

export default HostFamilyHostAccordion;
