import React, { FC, useEffect, useState } from "react";
import { Button, Col, Input, Row } from "reactstrap";
import UsersManager from "../../managers/users.manager";
import { MdRefresh, MdAddBox, MdAssignment } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { sortBy } from "../../utils/sort";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase-config";
import SortableTable from "../../components/SortableTable";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import NotificationSystem from "react-notification-system";
import User from "../../entities/User";
import { useHistory } from "react-router-dom";

interface UsersPageProps {}

const UsersPage: FC<UsersPageProps> = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loggedUser, setLoggedUser] = useState<User | null>(null);

    const [notificationSystem, setNotificationSystem] =
        useState<NotificationSystem | null>(null);

    const history = useHistory();

    const getAllUsers = () => {
        return UsersManager.getAll()
            .then((users) => {
                return sortBy(users || [], "name");
            })
            .then((users) => {
                setUsers(users);
                setFilteredUsers(users);
            })
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    useEffect(() => {
        onAuthStateChanged(auth, (firebaseUser) => {
            // Convert Firebase User to User
            if (firebaseUser) {
                const user = new User();
                user.email = firebaseUser.email || "";
                user.name = firebaseUser.displayName || "";
                user.firstname = firebaseUser.displayName || "";
                setLoggedUser(user);
            } else {
                setLoggedUser(null);
            }
        });

        setIsLoading(true);
        getAllUsers().then(() => {
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        setFilteredUsers(
            users.filter((user) => {
                return (user.name + " " + user.firstname)
                    .toLowerCase()
                    .includes(searchText.toLowerCase());
            })
        );
    }, [searchText]);

    const showDetail = (user: User) => {
        history.push(`/users/${user.id}`);
    };

    const createUser = () => {
        history.push(`/users/new`);
    };

    return (
        <Page
            className="UsersPage"
            title="Liste des Utilisateur·ice·s"
            breadcrumbs={[
                {
                    name: "Utilisateur·ice·s",
                    active: true,
                } as CustomBreadcrumbItem,
            ]}
            notificationSystemCallback={(notifSystem) => {
                setNotificationSystem(notifSystem);
            }}
        >
            <Row>
                <Col>
                    <Input
                        name="name"
                        placeholder="Rechercher un·e utilisateur·ice"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Col>
                <Col xs={"auto"}>
                    <Button
                        title="Créer un·e utilisateur·ice"
                        className="ms-2"
                        onClick={createUser}
                        color={"success"}
                    >
                        <MdAddBox />
                    </Button>
                    <Button
                        title="Rafraîchir les données"
                        className="ms-2"
                        onClick={getAllUsers}
                    >
                        <MdRefresh />
                    </Button>
                </Col>
            </Row>

            <br />

            <Row>
                <Col xs={12}>
                    <Row>
                        <Col xs={12} className="table-responsive">
                            <SortableTable
                                columns={[
                                    { key: "icon", value: "", isMain: false },
                                    {
                                        key: "name",
                                        value: "Nom Prénom",
                                        isMain: true,
                                    },
                                    {
                                        key: "mail",
                                        value: "E-mail",
                                        isMain: false,
                                    },
                                    {
                                        key: "userDetail",
                                        value: "Fiche utilisateur·ice",
                                        isMain: false,
                                        sortable: false,
                                    },
                                ]}
                                values={filteredUsers.map((user) => {
                                    return {
                                        icon:
                                            loggedUser?.email === user.email ? (
                                                <FaUserAlt />
                                            ) : (
                                                <></>
                                            ),
                                        name: `${user.firstname} ${user.name}`,
                                        mail: user.email,
                                        userDetail: (
                                            <Button
                                                title="Voir le détail"
                                                color="info"
                                                onClick={() => showDetail(user)}
                                            >
                                                <MdAssignment />
                                            </Button>
                                        ),
                                    };
                                })}
                                isLoading={isLoading}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Page>
    );
};
export default UsersPage;
