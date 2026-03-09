import React, { FC } from "react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
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
                <AccordionHeader targetId="1">{t("hostFamilies.accordion.hostTitle")}</AccordionHeader>
                <AccordionBody accordionId="1">
                    <Row>
                        <Col xs={12}>
                            <Label>{t("hostFamilies.accordion.hostType")}</Label>
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
                            <Label>{t("hostFamilies.accordion.hostVetCare")}</Label>
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
                            <Label>{t("hostFamilies.accordion.hostSocialize")}</Label>
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
                            <Label>{t("hostFamilies.accordion.hostHandicapped")}</Label>
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
                            <Label>{t("hostFamilies.accordion.hostNightCare")}</Label>
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
                            <Label>{t("hostFamilies.accordion.hostCanIsolate")}</Label>
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
                                        ? t("common.nsp")
                                        : value === "yes_short"
                                        ? t("hostFamilies.dropdown.canIsolateYesShort")
                                        : value === "yes_long"
                                        ? t("hostFamilies.dropdown.canIsolateYesLong")
                                        : t("hostFamilies.dropdown.canIsolateNo")
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
                            <Label>{t("hostFamilies.accordion.hostConditions")}</Label>
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
