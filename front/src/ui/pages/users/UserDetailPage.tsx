import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Row } from "reactstrap";
import { MdDelete, MdOutlineModeEdit, MdRefresh, MdSave } from "react-icons/md";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Switch from "../../components/Switch";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import toast from "react-hot-toast";
import User from "../../../logic/entities/User";
import { useNavigate, useParams } from "react-router-dom";
import { useLoggedUser, setLoggedUser } from "../../../hooks/useLoggedUser";
import { useUser } from "../../../hooks/users/useUser";
import { useCreateUser } from "../../../hooks/users/useCreateUser";
import { useUpdateUser } from "../../../hooks/users/useUpdateUser";
import { useDeleteUser } from "../../../hooks/users/useDeleteUser";

interface UserDetailPageProps {
    [key: string]: any;
}

const UserDetailPage: FC<UserDetailPageProps> = ({ props }) => {
    const { t } = useTranslation();
    const { id: paramUserId } = useParams();
    const userId = paramUserId ?? "new";
    const numericId = userId === "new" ? null : parseInt(userId, 10);
    const validId = numericId != null && !Number.isNaN(numericId) ? numericId : null;

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);
    const [formUser, setFormUser] = useState<User | null>(null);

    const { loggedUser } = useLoggedUser();
    const navigate = useNavigate();

    const { data: user, isPending: isUserPending, isError: isUserError, refetch: refetchUser } = useUser(validId);
    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();

    const isNewUser = userId === "new";

    // For "new" user: initialize form with empty user
    useEffect(() => {
        if (isNewUser && formUser === null) {
            setFormUser(new User(-1, "", "", "", false));
            setIsEditing(true);
        }
    }, [isNewUser]);

    // When entering edit mode for existing user, copy query data to form
    const handleStartEditing = () => {
        if (user) {
            setFormUser({ ...user });
            setIsEditing(true);
        }
    };

    const handleRefresh = () => {
        if (isNewUser) {
            setFormUser(new User(-1, "", "", "", false));
            setIsEditing(true);
        } else {
            refetchUser();
        }
    };

    const save = () => {
        const userToSave = isNewUser ? formUser : formUser ?? user;
        if (userToSave == null) return;

        setIsEditing(false);

        if (isNewUser) {
            createUserMutation.mutate(userToSave, {
                onSuccess: (updatedUser) => {
                    toast.success(t("users.message.userCreated"));
                    navigate(`/users/${updatedUser.id}`);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(`${t("common.errorCreate")}\n${err}`);
                },
            });
        } else {
            updateUserMutation.mutate(userToSave, {
                onSuccess: (updatedUser) => {
                    toast.success(t("users.message.userUpdated"));
                    if (loggedUser?.id === updatedUser.id) {
                        setLoggedUser(updatedUser);
                    }
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(`${t("common.errorUpdate")}\n${err}`);
                },
            });
        }
    };

    const deleteV = () => {
        const userToDelete = isNewUser ? formUser : user;
        if (userToDelete == null) return;

        deleteUserMutation.mutate(userToDelete, {
            onSuccess: () => {
                toast.success(t("users.message.userDeleted"));
                navigate("/users");
            },
            onError: (err) => {
                console.error(err);
                toast.error(`${t("common.errorDelete")}\n${err}`);
            },
        });
    };

    const displayUser = isNewUser ? formUser : (isEditing ? formUser : user) ?? user;

    let content = <div>{t("common.loading")}</div>;

    if (isNewUser) {
        if (formUser) {
            content = (
                <div>
                    <Row className={"justify-content-end"}>
                        <Col xs={"auto"}>
                            <Button className="ms-2" color="success" onClick={save}>
                                <MdSave />
                            </Button>
                            <Button className="ms-2" onClick={handleRefresh}>
                                <MdRefresh />
                            </Button>
                        </Col>
                    </Row>
                    <br />
                    <Card>
                        <CardHeader>
                            <h2>{t("users.newUser")}</h2>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xs={6}>
                                    <Label>{t("users.formFirstname")}</Label>
                                    <Input
                                        value={formUser.firstname || ""}
                                        disabled={!isEditing}
                                        onChange={(evt) => setFormUser({ ...formUser, firstname: evt.target.value })}
                                    />
                                </Col>
                                <Col xs={6}>
                                    <Label>{t("users.formLastname")}</Label>
                                    <Input
                                        value={formUser.name || ""}
                                        disabled={!isEditing}
                                        onChange={(evt) => setFormUser({ ...formUser, name: evt.target.value })}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <Label>{t("users.formEmail")}</Label>
                                    <Input
                                        value={formUser.email}
                                        disabled={!isEditing}
                                        onChange={(evt) => setFormUser({ ...formUser, email: evt.target.value })}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Label>{t("users.formIsReferent")}</Label>
                                </Col>
                                <Col xs={"auto"}>
                                    <Switch
                                        id={"is_referent"}
                                        isOn={formUser.isReferent}
                                        disabled={!isEditing}
                                        handleToggle={() => setFormUser({ ...formUser, isReferent: !formUser.isReferent })}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </div>
            );
        }
    } else if (isUserPending && !user) {
        content = <div>{t("common.loading")}</div>;
    } else if (isUserError || (user === undefined && !isUserPending)) {
        content = <div>{t("users.userNotFound")}</div>;
    } else if (displayUser) {
        content = (
            <div>
                <Row className={"justify-content-end"}>
                    <Col xs={"auto"}>
                        {isEditing && (
                            <Button color="danger" onClick={() => setShowDeleteConfirmationModal(true)}>
                                <MdDelete />
                            </Button>
                        )}
                        {!isEditing && (
                            <Button className="ms-2" color="primary" onClick={handleStartEditing}>
                                <MdOutlineModeEdit />
                            </Button>
                        )}
                        {isEditing && (
                            <Button className="ms-2" color="success" onClick={save}>
                                <MdSave />
                            </Button>
                        )}
                        <Button className="ms-2" onClick={handleRefresh}>
                            <MdRefresh />
                        </Button>
                    </Col>
                </Row>

                <br />

                <Card>
                    <CardHeader>
                        <h2>
                            {displayUser.firstname} {displayUser.name}
                        </h2>
                    </CardHeader>
                    <CardBody>
                        {(isEditing || isNewUser) && (
                            <Row>
                                <Col xs={6}>
                                    <Label>{t("users.formFirstname")}</Label>
                                    <Input
                                        value={displayUser.firstname || ""}
                                        disabled={!isEditing}
                                        onChange={(evt) =>
                                            setFormUser(
                                                formUser ? { ...formUser, firstname: evt.target.value } : { ...displayUser, firstname: evt.target.value }
                                            )
                                        }
                                    />
                                </Col>
                                <Col xs={6}>
                                    <Label>{t("users.formLastname")}</Label>
                                    <Input
                                        value={displayUser.name || ""}
                                        disabled={!isEditing}
                                        onChange={(evt) =>
                                            setFormUser(formUser ? { ...formUser, name: evt.target.value } : { ...displayUser, name: evt.target.value })
                                        }
                                    />
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col xs={12}>
                                <Label>{t("users.formEmail")}</Label>
                                <Input
                                    value={displayUser.email}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setFormUser(formUser ? { ...formUser, email: evt.target.value } : { ...displayUser, email: evt.target.value })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Label>{t("users.formIsReferent")}</Label>
                            </Col>
                            <Col xs={"auto"}>
                                <Switch
                                    id={"is_referent"}
                                    isOn={displayUser.isReferent}
                                    disabled={!isEditing}
                                    handleToggle={() =>
                                        setFormUser(
                                            formUser
                                                ? { ...formUser, isReferent: !formUser.isReferent }
                                                : { ...displayUser, isReferent: !displayUser.isReferent }
                                        )
                                    }
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <Page
            className="UserPage"
            title={t("users.detailTitle")}
            breadcrumbs={[
                {
                    name: t("users.breadcrumb"),
                    to: "/users",
                } as CustomBreadcrumbItem,
                {
                    name: t("users.breadcrumbDetail"),
                    active: true,
                } as CustomBreadcrumbItem,
            ]}
        >
            {content}

            <DeleteConfirmationModal
                show={showDeleteConfirmationModal}
                handleClose={(confirmed) => {
                    setShowDeleteConfirmationModal(false);
                    if (confirmed) {
                        deleteV();
                    }
                }}
                bodyEntityName={t("users.entityName")}
            />
        </Page>
    );
};
export default UserDetailPage;
