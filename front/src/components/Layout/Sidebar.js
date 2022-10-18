import Logo1000Moustaches from "../../assets/img/logo/Logo1000Moustaches.png";
import SourceLink from "../SourceLink";
import React from "react";
import {
    MdDashboard,
    MdKeyboardArrowDown,
    MdPages,
    MdPets,
    MdHealthAndSafety,
    MdHomeFilled,
} from "react-icons/md";
import { NavLink } from "react-router-dom";
import {
    // UncontrolledTooltip,
    Collapse,
    Nav,
    Navbar,
    NavItem,
    NavLink as BSNavLink,
} from "reactstrap";
import bn from "../../utils/bemnames";

const pageContents = [
    // { to: '/login', name: 'login / signup', exact: false, Icon: MdExtension },
];

const navItems = [
    { to: "/", name: "Dashboard", exact: true, Icon: MdDashboard },
    { to: "/animals", name: "Animaux", exact: false, Icon: MdPets },
    {
        to: "/veterinarians",
        name: "Vétérinaires",
        exact: false,
        Icon: MdHealthAndSafety,
    },
    {
        to: "/hostFamilies",
        name: "Familles d'Accueil",
        exact: false,
        Icon: MdHomeFilled,
    },
];

const bem = bn.create("sidebar");

class Sidebar extends React.Component {
    state = {
        isOpenComponents: true,
        isOpenContents: true,
        isOpenPages: true,
    };

    handleClick = (name) => () => {
        this.setState((prevState) => {
            const isOpen = prevState[`isOpen${name}`];

            return {
                [`isOpen${name}`]: !isOpen,
            };
        });
    };

    render() {
        return (
            <aside className={bem.b()}>
                <div className={bem.e("background")} />
                <div className={bem.e("content")}>
                    <Navbar>
                        <SourceLink className="navbar-brand d-flex">
                            <img
                                src={Logo1000Moustaches}
                                width="100%"
                                height="100"
                                alt="1000 Moustaches"
                            />
                        </SourceLink>
                    </Navbar>
                    <Nav vertical>
                        {navItems.map(({ to, name, exact, Icon }, index) => (
                            <NavItem key={index} className={bem.e("nav-item")}>
                                <BSNavLink
                                    id={`navItem-${name}-${index}`}
                                    className="text-uppercase"
                                    tag={NavLink}
                                    to={to}
                                    activeClassName="active"
                                    exact={exact}
                                >
                                    <Icon className={bem.e("nav-item-icon")} />
                                    <span className="">{name}</span>
                                </BSNavLink>
                            </NavItem>
                        ))}

                        {pageContents.length > 0 && (
                            <NavItem
                                className={bem.e("nav-item")}
                                onClick={this.handleClick("Pages")}
                            >
                                <BSNavLink
                                    className={bem.e("nav-item-collapse")}
                                >
                                    <div className="d-flex">
                                        <MdPages
                                            className={bem.e("nav-item-icon")}
                                        />
                                        <span className="">Pages</span>
                                    </div>
                                    <MdKeyboardArrowDown
                                        className={bem.e("nav-item-icon")}
                                        style={{
                                            padding: 0,
                                            transform: this.state.isOpenPages
                                                ? "rotate(0deg)"
                                                : "rotate(-90deg)",
                                            transitionDuration: "0.3s",
                                            transitionProperty: "transform",
                                        }}
                                    />
                                </BSNavLink>
                            </NavItem>
                        )}

                        {pageContents.length > 0 && (
                            <Collapse isOpen={this.state.isOpenPages}>
                                {pageContents.map(
                                    ({ to, name, exact, Icon }, index) => (
                                        <NavItem
                                            key={index}
                                            className={bem.e("nav-item")}
                                        >
                                            <BSNavLink
                                                id={`navItem-${name}-${index}`}
                                                className="text-uppercase"
                                                tag={NavLink}
                                                to={to}
                                                activeClassName="active"
                                                exact={exact}
                                            >
                                                <Icon
                                                    className={bem.e(
                                                        "nav-item-icon"
                                                    )}
                                                />
                                                <span className="">{name}</span>
                                            </BSNavLink>
                                        </NavItem>
                                    )
                                )}
                            </Collapse>
                        )}
                    </Nav>
                </div>
            </aside>
        );
    }
}

export default Sidebar;
