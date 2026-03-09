import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { CardHeader, Col, Label, Row } from "reactstrap";
import { MdThumbUp } from "react-icons/md";
import { RiZzzFill } from "react-icons/ri";
import Switch from "../../components/Switch";
import HostFamily from "../../../logic/entities/HostFamily";

interface HostFamilyDetailHeaderProps {
    hostFamilyId: string;
    hostFamily: HostFamily;
    isEditing: boolean;
    canUpdateContact: boolean;
    onHostFamilyChange: (updates: Partial<HostFamily>) => void;
}

const HostFamilyDetailHeader: FC<HostFamilyDetailHeaderProps> = ({
    hostFamilyId,
    hostFamily,
    isEditing,
    canUpdateContact,
    onHostFamilyChange,
}) => {
    const { t } = useTranslation();
    return (
    <CardHeader>
        <Row>
            <Col>
                {hostFamilyId === "new" && <h2>{t("hostFamilies.header.newHostFamily")}</h2>}
                {hostFamilyId !== "new" && <h2>{hostFamily.displayName}</h2>}
            </Col>
            <Col xs="auto" className="justify-content-end">
                <Row>
                    <Col>
                        <Label>{t("hostFamilies.header.status")}</Label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {hostFamily.onBreak ? <RiZzzFill /> : <MdThumbUp />}
                        <Switch
                            id="break"
                            key="break"
                            isOn={!hostFamily.onBreak}
                            disabled={!isEditing || !canUpdateContact}
                            handleToggle={() =>
                                onHostFamilyChange({
                                    onBreak: !hostFamily.onBreak,
                                })
                            }
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    </CardHeader>
    );
};

export default HostFamilyDetailHeader;
