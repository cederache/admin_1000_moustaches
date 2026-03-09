import React, { FC } from "react";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Col, Input, Label, Row } from "reactstrap";
import HostFamily from "../../../logic/entities/HostFamily";

interface HostFamilyHomeAccordionProps {
    hostFamily: HostFamily;
    isEditing: boolean;
    canUpdate: boolean;
    openId: string;
    onToggle: (id: string) => void;
    onHostFamilyChange: (updates: Partial<HostFamily>) => void;
}

const HostFamilyHomeAccordion: FC<HostFamilyHomeAccordionProps> = ({
    hostFamily,
    isEditing,
    canUpdate,
    openId,
    onToggle,
    onHostFamilyChange,
}) => {
    const disabled = !isEditing || !canUpdate;
    return (
        <Accordion className="pb-3" open={openId} {...{ toggle: onToggle }}>
            <AccordionItem>
                <AccordionHeader targetId="1">Information sur le foyer</AccordionHeader>
                <AccordionBody accordionId="1">
                    <Row>
                        <Col xs={4}>
                            <Label>Nombre d'enfant</Label>
                            <Input
                                value={hostFamily.nbChildren?.toString() || ""}
                                disabled={disabled}
                                onChange={(evt) => {
                                    const nbChildren = parseInt(evt.target.value, 10);
                                    onHostFamilyChange({
                                        nbChildren: isNaN(nbChildren) ? undefined : nbChildren,
                                    });
                                }}
                            />
                        </Col>
                        <Col xs={8}>
                            <Label>Informations enfant(s)</Label>
                            <Input
                                type="textarea"
                                value={hostFamily.childrenInfos || ""}
                                disabled={disabled}
                                onChange={(evt) => onHostFamilyChange({ childrenInfos: evt.target.value })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Label>Informations animaux</Label>
                            <Input
                                type="textarea"
                                value={hostFamily.animalsInfos || ""}
                                disabled={disabled}
                                onChange={(evt) => onHostFamilyChange({ animalsInfos: evt.target.value })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Label>Observations</Label>
                            <Input
                                type="textarea"
                                value={hostFamily.observations || ""}
                                disabled={disabled}
                                onChange={(evt) => onHostFamilyChange({ observations: evt.target.value })}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Label>Informations sur le logement</Label>
                            <Input
                                type="textarea"
                                value={hostFamily.housingInformations || ""}
                                disabled={disabled}
                                onChange={(evt) => onHostFamilyChange({ housingInformations: evt.target.value })}
                            />
                        </Col>
                    </Row>
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    );
};

export default HostFamilyHomeAccordion;
