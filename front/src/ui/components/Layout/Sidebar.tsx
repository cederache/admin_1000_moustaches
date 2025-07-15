import React from "react";
import Logo1000Moustaches from "../../../assets/img/logo/Logo1000Moustaches.png";
import SourceLink from "../SourceLink";
import { MdDashboard, MdPets, MdHealthAndSafety, MdHomeFilled, MdPeople } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, NavItem, NavLink as BSNavLink } from "reactstrap";
import bn from "../../../utils/bemnames";
import { WebsiteCarbonBadge } from "react-websitecarbon-badge";
import useGetPermissions from "../../../hooks/useGetPermissions";
import { Ressource } from "../../../logic/entities/Permissions";

interface SidebarItem {
    to: string;
    name: string;
    id: string;
    exact: boolean;
    Icon: React.ComponentType<{ className?: string; size?: number }>;
    ressourceName?: Ressource;
    alt: string;
}

const navItems: SidebarItem[] = [
    {
        to: "/",
        name: "Dashboard",
        id: "dashboard",
        exact: true,
        Icon: MdDashboard,
        alt: "logo Dashboard"
    },
    {
        to: "/animals",
        name: "Animaux",
        id: "animaux",
        exact: false,
        Icon: MdPets,
        ressourceName: Ressource.PET_LIST,
        alt: "logo animaux"
    },
    {
        to: "/veterinarians",
        name: "Vétérinaires",
        id: "vet",
        exact: false,
        Icon: MdHealthAndSafety,
        ressourceName: Ressource.VET_LIST,
        alt: "logo vétérinaire"
    },
    {
        to: "/hostFamilies",
        name: "Familles d'Accueil",
        id: "FA",
        exact: false,
        Icon: MdHomeFilled,
        ressourceName: Ressource.HF_LIST,
        alt: "logo famille d'accueil"
    },
    {
        to: "/users",
        name: "Utilisateur·ice·s",
        id: "utilisateur",
        exact: false,
        Icon: MdPeople,
        ressourceName: Ressource.USER_LIST,
        alt: "logo Utilisateur·ice·s"
    },
];

const bem = bn.create("sidebar");

const Sidebar: React.FC = () => {
    const permissionsName: Ressource[] = navItems
        .map((item) => item?.ressourceName) //Récupère toutes les ressourceName de navItems et si il n'y en a pas met undefined
        .filter((name) => name !== undefined) as Ressource[]; //Filtre pour ne pas avoir dans les résultats les undefined.
    const pagePermissions = useGetPermissions(permissionsName);

    return (
        <aside className={bem.b()}>
            <div className={bem.e("background")} />
            <div className={bem.e("content")}>
                <Navbar>
                    <SourceLink className="navbar-brand justify-content-center" link="https://1000moustaches.fr">
                        <img src={Logo1000Moustaches} height="100" alt="logo de 1000 Moustaches" />
                    </SourceLink>
                </Navbar>
                <Nav vertical>
                    {navItems.map((navItem, index) => {
                        if (navItem.ressourceName === undefined || (navItem.ressourceName !== undefined && pagePermissions[navItem.ressourceName]?.can_read)) {
                            return (
                                <NavItem key={index} className={bem.e("nav-item")}>
                                    <BSNavLink
                                        id={`navItem-${navItem.id}-${index}`}
                                        className="text-uppercase"
                                        tag={NavLink}
                                        to={navItem.to}
                                        end={navItem.exact}
                                        alt={navItem.alt}
                                    >
                                        <navItem.Icon className={bem.e("nav-item-icon")} />
                                        <span>{navItem.name}</span>
                                    </BSNavLink>
                                </NavItem>
                            );
                        }
                    })}
                </Nav>
                {/* <WebsiteCarbonBadge lang="fr" url="https://admin-1000-moustaches.web.app/hostFamilies" /> */}
            </div>
        </aside>
    );
};

export default Sidebar;
