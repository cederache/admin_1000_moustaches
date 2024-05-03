import React, { useEffect, useState } from "react";
import { MdClearAll, MdExitToApp } from "react-icons/md";
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
import UsersManager from "../../../managers/users.manager";
import bn from "../../../utils/bemnames";
import { UserCard } from "../Card";

const bem = bn.create("header");

const Header = ({ ...props }) => {
    let [loggedUser, setLoggedUser] = useState({});
    let [isOpenUserCardPopover, setIsOpenUserCardPopover] = useState(false);

    useEffect(() => {
        UsersManager.getLoggedUser().then(setLoggedUser);
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
                            {loggedUser?.firstname} {loggedUser?.name}
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
                                title={loggedUser?.email}
                                className="border-light bg-gradient-theme-top"
                            >
                                <ListGroup flush>
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
