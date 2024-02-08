import { FC, useEffect, useState } from "react";
import {
    Button,
    Col,
    Input,
    Row,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Label,
    Card,
    CardBody,
} from "reactstrap";
import HostFamiliesManager from "../../../managers/hostFamilies.manager";
import HostFamilyKindsManager from "../../../managers/hostFamilyKinds.manager";
import { MdRefresh, MdAssignment, MdAddBox, MdFilterAlt } from "react-icons/md";
import { sortBy } from "../../../utils/sort";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HOST_FAMILY_KIND_ID } from "../../../utils/constants";
import {
    BlueIcon,
    CatIcon,
    DogIcon,
    KittenFeedingIcon,
    KittenIcon,
    PuppyIcon,
    UserIcon,
    NACIcon,
} from "../../../utils/mapIcons";
import Switch from "../../components/Switch";
import UsersManager from "../../../managers/users.manager";
import Dropdown from "../../components/Dropdown";
import SortableTable from "../../components/SortableTable";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import NotificationSystem from "react-notification-system";
import HostFamily from "../../../logic/entities/HostFamily";
import HostFamilyKind from "../../../logic/entities/HostFamilyKind";
import User from "../../../logic/entities/User";
import { useHistory } from "react-router-dom";

L.Marker.prototype.options.icon = BlueIcon;

interface SwitchFilter {
    activated: boolean;
    name: string;
    check: (hostFamily: any) => boolean;
}

interface HostFamiliesPageProps {
    [key: string]: any;
}

const HostFamiliesPage: FC<HostFamiliesPageProps> = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [hostFamilies, setHostFamilies] = useState<HostFamily[]>([]);
    const [hostFamilyKinds, setHostFamilyKinds] = useState<HostFamilyKind[]>(
        []
    );
    const [filteredHostFamilies, setFilteredHostFamilies] = useState<
        HostFamily[]
    >([]);
    const [referents, setReferents] = useState<User[]>([]);
    const [searchText, setSearchText] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [userPosition, setUserPosition] = useState<any | null>(null);
    const [switchFilters, setSwitchFilters] = useState<SwitchFilter[]>([
        {
            activated: false,
            name: "En retard de cotisation uniquement",
            check: function (hostFamily) {
                return hostFamily.membership_up_to_date === 0;
            },
        },
        {
            activated: false,
            name: "Véhiculé·e uniquement",
            check: function (hostFamily) {
                return hostFamily.has_vehicule === 1;
            },
        },
    ]);
    const [filterBreak, setFilterBreak] = useState<boolean | null>(null);
    const [filterTemporary, setFilterTemporary] = useState<boolean | null>(
        null
    );
    const [filterReferent, setFilterReferent] = useState<User | null>(null);
    const [filterHostFamilyKind, setFilterHostFamilyKind] =
        useState<HostFamilyKind | null>(null);

    const history = useHistory();

    const [notificationSystem, setNotificationSystem] =
        useState<NotificationSystem | null>(null);
    const [mapRef, setMapRef] = useState<L.Map | null>(null);

    const getAllHostFamilies = () => {
        HostFamiliesManager.getAll()
            .then((hostFamilies) => {
                return sortBy(hostFamilies || [], "id");
            })
            .then(setHostFamilies)
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const getHostFamilyKinds = () => {
        setHostFamilyKinds([]);
        return HostFamilyKindsManager.getAll()
            .then(setHostFamilyKinds)
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const getReferents = () => {
        setReferents([]);
        return UsersManager.getAllReferents()
            .then(setReferents)
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    useEffect(() => {
        setIsLoading(true);
        getHostFamilyKinds()
            .then(getAllHostFamilies)
            .then(getReferents)
            .then(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        var filteredHostFamilies = hostFamilies.filter((hostFamily) => {
            var filtered =
                switchFilters.every((f) =>
                    f.activated === true ? f.check(hostFamily) === true : true
                ) &&
                hostFamily.name
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase()) &&
                (filterBreak === null
                    ? true
                    : hostFamily.on_break === filterBreak) &&
                (filterTemporary === null
                    ? true
                    : hostFamily.is_temporary === filterTemporary) &&
                (filterReferent === null
                    ? true
                    : hostFamily.referent_id === filterReferent?.id) &&
                (filterHostFamilyKind === null
                    ? true
                    : hostFamily.kinds.find(
                          (hfk) => hfk.id === filterHostFamilyKind?.id
                      ) !== undefined);
            return filtered;
        });
        setFilteredHostFamilies(filteredHostFamilies);
    }, [
        hostFamilies,
        searchText,
        switchFilters,
        filterBreak,
        filterTemporary,
        filterReferent,
        filterHostFamilyKind,
    ]);

    useEffect(() => {
        if (mapRef !== null && mapRef !== null) {
            mapRef.invalidateSize();
            mapRef.locate().on("locationfound", function (e) {
                setUserPosition(e.latlng);
            });
        }
    }, [showMap, mapRef]);

    const showDetail = (hostFamily: HostFamily) => {
        history.push(`/hostFamilies/${hostFamily.id}`);
    };

    const createHostFamily = () => {
        history.push(`/hostFamilies/new`);
    };

    const toggleMap = () => {
        setShowMap(!showMap);
    };

    const hostFamilyKindNameForId = (id: number | undefined | null) => {
        return hostFamilyKinds.find((hfk) => hfk.id === id)?.name;
    };

    const iconForHostFamilyKind = (
        host_family_kind_id: number | undefined | null
    ) => {
        if (host_family_kind_id === HOST_FAMILY_KIND_ID.CAT) {
            return CatIcon;
        } else if (host_family_kind_id === HOST_FAMILY_KIND_ID.KITTEN) {
            return KittenIcon;
        } else if (host_family_kind_id === HOST_FAMILY_KIND_ID.KITTEN_FEEDING) {
            return KittenFeedingIcon;
        } else if (host_family_kind_id === HOST_FAMILY_KIND_ID.KITTEN_AND_MOM) {
            return KittenIcon;
        } else if (host_family_kind_id === HOST_FAMILY_KIND_ID.DOG) {
            return DogIcon;
        } else if (host_family_kind_id === HOST_FAMILY_KIND_ID.PUPPY) {
            return PuppyIcon;
        } else if (
            host_family_kind_id === HOST_FAMILY_KIND_ID.RABBIT ||
            host_family_kind_id === HOST_FAMILY_KIND_ID.RAT ||
            host_family_kind_id === HOST_FAMILY_KIND_ID.HAMSTER
        ) {
            return NACIcon;
        }
        return BlueIcon;
    };

    return (
        <Page
            className="HostFamiliesPage"
            title="Liste des Familles d'Accueil"
            breadcrumbs={[
                {
                    name: "Familles d'Accueil",
                    active: true,
                } as CustomBreadcrumbItem,
            ]}
            notificationSystemCallback={(notifSystem) => {
                setNotificationSystem(notifSystem);
            }}
        >
            <Row>
                <Col>
                    <Input
                        name="hostFamily"
                        placeholder="Rechercher une Famille d'Accueil"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Col>
                <Col xs={"auto"}>
                    <Button onClick={createHostFamily} color={"success"}>
                        <MdAddBox />
                    </Button>
                    <Button className="ms-2" onClick={getAllHostFamilies}>
                        <MdRefresh />
                    </Button>
                </Col>
            </Row>
            <Card>
                <CardBody>
                    <Row>
                        <Col xs={"auto"} className="mb-0 border-end">
                            <MdFilterAlt />
                        </Col>
                        {switchFilters.map((filter) => {
                            return (
                                <Col className="mb-0">
                                    <Label>{filter.name}</Label>
                                    <br />
                                    <Switch
                                        disabled={isLoading}
                                        id={filter.name}
                                        isOn={filter.activated}
                                        handleToggle={() => {
                                            setSwitchFilters((previous) =>
                                                previous.map((f) =>
                                                    f.name === filter.name
                                                        ? {
                                                              ...f,
                                                              activated:
                                                                  !f.activated,
                                                          }
                                                        : f
                                                )
                                            );
                                        }}
                                    />
                                </Col>
                            );
                        })}
                    </Row>
                    <Row>
                        <Col className="mb-0">
                            <Label>En pause</Label>
                            <Dropdown
                                withNewLine={true}
                                color={"primary"}
                                value={filterBreak}
                                values={[1, 0, undefined]}
                                valueDisplayName={(onBreak) =>
                                    onBreak === undefined
                                        ? "Toutes"
                                        : onBreak === 1
                                        ? "En pause"
                                        : "Actives"
                                }
                                valueActiveCheck={(onBreak) =>
                                    onBreak === filterBreak
                                }
                                key={"onBreak"}
                                onChange={(newBreak) =>
                                    setFilterBreak(newBreak)
                                }
                            />
                        </Col>
                        <Col className="mb-0">
                            <Label>Tampon</Label>
                            <Dropdown
                                withNewLine={true}
                                color={"primary"}
                                value={filterTemporary}
                                values={[1, 0, undefined]}
                                valueDisplayName={(temporary) =>
                                    temporary === undefined
                                        ? "Toutes"
                                        : temporary === 1
                                        ? "Tampon"
                                        : "Non tampon"
                                }
                                valueActiveCheck={(temporary) =>
                                    temporary === filterTemporary
                                }
                                key={"temporay"}
                                onChange={(newTemporary) =>
                                    setFilterTemporary(newTemporary)
                                }
                            />
                        </Col>
                        <Col className="mb-0">
                            <Label>Référent·e</Label>
                            <Dropdown
                                withNewLine={true}
                                color={"primary"}
                                value={referents.find(
                                    (usr) => usr.id === filterReferent?.id
                                )}
                                values={[...referents, undefined]}
                                valueDisplayName={(usr) =>
                                    usr === undefined
                                        ? "-"
                                        : `${usr?.name} ${usr?.firstname}`
                                }
                                valueActiveCheck={(usr) =>
                                    usr?.id === filterReferent?.id
                                }
                                key={"referents"}
                                onChange={(newUser) =>
                                    setFilterReferent(newUser)
                                }
                            />
                        </Col>
                        <Col className="mb-0">
                            <Label>Type de FA</Label>
                            <Dropdown
                                withNewLine={true}
                                color={"primary"}
                                value={hostFamilyKinds.find(
                                    (hfk) => hfk.id === filterHostFamilyKind?.id
                                )}
                                values={[...hostFamilyKinds, undefined]}
                                valueDisplayName={(hfk) =>
                                    hfk === undefined ? "-" : hfk?.name ?? ""
                                }
                                valueActiveCheck={(hfk) =>
                                    hfk?.id === filterHostFamilyKind?.id
                                }
                                key={"hostFamilyKind"}
                                onChange={(newHFK) =>
                                    setFilterHostFamilyKind(newHFK)
                                }
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <br />

            <Row>
                <Col xs={12}>
                    <Nav tabs>
                        <NavItem className="active">
                            <NavLink disabled={!showMap} onClick={toggleMap}>
                                Liste
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink disabled={showMap} onClick={toggleMap}>
                                Carte
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={showMap ? "2" : "1"}>
                        <TabPane tabId="1">
                            <Row>
                                <Col xs={12} className="table-responsive">
                                    <SortableTable
                                        columns={[
                                            {
                                                key: "name",
                                                value: "Nom Prénom",
                                                isMain: true,
                                            },
                                            {
                                                key: "phone",
                                                value: "Téléphone",
                                                isMain: false,
                                            },
                                            {
                                                key: "mail",
                                                value: "E-mail",
                                                isMain: false,
                                            },
                                            {
                                                key: "hostFamilyDetail",
                                                value: "Fiche FA",
                                                isMain: false,
                                                sortable: false,
                                            },
                                        ]}
                                        values={filteredHostFamilies.map(
                                            (hostFamily) => {
                                                return {
                                                    name: hostFamily.displayName,
                                                    phone: hostFamily.phone,
                                                    mail: hostFamily.mail,
                                                    hostFamilyDetail: (
                                                        <Button
                                                            color="info"
                                                            onClick={() =>
                                                                showDetail(
                                                                    hostFamily
                                                                )
                                                            }
                                                        >
                                                            <MdAssignment />
                                                        </Button>
                                                    ),
                                                };
                                            }
                                        )}
                                        isLoading={isLoading}
                                    />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col xs={12}>
                                    <MapContainer
                                        whenCreated={(map) => {
                                            setMapRef(map);
                                        }}
                                        center={[47.207959, -1.549425]}
                                        zoom={12}
                                        scrollWheelZoom={false}
                                        style={{
                                            height: "400px",
                                            width: "100%",
                                        }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        {filteredHostFamilies
                                            .filter((hf) => {
                                                return (
                                                    hf.latitude !== null &&
                                                    hf.longitude !== null
                                                );
                                            })
                                            .map((hostFamily) => {
                                                var hostFamilyKind =
                                                    (hostFamily.kinds?.length ??
                                                        0) > 0
                                                        ? hostFamily.kinds[0]
                                                        : null;
                                                return (
                                                    <Marker
                                                        title={
                                                            hostFamily.displayName
                                                        }
                                                        key={hostFamily.id}
                                                        position={[
                                                            hostFamily.latitude ??
                                                                0,
                                                            hostFamily.longitude ??
                                                                0,
                                                        ]}
                                                        icon={iconForHostFamilyKind(
                                                            hostFamilyKind?.id
                                                        )}
                                                        pane="markerPane"
                                                    >
                                                        <Popup>
                                                            <div className="text-center">
                                                                {
                                                                    hostFamily.displayName
                                                                }
                                                                {hostFamilyKindNameForId(
                                                                    hostFamilyKind?.id
                                                                ) !==
                                                                    undefined && (
                                                                    <>
                                                                        <br />
                                                                        FA{" "}
                                                                        {hostFamilyKindNameForId(
                                                                            hostFamilyKind?.id
                                                                        )}
                                                                    </>
                                                                )}
                                                                <br />
                                                                <div className="pt-2">
                                                                    <Button
                                                                        title="Voir le détail"
                                                                        color="primary"
                                                                        onClick={() => {
                                                                            showDetail(
                                                                                hostFamily
                                                                            );
                                                                        }}
                                                                    >
                                                                        <MdAssignment />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                );
                                            })}
                                        {userPosition !== null && (
                                            <Marker
                                                title={"Ma position"}
                                                key={"user_position"}
                                                position={[
                                                    userPosition.lat,
                                                    userPosition.lng,
                                                ]}
                                                icon={UserIcon}
                                                interactive={false}
                                                pane="overlayPane"
                                            ></Marker>
                                        )}
                                    </MapContainer>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </Page>
    );
};
export default HostFamiliesPage;
