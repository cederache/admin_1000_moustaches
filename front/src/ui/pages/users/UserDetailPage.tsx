import React, { FC, useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Row } from "reactstrap";
import UsersManager from "../../../managers/users.manager";
import { MdDelete, MdOutlineModeEdit, MdRefresh, MdSave } from "react-icons/md";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Switch from "../../components/Switch";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import toast from "react-hot-toast";
import User from "../../../logic/entities/User";
import { useNavigate, useParams } from "react-router-dom";
import { useLoggedUser, setLoggedUser } from "../../../hooks/useLoggedUser";

interface UserDetailPageProps {
    [key: string]: any;
}

const UserDetailPage: FC<UserDetailPageProps> = ({ props }) => {
    let { id: paramUserId } = useParams();
    const userId = paramUserId ?? "new";
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);
    const [shouldSave, setShouldSave] = useState<boolean>(false);

    const { loggedUser } = useLoggedUser();

    const navigate = useNavigate();

    const getUser = () => {
        if (user !== null) {
            setUser(null);
        }
        let id = parseInt(userId);
        if (isNaN(id)) {
            return;
        }
        UsersManager.getById(id)
            .then(setUser)
            .catch((err) => {
                console.error(err);
                toast.error(`Une erreur s'est produite pendant la récupération des données\n${err}`);
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

        if (user === null) {
            return;
        }

        setShouldSave(false);
        if (userId === "new") {
            // Send new data to API
            UsersManager.create(user)
                .then((updatedUser) => {
                    toast.success("Utilisateur·ice créé");
                    navigate(`/users/${updatedUser.id}`);
                    setUser(updatedUser);
                })
                .catch((err) => {
                    console.error(err);
                    toast.error(`Une erreur s'est produite pendant la création des données\n${err}`);
                });
            return;
        }

        // Send new data to API
        UsersManager.update(user)
            .then(() => {
                getUser();
                toast.success("Utilisateur·ice mis à jour");

                if (parseInt(userId) === loggedUser?.id) {
                    setLoggedUser(user);
                }
            })
            .catch((err) => {
                console.error(err);
                getUser();
                toast.error(`Une erreur s'est produite pendant la mise à jour des données\n${err}`);
            });
    };

    const deleteV = () => {
        if (user === null) {
            return;
        }
        UsersManager.delete(user)
            .then(() => {
                toast.success("Utilisateur·ice supprimé");
                navigate("/users");
            })
            .catch((err) => {
                console.error(err);
                getUser();
                toast.error(`Une erreur s'est produite pendant la suppression des données\n${err}`);
            });
    };

    let content = <div>Chargement...</div>;
    if (user === undefined) {
        content = <div>Utilisateur·ice non trouvé</div>;
    } else if (user === null) {
        content = <div>Chargement...</div>;
    } else {
        content = (
            <div>
                <Row className={"justify-content-end"}>
                    <Col xs={"auto"}>
                        {userId !== "new" && isEditing && (
                            <Button color="danger" onClick={() => setShowDeleteConfirmationModal(true)}>
                                <MdDelete />
                            </Button>
                        )}
                        {!isEditing && (
                            <Button className="ms-2" color="primary" onClick={() => setIsEditing(true)}>
                                <MdOutlineModeEdit />
                            </Button>
                        )}
                        {isEditing && (
                            <Button className="ms-2" color="success" onClick={save}>
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
                                {user.firstname} {user.name}
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
                        <Row>
                            <Col>
                                <Label>Est référent·e</Label>
                            </Col>
                            <Col xs={"auto"}>
                                <Switch
                                    id={"is_referent"}
                                    isOn={user.isReferent}
                                    disabled={!isEditing}
                                    handleToggle={() => {
                                        setUser({
                                            ...user,
                                            isReferent: !user.isReferent,
                                        });
                                    }}
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
            title="Détail de l'utilisateur·ice"
            breadcrumbs={[
                {
                    name: "Utilisateur·ice·s",
                    to: "/users",
                } as CustomBreadcrumbItem,
                {
                    name: "Utilisateur·ice",
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
                bodyEntityName={"un·e Utilisateur·ice"}
            />
        </Page>
    );
};
export default UserDetailPage;
