import Avatar from "../Avatar";
import { UserCard } from "../Card";
import SearchInput from "../SearchInput";
import React from "react";
import {
    MdClearAll,
    MdExitToApp,
    MdHelp,
    MdInsertChart,
    MdMessage,
    MdPersonPin,
    MdSettingsApplications,
} from "react-icons/md";
import {
    Button,
    ListGroup,
    ListGroupItem,
    // NavbarToggler,
    Nav,
    Navbar,
    NavItem,
    NavLink,
    Popover,
    PopoverBody,
} from "reactstrap";
import bn from "../../utils/bemnames";

const bem = bn.create("header");

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
                <Nav navbar>
                    <SearchInput />
                </Nav>

                <Nav navbar className={bem.e("nav-right")}>
                    <NavItem>
                        <NavLink id="Popover2">
                            <Avatar
                                onClick={this.toggleUserCardPopover}
                                className="can-click"
                            />
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
                                    title="Jane"
                                    subtitle="jane@jane.com"
                                    text="Last updated 3 mins ago"
                                    className="border-light"
                                >
                                    <ListGroup flush>
                                        <ListGroupItem
                                            tag="button"
                                            action
                                            className="border-light"
                                        >
                                            <MdPersonPin /> Profile
                                        </ListGroupItem>
                                        <ListGroupItem
                                            tag="button"
                                            action
                                            className="border-light"
                                        >
                                            <MdInsertChart /> Stats
                                        </ListGroupItem>
                                        <ListGroupItem
                                            tag="button"
                                            action
                                            className="border-light"
                                        >
                                            <MdMessage /> Messages
                                        </ListGroupItem>
                                        <ListGroupItem
                                            tag="button"
                                            action
                                            className="border-light"
                                        >
                                            <MdSettingsApplications /> Settings
                                        </ListGroupItem>
                                        <ListGroupItem
                                            tag="button"
                                            action
                                            className="border-light"
                                        >
                                            <MdHelp /> Help
                                        </ListGroupItem>
                                        <ListGroupItem
                                            tag="button"
                                            action
                                            className="border-light"
                                        >
                                            <MdExitToApp /> Signout
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
