import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, CardHeader, Col, Input, Label, Row } from "reactstrap";
import Switch from "../../../../components/Switch";
import User from "../../../../../logic/entities/User";

interface UserDetailFormProps {
    user: User;
    isEditing: boolean;
    isNew: boolean;
    onUserChange: (updates: Partial<User>) => void;
}

const UserDetailForm: FC<UserDetailFormProps> = ({ user, isEditing, isNew, onUserChange }) => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <h2>{isNew ? t("users.newUser") : `${user.firstname} ${user.name}`}</h2>
            </CardHeader>
            <CardBody>
                {(isNew || isEditing) && (
                    <Row>
                        <Col xs={6}>
                            <Label>{t("users.formFirstname")}</Label>
                            <Input value={user.firstname || ""} disabled={!isEditing} onChange={(evt) => onUserChange({ firstname: evt.target.value })} />
                        </Col>
                        <Col xs={6}>
                            <Label>{t("users.formLastname")}</Label>
                            <Input value={user.name || ""} disabled={!isEditing} onChange={(evt) => onUserChange({ name: evt.target.value })} />
                        </Col>
                    </Row>
                )}
                <Row>
                    <Col xs={12}>
                        <Label>{t("users.formEmail")}</Label>
                        <Input value={user.email} disabled={!isEditing} onChange={(evt) => onUserChange({ email: evt.target.value })} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Label>{t("users.formIsReferent")}</Label>
                    </Col>
                    <Col xs="auto">
                        <Switch
                            id="is_referent"
                            isOn={user.isReferent}
                            disabled={!isEditing}
                            handleToggle={() => onUserChange({ isReferent: !user.isReferent })}
                        />
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default UserDetailForm;
