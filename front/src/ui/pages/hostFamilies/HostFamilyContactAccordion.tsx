import React, { FC } from "react";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Col, Input, Label, Row } from "reactstrap";
import SourceLink from "../../components/SourceLink";
import { MdDirections } from "react-icons/md";
import HostFamily from "../../../logic/entities/HostFamily";

interface HostFamilyContactAccordionProps {
    hostFamilyId: string;
    hostFamily: HostFamily;
    isEditing: boolean;
    canUpdate: boolean;
    openId: string;
    onToggle: (id: string) => void;
    onHostFamilyChange: (updates: Partial<HostFamily>) => void;
    formattedPhone?: string;
    geocodeFound?: boolean | null;
}

const HostFamilyContactAccordion: FC<HostFamilyContactAccordionProps> = ({
    hostFamilyId,
    hostFamily,
    isEditing,
    canUpdate,
    openId,
    onToggle,
    onHostFamilyChange,
    formattedPhone,
    geocodeFound = null,
}) => {
    const disabled = !isEditing || !canUpdate;
    return (
        <Accordion
            className="pb-3"
            open={openId}
            {...{ toggle: onToggle }}
        >
            <AccordionItem>
                <AccordionHeader targetId="1">Information de contact</AccordionHeader>
                <AccordionBody accordionId="1">
                    {hostFamilyId === "new" && isEditing && (
                        <Row>
                            <Col xs={6}>
                                <Label>Prénom</Label>
                                <Input
                                    value={hostFamily.firstname || ""}
                                    disabled={disabled}
                                    onChange={(evt) => onHostFamilyChange({ firstname: evt.target.value })}
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>Nom</Label>
                                <Input
                                    value={hostFamily.name || ""}
                                    disabled={disabled}
                                    onChange={(evt) => onHostFamilyChange({ name: evt.target.value })}
                                />
                            </Col>
                        </Row>
                    )}
                    <Row>
                        <Col xs={6}>
                            <Label>Téléphone</Label>
                            {isEditing && canUpdate && (
                                <Input
                                    type="tel"
                                    value={hostFamily.phone || ""}
                                    onChange={(evt) => onHostFamilyChange({ phone: evt.target.value })}
                                />
                            )}
                            {!isEditing && (
                                <Input type="tel" value={formattedPhone ?? hostFamily.phone} disabled />
                            )}
                        </Col>
                        <Col xs={6}>
                            <Label>E-mail</Label>
                            <Input
                                type="email"
                                value={hostFamily.mail || ""}
                                disabled={disabled}
                                onChange={(evt) => onHostFamilyChange({ mail: evt.target.value })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <Label>Pseudo</Label>
                            <Input
                                value={hostFamily.socialNetworkAlias || ""}
                                disabled={disabled}
                                onChange={(evt) => onHostFamilyChange({ socialNetworkAlias: evt.target.value })}
                            />
                        </Col>
                        <Col xs={6}>
                            <Label>
                                {hostFamily.address !== undefined && (
                                    <SourceLink link={`https://www.google.com/maps/place/${hostFamily.address}`}>
                                        <span>
                                            Adresse <MdDirections />
                                        </span>
                                    </SourceLink>
                                )}
                                {hostFamily.address === undefined && <span>Adresse</span>}
                            </Label>
                            <Input
                                type="textarea"
                                value={hostFamily.address ?? ""}
                                disabled={disabled}
                                onChange={(evt) => onHostFamilyChange({ address: evt.target.value })}
                            />
                            {geocodeFound !== null && (
                                <p className={geocodeFound === true ? "text-success" : "text-danger"}>
                                    <small>{geocodeFound === true ? "Adresse valide" : "Adresse non trouvée"}</small>
                                </p>
                            )}
                        </Col>
                    </Row>
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    );
};

export default HostFamilyContactAccordion;
