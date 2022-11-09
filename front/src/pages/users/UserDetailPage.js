import Page from "../../components/Page";
import React, { useEffect } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Input,
    Label,
    Row,
} from "reactstrap";
import UsersManager from "../../managers/users.manager";
import { useState } from "react";
import { MdDelete, MdOutlineModeEdit, MdRefresh, MdSave } from "react-icons/md";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

function UserDetailPage({ match, ...props }) {
    const userId = match.params.id;
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
        useState(false);

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );
    const [shouldSave, setShouldSave] = useState(false);

    const getUser = () => {
        if (user !== null) {
            setUser(null);
        }
        UsersManager.getById(userId)
            .then(setUser)
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la récupération des données",
                    level: "error",
                });
            });
    };

    const refresh = () => {
        if (userId !== "new") {
            getUser();
        } else {
            setUser(UsersManager.createUser());
            setIsEditing(true);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        if (shouldSave) {
            saveIfNeeded();
        }
    }, [shouldSave]);

    const save = () => {
        setIsEditing(false);
        setShouldSave(true);
    };

    const saveIfNeeded = () => {
        if (shouldSave === false) {
            return;
        }

        setShouldSave(false);
        if (userId === "new") {
            // Send new data to API
            UsersManager.create(user)
                .then((updatedUser) => {
                    notificationSystem.addNotification({
                        message: "Utilisateur créé",
                        level: "success",
                    });
                    props.history.push(`/users/${updatedUser.id}`);
                    setUser(updatedUser);
                })
                .catch((err) => {
                    console.error(err);
                    notificationSystem.addNotification({
                        message:
                            "Une erreur s'est produite pendant la création des données",
                        level: "error",
                    });
                });
            return;
        }

        // Send new data to API
        UsersManager.update(user)
            .then(() => {
                getUser();
                notificationSystem.addNotification({
                    message: "Utilisateur mis à jour",
                    level: "success",
                });
            })
            .catch((err) => {
                console.error(err);
                getUser();
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la mise à jour des données",
                    level: "error",
                });
            });
    };

    const deleteV = () => {
        UsersManager.delete(user)
            .then(() => {
                notificationSystem.addNotification({
                    message: "Utilisateur supprimé",
                    level: "success",
                });
                props.history.push("/users");
            })
            .catch((err) => {
                console.error(err);
                getUser();
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la suppression des données",
                    level: "error",
                });
            });
    };

    let content = <div>Chargement...</div>;
    if (user === undefined) {
        content = <div>Utilisateur non trouvé</div>;
    } else if (user === null) {
        content = <div>Chargement...</div>;
    } else {
        content = (
            <div>
                <Row className={"justify-content-end"}>
                    <Col xs={"auto"}>
                        {userId !== "new" && isEditing && (
                            <Button
                                color="danger"
                                onClick={() =>
                                    setShowDeleteConfirmationModal(true)
                                }
                            >
                                <MdDelete />
                            </Button>
                        )}
                        {!isEditing && (
                            <Button
                                className="ms-2"
                                color="primary"
                                onClick={() => setIsEditing(true)}
                            >
                                <MdOutlineModeEdit />
                            </Button>
                        )}
                        {isEditing && (
                            <Button
                                className="ms-2"
                                color="success"
                                onClick={save}
                            >
                                <MdSave />
                            </Button>
                        )}
                        <Button className="ms-2" onClick={refresh}>
                            <MdRefresh />
                        </Button>
                    </Col>
                </Row>

                <br />

                <Card>
                    <CardHeader>
                        {userId === "new" && <h2>Nouvel utilisateur</h2>}
                        {userId !== "new" && (
                            <h2>
                                {user.name} {user.firstname}
                            </h2>
                        )}
                    </CardHeader>
                    <CardBody>
                        {(userId === "new" || isEditing) && (
                            <Row>
                                <Col xs={6}>
                                    <Label>Prénom</Label>
                                    <Input
                                        value={user.firstname || ""}
                                        disabled={!isEditing}
                                        onChange={(evt) =>
                                            setUser({
                                                ...user,
                                                firstname: evt.target.value,
                                            })
                                        }
                                    />
                                </Col>
                                <Col xs={6}>
                                    <Label>Nom</Label>
                                    <Input
                                        value={user.name || ""}
                                        disabled={!isEditing}
                                        onChange={(evt) =>
                                            setUser({
                                                ...user,
                                                name: evt.target.value,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col xs={12}>
                                <Label>E-mail</Label>
                                <Input
                                    value={user.email}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setUser({
                                            ...user,
                                            email: evt.target.value,
                                        })
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
            title="Détail de l'utilisateur"
            breadcrumbs={[
                { name: "Utilisateurs", to: "/users" },
                { name: "Utilisateur", active: true },
            ]}
            notificationSystemCallback={(notifSystem) => {
                setNotificationSystem(notifSystem);
            }}
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
                bodyEntityName={"un Utilisateur"}
            />
        </Page>
    );
}
export default UserDetailPage;
