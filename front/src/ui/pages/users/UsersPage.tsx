import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Input, Row } from "reactstrap";
import UsersManager from "../../../managers/users.manager";
import { MdRefresh, MdAddBox, MdAssignment } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { sortBy } from "../../../utils/sort";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase-config";
import SortableTable from "../../components/SortableTable";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import toast from "react-hot-toast";
import User from "../../../logic/entities/User";
import { useNavigate } from "react-router-dom";

interface UsersPageProps {}

const UsersPage: FC<UsersPageProps> = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loggedUser, setLoggedUser] = useState<User | null>(null);

    const navigate = useNavigate();

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
                toast.error(`${t("common.errorFetch")}\n${err}`);
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
                return (user.name + " " + user.firstname).toLowerCase().includes(searchText.toLowerCase());
            })
        );
    }, [searchText]);

    const showDetail = (user: User) => {
        navigate(`/users/${user.id}`);
    };

    const createUser = () => {
        navigate(`/users/new`);
    };

    return (
        <Page
            className="UsersPage"
            title={t("users.listTitle")}
            breadcrumbs={[
                {
                    name: t("users.breadcrumb"),
                    active: true,
                } as CustomBreadcrumbItem,
            ]}
        >
            <Row>
                <Col>
                    <Input
                        name="name"
                        placeholder={t("users.searchPlaceholder")}
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Col>
                <Col xs={"auto"}>
                    <Button title={t("users.createButton")} className="ms-2" onClick={createUser} color={"success"}>
                        <MdAddBox />
                    </Button>
                    <Button title={t("common.refresh")} className="ms-2" onClick={getAllUsers}>
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
                                        value: t("users.table.nameFirstname"),
                                        isMain: true,
                                    },
                                    {
                                        key: "mail",
                                        value: t("users.table.email"),
                                        isMain: false,
                                    },
                                    {
                                        key: "userDetail",
                                        value: t("users.table.userSheet"),
                                        isMain: false,
                                        sortable: false,
                                    },
                                ]}
                                values={filteredUsers.map((user) => {
                                    return {
                                        icon: loggedUser?.email === user.email ? <FaUserAlt /> : <></>,
                                        name: `${user.firstname} ${user.name}`,
                                        mail: user.email,
                                        userDetail: (
                                            <Button title={t("common.seeDetail")} color="info" onClick={() => showDetail(user)}>
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
