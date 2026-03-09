import React, { FC } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import BooleanNullableDropdown from "../../components/BooleanNullableDropdown";
import NullableDropdown from "../../components/NullableDropdown";
import Switch from "../../components/Switch";
import HostFamily from "../../../logic/entities/HostFamily";
import User from "../../../logic/entities/User";

interface HostFamilyDetailSummaryProps {
    hostFamily: HostFamily;
    referents: User[];
    isEditing: boolean;
    canUpdateContact: boolean;
    onHostFamilyChange: (updates: Partial<HostFamily>) => void;
}

const HostFamilyDetailSummary: FC<HostFamilyDetailSummaryProps> = ({
    hostFamily,
    referents,
    isEditing,
    canUpdateContact,
    onHostFamilyChange,
}) => {
    const disabled = !isEditing || !canUpdateContact;
    return (
        <>
            <Row>
                <Col>
                    <Label>A jour des cotisations</Label>
                </Col>
                <Col xs="auto">
                    <Switch
                        id="membership"
                        key="membership"
                        isOn={hostFamily.membershipUpToDate}
                        disabled={disabled}
                        handleToggle={() =>
                            onHostFamilyChange({
                                membershipUpToDate: !hostFamily.membershipUpToDate,
                            })
                        }
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Label>Référent·e</Label>
                </Col>
                <Col xs="auto">
                    <NullableDropdown
                        color="primary"
                        disabled={disabled}
                        value={referents.find((usr) => usr.id === hostFamily.referent?.id)}
                        values={referents}
                        valueDisplayName={(usr) => (usr === undefined ? "Aucun·e" : `${usr?.firstname} ${usr?.name}`)}
                        valueActiveCheck={(usr) => usr.id === hostFamily.referent?.id}
                        key="referents"
                        onChange={(newUser) => onHostFamilyChange({ referent: newUser })}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Label>Est tampon</Label>
                </Col>
                <Col xs="auto">
                    <Switch
                        id="temporary"
                        key="temporary"
                        isOn={hostFamily.isTemporary}
                        disabled={disabled}
                        handleToggle={() =>
                            onHostFamilyChange({
                                isTemporary: !hostFamily.isTemporary,
                            })
                        }
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <Label>Permis de conduire</Label>
                    <BooleanNullableDropdown
                        withNewLine={true}
                        value={hostFamily.driverLicense ?? null}
                        disabled={disabled}
                        onChange={(newValue) => onHostFamilyChange({ driverLicense: newValue ?? undefined })}
                    />
                </Col>
                <Col xs={6}>
                    <Label>Véhiculé·e</Label>
                    <BooleanNullableDropdown
                        withNewLine={true}
                        value={hostFamily.hasVehicule ?? null}
                        disabled={disabled}
                        onChange={(newValue) => onHostFamilyChange({ hasVehicule: newValue ?? undefined })}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Label>Situation</Label>
                    <Input
                        type="textarea"
                        value={hostFamily.situation || ""}
                        disabled={disabled}
                        onChange={(evt) => onHostFamilyChange({ situation: evt.target.value })}
                    />
                </Col>
            </Row>
        </>
    );
};

export default HostFamilyDetailSummary;
