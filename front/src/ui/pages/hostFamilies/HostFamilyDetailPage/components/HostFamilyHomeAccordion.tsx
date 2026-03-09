import React, { FC } from "react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
    const disabled = !isEditing || !canUpdate;
    return (
        <Accordion className="pb-3" open={openId} {...{ toggle: onToggle }}>
            <AccordionItem>
                <AccordionHeader targetId="1">{t("hostFamilies.accordion.homeTitle")}</AccordionHeader>
                <AccordionBody accordionId="1">
                    <Row>
                        <Col xs={4}>
                            <Label>{t("hostFamilies.accordion.homeChildrenCount")}</Label>
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
                            <Label>{t("hostFamilies.accordion.homeChildrenInfo")}</Label>
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
                            <Label>{t("hostFamilies.accordion.homeAnimalsInfo")}</Label>
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
                            <Label>{t("hostFamilies.accordion.homeObservations")}</Label>
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
                            <Label>{t("hostFamilies.accordion.homeHousingInfo")}</Label>
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
