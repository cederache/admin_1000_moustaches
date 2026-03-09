import React from "react";
import { useTranslation } from "react-i18next";
import Logo1000Moustaches from "../../../assets/img/logo/Logo1000Moustaches.png";
import SourceLink from "../SourceLink";
import { MdDashboard, MdPets, MdHealthAndSafety, MdHomeFilled, MdPeople, MdOutlineFileOpen } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, NavItem, NavLink as BSNavLink } from "reactstrap";
import bn from "../../../utils/bemnames";
import useGetPermissions from "../../../api/hooks/useGetPermissions";
import { Ressource } from "../../../logic/entities/Permissions";

interface SidebarItem {
    to: string;
    nameKey: string;
    altKey: string;
    id: string;
    exact: boolean;
    Icon: React.ComponentType<{ className?: string; size?: number; role: string }>;
    ressourceName?: Ressource;
}

const navItems: SidebarItem[] = [
    { to: "/", nameKey: "dashboard", altKey: "altDashboard", id: "dashboard", exact: true, Icon: MdDashboard },
    { to: "/animals", nameKey: "animals", altKey: "altAnimals", id: "animaux", exact: false, Icon: MdPets, ressourceName: Ressource.PET_LIST },
    {
        to: "/veterinarians",
        nameKey: "veterinarians",
        altKey: "altVeterinarians",
        id: "vet",
        exact: false,
        Icon: MdHealthAndSafety,
        ressourceName: Ressource.VET_LIST,
    },
    { to: "/hostFamilies", nameKey: "hostFamilies", altKey: "altHostFamilies", id: "FA", exact: false, Icon: MdHomeFilled, ressourceName: Ressource.HF_LIST },
    { to: "/users", nameKey: "users", altKey: "altUsers", id: "utilisateur", exact: false, Icon: MdPeople, ressourceName: Ressource.USER_LIST },
];

const bem = bn.create("sidebar");

const Sidebar: React.FC = () => {
    const { t } = useTranslation();
    const permissionsName: Ressource[] = navItems
        .map((item) => item?.ressourceName) //Récupère toutes les ressourceName de navItems et si il n'y en a pas met undefined
        .filter((name) => name !== undefined) as Ressource[]; //Filtre pour ne pas avoir dans les résultats les undefined.
    const pagePermissions = useGetPermissions(permissionsName);

    return (
        <aside className={bem.b()}>
            <div className={bem.e("background")} />
            <div className={`${bem.e("content")} d-flex flex-column justify-content-between h-100`}>
                <div>
                    <Navbar>
                        <SourceLink className="navbar-brand justify-content-center" link="https://1000moustaches.fr">
                            <img src={Logo1000Moustaches} height="100" alt={t("layout.sidebar.logoAlt")} />
                        </SourceLink>
                    </Navbar>
                    <Nav vertical>
                        {navItems.map((navItem, index) => {
                            if (
                                navItem.ressourceName === undefined ||
                                (navItem.ressourceName !== undefined && pagePermissions[navItem.ressourceName]?.can_read)
                            ) {
                                return (
                                    <NavItem key={index} className={bem.e("nav-item")}>
                                        <BSNavLink
                                            id={`navItem-${navItem.id}-${index}`}
                                            className="text-uppercase"
                                            tag={NavLink}
                                            to={navItem.to}
                                            end={navItem.exact}
                                        >
                                            <navItem.Icon className={bem.e("nav-item-icon")} role="img" aria-label={t(`layout.sidebar.${navItem.altKey}`)} />
                                            <span>{t(`layout.sidebar.${navItem.nameKey}`)}</span>
                                        </BSNavLink>
                                    </NavItem>
                                );
                            }
                        })}
                    </Nav>
                </div>
                <Nav>
                    <NavItem>
                        <BSNavLink id="privacy-policy" tag={NavLink} to="/privacypolicy" end="false" className="text-black align-self-end">
                            <MdOutlineFileOpen className="me-2" />
                            {t("layout.sidebar.legal")}
                        </BSNavLink>
                    </NavItem>
                </Nav>
            </div>
        </aside>
    );
};

export default Sidebar;
