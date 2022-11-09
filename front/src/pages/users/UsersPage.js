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

function UsersPage({ ...props }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loggedUser, setLoggedUser] = useState(null);

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );

    const getAllUsers = () => {
        UsersManager.getAll()
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
                    message:
                        "Une erreur s'est produite pendant la récupération des données",
                    level: "error",
                });
            });
    };

    useEffect(() => {
        onAuthStateChanged(auth, (firebaseUser) => {
            setLoggedUser(firebaseUser);
        });

        getAllUsers();
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
            title="Liste des Utilisateurs"
            breadcrumbs={[{ name: "Utilisateurs", active: true }]}
            notificationSystemCallback={(notifSystem) => {
                setNotificationSystem(notifSystem);
            }}
        >
            <Row>
                <Col>
                    <Input
                        name="name"
                        placeholder="Rechercher un utilisateur"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Col>
                <Col xs={"auto"}>
                    <Button
                        title="Créer un utilisateur"
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
                            <Table {...{ striped: true }}>
                                <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Prénom</th>
                                        <th scope="col">Nom</th>
                                        <th scope="col">E-mail</th>
                                        <th scope="col">Fiche utilisateur</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <tr key={index}>
                                            <td>
                                                {loggedUser?.email ===
                                                    user.email && <FaUserAlt />}
                                            </td>
                                            <th scope="row">
                                                {user.firstname}
                                            </th>
                                            <th scope="row">{user.name}</th>
                                            <td>{user.email}</td>
                                            <td>
                                                <Button
                                                    title="Voir le détail"
                                                    color="info"
                                                    onClick={() =>
                                                        showDetail(user)
                                                    }
                                                >
                                                    <MdAssignment />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Page>
    );
}
export default UsersPage;
