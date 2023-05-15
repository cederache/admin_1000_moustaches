import Page from "../../components/Page";
import React, { useEffect } from "react";
import { Button, Col, Input, Row, Table } from "reactstrap";
import UsersManager from "../../managers/users.manager";
import { useState } from "react";
import { MdRefresh, MdAddBox, MdAssignment } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { sortBy } from "../../utils/sort";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase-config";
import SortableTable from "../../components/SortableTable";
import { map } from "leaflet";

function UsersPage({ ...props }) {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loggedUser, setLoggedUser] = useState(null);

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );

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
                notificationSystem.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    useEffect(() => {
        onAuthStateChanged(auth, (firebaseUser) => {
            setLoggedUser(firebaseUser);
        });

        setIsLoading(true);
        getAllUsers().then(() => {
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        setFilteredUsers(
            users.filter((user) => {
                return user.name
                    .toLowerCase()
                    .includes(searchText.toLowerCase());
            })
        );
    }, [searchText]);

    const showDetail = (user) => {
        props.history.push(`/users/${user.id}`);
    };

    const createUser = () => {
        props.history.push(`/users/new`);
    };

    return (
        <Page
            className="UsersPage"
            title="Liste des Utilisateur·ice·s"
            breadcrumbs={[{ name: "Utilisateur·ice·s", active: true }]}
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
                                        value: "Nom Préom",
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
}
export default UsersPage;
