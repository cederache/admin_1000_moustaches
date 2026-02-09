import React, { useState } from "react";
import { MdClearAll, MdExitToApp } from "react-icons/md";
import { Button, ListGroup, ListGroupItem, Nav, Navbar, NavItem, NavLink, Popover, PopoverBody } from "reactstrap";
import AuthManager from "../../../managers/auth.manager";
import bn from "../../../utils/bemnames";
import { UserCard } from "../Card";
import { useLoggedUser } from "../../../hooks/useLoggedUser";

const bem = bn.create("header");

const Header: React.FC = () => {
    const { loggedUser } = useLoggedUser();
    const [isOpenUserCardPopover, setIsOpenUserCardPopover] = useState<boolean>(false);

    const logout = async (): Promise<void> => {
        await AuthManager.logout();
        window.location.href = "/login";
    };

    const toggleUserCardPopover = (): void => {
        setIsOpenUserCardPopover(!isOpenUserCardPopover);
    };

    const handleSidebarControlButton = (event: React.MouseEvent): void => {
        event.preventDefault();
        event.stopPropagation();
        document.querySelector(".cr-sidebar")?.classList.toggle("cr-sidebar--open");
    };

    return (
        <Navbar light expand className={bem.b("bg-white")}>
            <Button outline onClick={handleSidebarControlButton} >
                Menu
                <MdClearAll size={25} aria-label="logo menu burger" role="img" />
            </Button>

            <Nav navbar className={bem.e("nav-right")}>
                <NavItem>
                    <Button id="Popover2" onClick={toggleUserCardPopover}>{loggedUser?.displayName || loggedUser?.email}</Button>

                    <Popover
                        placement="bottom-end"
                        isOpen={isOpenUserCardPopover}
                        toggle={toggleUserCardPopover}
                        target="Popover2"
                        className="p-0 border-0"
                        style={{ minWidth: 250 }}
                    >
                        <PopoverBody className="p-0 border-light">
                            <UserCard title={loggedUser?.email || ""} className="border-light bg-gradient-theme-top">
                                <ListGroup flush>
                                    <ListGroupItem tag="button" action className="border-light" onClick={logout}>
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
