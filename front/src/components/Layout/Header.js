import { UserCard } from "../Card";
import React from "react";
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

const bem = bn.create("header");

const loggedUser = {
    firstname: "John",
    name: "Doe",
    email: "john.doe@mail.com",
};

class Header extends React.Component {
    state = {
        isOpenUserCardPopover: false,
    };

    toggleUserCardPopover = () => {
        this.setState({
            isOpenUserCardPopover: !this.state.isOpenUserCardPopover,
        });
    };

    handleSidebarControlButton = (event) => {
        event.preventDefault();
        event.stopPropagation();

        document
            .querySelector(".cr-sidebar")
            .classList.toggle("cr-sidebar--open");
    };

    render() {
        return (
            <Navbar light expand className={bem.b("bg-white")}>
                <Nav navbar className="mr-2">
                    <Button outline onClick={this.handleSidebarControlButton}>
                        <MdClearAll size={25} />
                    </Button>
                </Nav>

                <Nav navbar className={bem.e("nav-right")}>
                    <NavItem>
                        <NavLink id="Popover2">
                            <Button onClick={this.toggleUserCardPopover}>
                                {loggedUser.firstname} {loggedUser.name}
                            </Button>
                        </NavLink>
                        <Popover
                            placement="bottom-end"
                            isOpen={this.state.isOpenUserCardPopover}
                            toggle={this.toggleUserCardPopover}
                            target="Popover2"
                            className="p-0 border-0"
                            style={{ minWidth: 250 }}
                        >
                            <PopoverBody className="p-0 border-light">
                                <UserCard
                                    title={`${loggedUser.firstname} ${loggedUser.name}`}
                                    subtitle={loggedUser.email}
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
    }
}

export default Header;
