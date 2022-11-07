import { UserCard } from "../Card";
import React, { useEffect, useState } from "react";
import { MdClearAll, MdExitToApp, MdPersonPin } from "react-icons/md";
import {
    Button,
    ListGroup,
    ListGroupItem,
    Nav,
    Navbar,
    NavItem,
    NavLink,
    Popover,
    PopoverBody,
} from "reactstrap";
import bn from "../../utils/bemnames";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const bem = bn.create("header");

const Header = ({ ...props }) => {
    let [loggedUser, setLoggedUser] = useState({});
    let [isOpenUserCardPopover, setIsOpenUserCardPopover] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        setLoggedUser(auth.currentUser || {});

        onAuthStateChanged(auth, (user) => {
            setLoggedUser(user || {});
        });
    }, []);

    let logout = () => {
        sessionStorage.removeItem("Auth Token");
        window.location = "/login";
    };

    let toggleUserCardPopover = () => {
        setIsOpenUserCardPopover(!isOpenUserCardPopover);
    };

    let handleSidebarControlButton = (event) => {
        event.preventDefault();
        event.stopPropagation();

        document
            .querySelector(".cr-sidebar")
            .classList.toggle("cr-sidebar--open");
    };

    return (
        <Navbar light expand className={bem.b("bg-white")}>
            <Nav navbar className="mr-2">
                <Button outline onClick={handleSidebarControlButton}>
                    <MdClearAll size={25} />
                </Button>
            </Nav>

            <Nav navbar className={bem.e("nav-right")}>
                <NavItem>
                    <NavLink id="Popover2">
                        <Button onClick={toggleUserCardPopover}>
                            {loggedUser.email}
                        </Button>
                    </NavLink>
                    <Popover
                        placement="bottom-end"
                        isOpen={isOpenUserCardPopover}
                        toggle={toggleUserCardPopover}
                        target="Popover2"
                        className="p-0 border-0"
                        style={{ minWidth: 250 }}
                    >
                        <PopoverBody className="p-0 border-light">
                            <UserCard
                                title={loggedUser.email}
                                className="border-light"
                            >
                                <ListGroup flush>
                                    <ListGroupItem
                                        tag="button"
                                        action
                                        className="border-light"
                                    >
                                        <MdPersonPin /> Profil
                                    </ListGroupItem>
                                    <ListGroupItem
                                        tag="button"
                                        action
                                        className="border-light"
                                        onClick={logout}
                                    >
                                        <MdExitToApp /> Déconnexion
                                    </ListGroupItem>
                                </ListGroup>
                            </UserCard>
                        </PopoverBody>
                    </Popover>
                </NavItem>
            </Nav>
        </Navbar>
    );
};

export default Header;
