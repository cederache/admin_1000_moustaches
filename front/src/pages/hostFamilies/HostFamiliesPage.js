import Page from "../../components/Page";
import React, { useEffect } from "react";
import {
    Button,
    Col,
    Input,
    Row,
    Table,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Label,
    Card,
    CardBody,
} from "reactstrap";
import HostFamiliesManager from "../../managers/hostFamilies.manager";
import HostFamilyKindsManager from "../../managers/hostFamilyKinds.manager";
import { useState } from "react";
import { MdRefresh, MdAssignment, MdAddBox, MdFilterAlt } from "react-icons/md";
import { sortBy } from "../../utils/sort";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HOST_FAMILY_KIND_ID } from "../../utils/constants";
import {
    BlueIcon,
    CatIcon,
    DogIcon,
    KittenFeedingIcon,
    KittenIcon,
    PuppyIcon,
    RabbitIcon,
    UserIcon,
} from "../../utils/mapIcons";
import Switch from "../../components/Switch";
import UsersManager from "../../managers/users.manager";
import Dropdown from "../../components/Dropdown";

L.Marker.prototype.options.icon = BlueIcon;

function HostFamiliesPage({ ...props }) {
    const [hostFamilies, setHostFamilies] = useState([]);
    const [hostFamilyKinds, setHostFamilyKinds] = useState([]);
    const [filteredHostFamilies, setFilteredHostFamilies] = useState([]);
    const [referents, setReferents] = useState([]);
    const [searchText, setSearchText] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [userPosition, setUserPosition] = useState(null);
    const [switchFilters, setSwitchFilters] = useState([
        {
            activated: false,
            name: "En retard de cotisation",
            check: function (hostFamily) {
                return hostFamily.membership_up_to_date === 0;
            },
        },
        {
            activated: false,
            name: "En pause",
            check: function (hostFamily) {
                return hostFamily.on_break === 1;
            },
        },
    ]);
    const [filterReferent, setFilterReferent] = useState();

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );
    const [mapRef, setMapRef] = useState(React.createRef());

    const getAllHostFamilies = () => {
        HostFamiliesManager.getAll()
            .then((hostFamily) => {
                return sortBy(hostFamily || [], "id");
            })
            .then((hostFamilies) => {
                setHostFamilies(hostFamilies);
                setFilteredHostFamilies(hostFamilies);
            })
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
                    message:
                        `Une erreur s'est produite pendant la récupération des données\n${err}`,
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
                notificationSystem.addNotification({
                    message:
                        `Une erreur s'est produite pendant la récupération des données\n${err}`,
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
                notificationSystem.addNotification({
                    message:
                        `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    useEffect(() => {
        getHostFamilyKinds().then(getAllHostFamilies).then(getReferents);
    }, []);

    useEffect(() => {
        setFilteredHostFamilies(
            hostFamilies.filter((hostFamily) => {
                return (
                    switchFilters.every((f) =>
                        f.activated == true
                            ? f.check(hostFamily) === true
                            : true
                    ) &&
                    hostFamily.name.includes(searchText) &&
                    (filterReferent === undefined
                        ? true
                        : hostFamily.referent_id === filterReferent?.id)
                );
            })
        );
    }, [searchText, switchFilters, filterReferent]);

    useEffect(() => {
        if (mapRef !== null && mapRef.current !== null) {
            mapRef.invalidateSize();
            mapRef.locate().on("locationfound", function (e) {
                setUserPosition(e.latlng);
            });
        }
    }, [showMap]);

    const showDetail = (hostFamily) => {
        props.history.push(`/hostFamilies/${hostFamily.id}`);
    };

    const createHostFamily = () => {
        props.history.push(`/hostFamilies/new`);
    };

    const toggleMap = () => {
        setShowMap(!showMap);
    };

    const hostFamilyKindNameForId = (id) => {
        return hostFamilyKinds.find((hfk) => hfk.id == id)?.name;
    };

    const iconForHostFamilyKind = (host_family_kind_id) => {
        switch (host_family_kind_id) {
            case HOST_FAMILY_KIND_ID.CAT:
                return CatIcon;
            case HOST_FAMILY_KIND_ID.KITTEN:
                return KittenIcon;
            case HOST_FAMILY_KIND_ID.KITTEN_FEEDING:
                return KittenFeedingIcon;
            case HOST_FAMILY_KIND_ID.DOG:
                return DogIcon;
            case HOST_FAMILY_KIND_ID.PUPPY:
                return PuppyIcon;
            case HOST_FAMILY_KIND_ID.RABBIT:
                return RabbitIcon;
        }
        return BlueIcon;
    };

    return (
        <Page
            className="HostFamiliesPage"
            title="Liste des Familles d'Accueil"
            breadcrumbs={[{ name: "Familles d'Accueil", active: true }]}
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
                                        : `${usr?.firstname} ${usr?.name}`
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
                                    <Table {...{ striped: true }}>
                                        <thead>
                                            <tr>
                                                <th scope="col">Prénom Nom</th>
                                                <th scope="col">Téléphone</th>
                                                <th scope="col">E-mail</th>
                                                <th scope="col">Fiche FA</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredHostFamilies.map(
                                                (hostFamily, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            {
                                                                hostFamily.display_name
                                                            }
                                                        </th>
                                                        <td>
                                                            {hostFamily.phone}
                                                        </td>
                                                        <td>
                                                            {hostFamily.mail}
                                                        </td>
                                                        <td>
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
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col xs={12}>
                                    <MapContainer
                                        ref={setMapRef}
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
                                                return (
                                                    <Marker
                                                        title={
                                                            hostFamily.display_name
                                                        }
                                                        key={hostFamily.id}
                                                        position={[
                                                            hostFamily.latitude,
                                                            hostFamily.longitude,
                                                        ]}
                                                        icon={iconForHostFamilyKind(
                                                            hostFamily.main_host_family_kind_id
                                                        )}
                                                        pane="markerPane"
                                                    >
                                                        <Popup>
                                                            <div className="text-center">
                                                                {
                                                                    hostFamily.display_name
                                                                }
                                                                {hostFamilyKindNameForId(
                                                                    hostFamily.main_host_family_kind_id
                                                                ) !==
                                                                    undefined && (
                                                                    <>
                                                                        <br />
                                                                        FA{" "}
                                                                        {hostFamilyKindNameForId(
                                                                            hostFamily.main_host_family_kind_id
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
}
export default HostFamiliesPage;
