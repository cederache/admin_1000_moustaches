import { FC, useEffect, useRef, useState } from "react";
import { Button, Col, Input, Row, Nav, NavItem, NavLink, TabContent, TabPane, Label, Card, CardBody } from "reactstrap";
import HostFamiliesManager from "../../../managers/hostFamilies.manager";
import HostFamilyKindsManager from "../../../managers/hostFamilyKinds.manager";
import { MdRefresh, MdAssignment, MdAddBox, MdFilterAlt, MdOutlineThumbUp } from "react-icons/md";
import { RiZzzFill } from "react-icons/ri";
import { sortBy } from "../../../utils/sort";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HOST_FAMILY_KIND_ID } from "../../../utils/constants";
import { BlueIcon, CatIcon, DogIcon, KittenFeedingIcon, KittenIcon, PuppyIcon, UserIcon, NACIcon } from "../../../utils/mapIcons";
import Switch from "../../components/Switch";
import UsersManager from "../../../managers/users.manager";
import Dropdown from "../../components/Dropdown";
import SortableTable from "../../components/SortableTable";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import NotificationSystem from "react-notification-system";
import HostFamily from "../../../logic/entities/HostFamily";
import HostFamilyKind from "../../../logic/entities/HostFamilyKind";
import User from "../../../logic/entities/User";
import { useNavigate, useSearchParams } from "react-router-dom";

L.Marker.prototype.options.icon = BlueIcon;

interface SwitchFilter {
    activated: boolean;
    name: string;
    check: (hostFamily: any) => boolean;
}

interface HostFamiliesPageProps {
    [key: string]: any;
}

class Filter {
    value: any;
    type: FilterType;

    constructor(value: any, type: FilterType) {
        this.value = value;
        this.type = type;
    }

    check(hostFamily: HostFamily): boolean {
        return FilterType.check(this.type, this.value, hostFamily);
    }
}

enum FilterType {
    MEMBERSHIP_LATE = "En retard de cotisation uniquement",
    HAS_A_VEHICULE = "Véhiculé·e uniquement",
    ON_A_BREAK = "Statut",
    TEMPORARY = "Tampon",
    REFERENT = "Référent·e",
    TYPE = "Type de FA",
}

namespace FilterType {
    export function isSwitch(filter: FilterType): boolean {
        switch (filter) {
            case FilterType.MEMBERSHIP_LATE:
            case FilterType.HAS_A_VEHICULE:
                return true;
            default:
                return false;
        }
    }

    export function check(filter: FilterType, value: any, hostFamily: HostFamily): boolean {
        if (value === null || value === undefined) return true;
        switch (filter) {
            case FilterType.MEMBERSHIP_LATE:
                return value === true ? hostFamily.membershipUpToDate === false : true;
            case FilterType.HAS_A_VEHICULE:
                return value === true ? hostFamily.hasVehicule === value : true;
            case FilterType.ON_A_BREAK:
                return hostFamily.onBreak === value;
            case FilterType.TEMPORARY:
                return hostFamily.isTemporary === value;
            case FilterType.REFERENT:
                return hostFamily.referent?.id === value;
            case FilterType.TYPE:
                return hostFamily.hostFamilyKinds?.map((hfk) => hfk.id).includes(value) ?? false;
        }
    }
}

class HostFamiliesPageData {
    hostFamilies: HostFamily[];
    hostFamilyKinds: HostFamilyKind[];
    referents: User[];

    constructor() {
        this.hostFamilies = [];
        this.hostFamilyKinds = [];
        this.referents = [];
    }
}

const HostFamiliesPage: FC<HostFamiliesPageProps> = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<HostFamiliesPageData>(new HostFamiliesPageData());

    const [filteredHostFamilies, setFilteredHostFamilies] = useState<HostFamily[]>([]);
    const [searchText, setSearchText] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [userPosition, setUserPosition] = useState<any | null>(null);
    const [filters, setFilters] = useState<Filter[]>(
        Object.values(FilterType)
            .map((ft) => {
                if (typeof ft !== "string") return null;
                var filterType = ft as FilterType;
                return new Filter(null, filterType);
            })
            .filter((f) => f !== null) as Filter[]
    );

    const navigate = useNavigate();

    const [notificationSystem, setNotificationSystem] = useState<NotificationSystem | undefined>(undefined);
    const mapRef = useRef<L.Map | null>(null);

    const [searchParams] = useSearchParams();
    const kinds = searchParams.getAll("kinds");
    const kindsIds = kinds != null ? kinds.map((kind) => parseInt(kind)) : undefined;
    const isAvailableStr = searchParams.get("isAvailable");
    const isAvailable = isAvailableStr == "true" ? true : isAvailableStr == "false" ? false : undefined;

    const getAllHostFamilies = () => {
        return HostFamiliesManager.getAll({ kinds: kindsIds, isAvailable })
            .then((hostFamilies) => {
                return sortBy(hostFamilies || [], "id") as HostFamily[];
            })
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
                return [] as HostFamily[];
            });
    };

    const getHostFamilyKinds = () => {
        return HostFamilyKindsManager.getAll()
            .then((hostFamilyKinds) => {
                return sortBy(hostFamilyKinds || [], "name");
            })
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
                return [] as HostFamilyKind[];
            });
    };

    const getReferents = () => {
        return UsersManager.getAllReferents()
            .then((referents) => {
                return sortBy(referents || [], "displayName");
            })
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
                return [] as User[];
            });
    };

    useEffect(() => {
        setIsLoading(true);
        Promise.all([getHostFamilyKinds(), getAllHostFamilies(), getReferents()]).then(([hostFamilyKinds, hostFamilies, referents]) => {
            setData({
                hostFamilies,
                hostFamilyKinds,
                referents,
            });
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        setFilteredHostFamilies(data.hostFamilies.filter((hf) => filters.every((f) => f.check(hf))));
    }, [data, searchText, filters]);

    useEffect(() => {
        const map = mapRef.current;
        if (showMap && map) {
            map.invalidateSize();
            map.locate().on("locationfound", function (e) {
                setUserPosition(e.latlng);
            });
        }
    }, [showMap, mapRef]);

    const showDetail = (hostFamily: HostFamily) => {
        navigate(`/hostFamilies/${hostFamily.id}`);
    };

    const createHostFamily = () => {
        navigate(`/hostFamilies/new`);
    };

    const toggleMap = () => {
        setShowMap(!showMap);
    };

    const hostFamilyKindNameForId = (id: number | undefined | null) => {
        return data.hostFamilyKinds.find((hfk) => hfk.id === id)?.name;
    };

    const iconForHostFamilyKind = (host_family_kind_id: number | undefined | null) => {
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

    const filterBody = (filter: Filter) => {
        switch (filter.type) {
            case FilterType.HAS_A_VEHICULE:
            case FilterType.MEMBERSHIP_LATE:
                return (
                    <Col key={filter.type} className="mb-0">
                        <Label>{filter.type}</Label>
                        <br />
                        <Switch
                            disabled={isLoading}
                            id={filter.type}
                            isOn={filter.value}
                            handleToggle={() => {
                                setFilters((previous) => previous.map((f) => (f.type === filter.type ? new Filter(!f.value, f.type) : f)));
                            }}
                        />
                    </Col>
                );
            case FilterType.ON_A_BREAK:
                return (
                    <Col key={filter.type} className="mb-0">
                        <Label>Statut</Label>
                        <Dropdown
                            withNewLine={true}
                            color={"primary"}
                            value={filter.value}
                            values={[true, false, null]}
                            valueDisplayName={(onBreak: boolean | null) => (onBreak === null ? "Toutes" : onBreak === true ? "En pause" : "Actives")}
                            valueActiveCheck={(onBreak: boolean | null) => onBreak === filter.value}
                            key={"onBreak"}
                            onChange={(newBreak) => setFilters((previous) => previous.map((f) => (f.type === filter.type ? new Filter(newBreak, f.type) : f)))}
                        />
                    </Col>
                );
            case FilterType.REFERENT:
                return (
                    <Col key={filter.type} className="mb-0">
                        <Label>Référent·e</Label>
                        <Dropdown
                            withNewLine={true}
                            color={"primary"}
                            value={data.referents.find((usr) => usr.id === filter.value)}
                            values={[...data.referents, undefined]}
                            valueDisplayName={(usr) => (usr === undefined ? "-" : `${usr?.name} ${usr?.firstname}`)}
                            valueActiveCheck={(usr) => usr?.id === filter.value}
                            key={"referents"}
                            onChange={(newUser) =>
                                setFilters((previous) => previous.map((f) => (f.type === filter.type ? new Filter(newUser?.id, f.type) : f)))
                            }
                        />
                    </Col>
                );
            case FilterType.TYPE:
                return (
                    <Col key={filter.type} className="mb-0">
                        <Label>Type de FA</Label>
                        <Dropdown
                            withNewLine={true}
                            color={"primary"}
                            value={data.hostFamilyKinds.find((hfk) => hfk.id === filter.value)}
                            values={[...data.hostFamilyKinds, null]}
                            valueDisplayName={(hfk) => (hfk === null ? "-" : hfk?.name ?? "")}
                            valueActiveCheck={(hfk) => hfk?.id === filter.value}
                            key={"hostFamilyKind"}
                            onChange={(newHFK) => setFilters((previous) => previous.map((f) => (f.type === filter.type ? new Filter(newHFK?.id, f.type) : f)))}
                        />
                    </Col>
                );
            case FilterType.TEMPORARY:
                return (
                    <Col key={filter.type} className="mb-0">
                        <Label>Tampon</Label>
                        <Dropdown
                            withNewLine={true}
                            color={"primary"}
                            value={filter.value}
                            values={[true, false, null]}
                            valueDisplayName={(temporary) => (temporary === null ? "Toutes" : temporary === true ? "Tampon" : "Non tampon")}
                            valueActiveCheck={(temporary) => temporary === filter.value}
                            key={"temporay"}
                            onChange={(newTemporary) =>
                                setFilters((previous) => previous.map((f) => (f.type === filter.type ? new Filter(newTemporary, f.type) : f)))
                            }
                        />
                    </Col>
                );
        }
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
                        <Col>
                            <Row>{filters.filter((f) => FilterType.isSwitch(f.type)).map((filter) => filterBody(filter))}</Row>
                            <Row>{filters.filter((f) => !FilterType.isSwitch(f.type)).map((filter) => filterBody(filter))}</Row>
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
                                                key: "status",
                                                value: "Statut",
                                                isMain: false,
                                            },
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
                                                key: "situation",
                                                value: "Situation",
                                                isMain: false,
                                            },
                                            {
                                                key: "hostFamilyDetail",
                                                value: "Fiche FA",
                                                isMain: false,
                                                sortable: false,
                                            },
                                        ]}
                                        values={filteredHostFamilies.map((hostFamily) => {
                                            return {
                                                status: hostFamily.onBreak ? <RiZzzFill /> : <MdOutlineThumbUp />,
                                                name: hostFamily.displayName,
                                                phone: hostFamily.phone,
                                                situation: hostFamily.situation,
                                                hostFamilyDetail: (
                                                    <Button color="info" onClick={() => showDetail(hostFamily)}>
                                                        <MdAssignment />
                                                    </Button>
                                                ),
                                            };
                                        })}
                                        isLoading={isLoading}
                                    />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col xs={12}>
                                    <MapContainer
                                        ref={mapRef}
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
                                                return hf.latitude !== null && hf.longitude !== null;
                                            })
                                            .map((hostFamily) => {
                                                var hostFamilyKind = (hostFamily.hostFamilyKinds?.length ?? 0) > 0 ? hostFamily.hostFamilyKinds![0] : null;
                                                return (
                                                    <Marker
                                                        title={hostFamily.displayName}
                                                        key={hostFamily.id}
                                                        position={[hostFamily.latitude ?? 0, hostFamily.longitude ?? 0]}
                                                        icon={iconForHostFamilyKind(hostFamilyKind?.id)}
                                                        pane="markerPane"
                                                    >
                                                        <Popup>
                                                            <div className="text-center">
                                                                {hostFamily.displayName}
                                                                {hostFamilyKindNameForId(hostFamilyKind?.id) !== undefined && (
                                                                    <>
                                                                        <br />
                                                                        FA {hostFamilyKindNameForId(hostFamilyKind?.id)}
                                                                    </>
                                                                )}
                                                                <br />
                                                                <div className="pt-2">
                                                                    <Button
                                                                        title="Voir le détail"
                                                                        color="primary"
                                                                        onClick={() => {
                                                                            showDetail(hostFamily);
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
                                                position={[userPosition.lat, userPosition.lng]}
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
