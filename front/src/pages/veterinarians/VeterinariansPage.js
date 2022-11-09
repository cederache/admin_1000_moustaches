import Page from "../../components/Page";
import React, { useEffect } from "react";
import {
    Button,
    Col,
    Input,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    Table,
    TabPane,
} from "reactstrap";
import VeterinariansManager from "../../managers/veterinarians.manager";
import { useState } from "react";
import { MdRefresh, MdAssignment, MdAddBox } from "react-icons/md";
import { sortBy } from "../../utils/sort";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    BlueIcon,
    GreenIcon,
    RedIcon,
    UserIcon,
    YellowIcon,
} from "../../utils/mapIcons";

L.Marker.prototype.options.icon = BlueIcon;

function VeterinariansPage({ ...props }) {
    const [veterinarians, setVeterinarians] = useState([]);
    const [filteredVeterinarians, setFilteredVeterinarians] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [userPosition, setUserPosition] = useState(null);

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );
    const [mapRef, setMapRef] = useState(React.createRef());

    const getAllVeterinarians = () => {
        VeterinariansManager.getAll()
            .then((veterinarians) => {
                return sortBy(veterinarians || [], "name");
            })
            .then((veterinarians) => {
                setVeterinarians(veterinarians);
                setFilteredVeterinarians(veterinarians);
            })
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
                    message:
                        "Une erreur s'est produite pendant la récupération des données",
                    level: "error",
                });
            });
    };

    useEffect(() => {
        getAllVeterinarians();
    }, []);

    useEffect(() => {
        setFilteredVeterinarians(
            veterinarians.filter((veterinarian) => {
                return veterinarian.name
                    .toLowerCase()
                    .includes(searchText.toLowerCase());
            })
        );
    }, [searchText]);

    useEffect(() => {
        if (mapRef !== null && mapRef.current !== null) {
            mapRef.invalidateSize();
            mapRef.locate().on("locationfound", function (e) {
                console.log(e.latlng);
                setUserPosition(e.latlng);
            });
        }
    }, [showMap]);

    useEffect(() => {
        if (mapRef !== null && mapRef.current !== null) {
            let filteredVeterinariansWithCoordinates =
                filteredVeterinarians.filter(
                    (vet) => vet.latitude !== null && vet.longitude !== null
                );

            if (filteredVeterinariansWithCoordinates.length > 0) {
                let latLngs = filteredVeterinariansWithCoordinates.map(
                    (vet) => [vet.latitude, vet.longitude]
                );
                if (userPosition !== null) {
                    latLngs.push(userPosition);
                }
                var bounds = new L.LatLngBounds(latLngs);
                mapRef.fitBounds(bounds);
            }
        }
    }, [filteredVeterinarians, mapRef, userPosition]);

    const showDetail = (veterinarian) => {
        props.history.push(`/veterinarians/${veterinarian.id}`);
    };

    const createVeterinarian = () => {
        props.history.push(`/veterinarians/new`);
    };

    const toggleMap = () => {
        setShowMap(!showMap);
    };

    const priceMarkerIcon = (veterinarian) => {
        switch (veterinarian.price_level) {
            case 0:
                return GreenIcon;
            case 1:
                return YellowIcon;
            case 2:
                return RedIcon;
            default:
                return BlueIcon;
        }
    };

    return (
        <Page
            className="VeterinariansPage"
            title="Liste des Vétérinaires"
            breadcrumbs={[{ name: "Vétérinaires", active: true }]}
            notificationSystemCallback={(notifSystem) => {
                setNotificationSystem(notifSystem);
            }}
        >
            <Row>
                <Col>
                    <Input
                        name="name"
                        placeholder="Rechercher un vétérinaire"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Col>
                <Col xs={"auto"}>
                    <Button
                        title="Créer un vétérinaire"
                        className="ms-2"
                        onClick={createVeterinarian}
                        color={"success"}
                    >
                        <MdAddBox />
                    </Button>
                    <Button
                        title="Rafraîchir les données"
                        className="ms-2"
                        onClick={getAllVeterinarians}
                    >
                        <MdRefresh />
                    </Button>
                </Col>
            </Row>

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
                                                <th scope="col">Nom</th>
                                                <th scope="col">E-mail</th>
                                                <th scope="col">Téléphone</th>
                                                <th scope="col">
                                                    Fiche vétérinaire
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredVeterinarians.map(
                                                (vet, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            {vet.name}
                                                        </th>
                                                        <td>{vet.mail}</td>
                                                        <td>{vet.phone}</td>
                                                        <td>
                                                            <Button
                                                                title="Voir le détail"
                                                                color="info"
                                                                onClick={() =>
                                                                    showDetail(
                                                                        vet
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
                                        {filteredVeterinarians
                                            .filter((vet) => {
                                                return (
                                                    vet.latitude !== null &&
                                                    vet.longitude !== null
                                                );
                                            })
                                            .map((veterinarian) => {
                                                return (
                                                    <Marker
                                                        title={
                                                            veterinarian.name
                                                        }
                                                        key={veterinarian.id}
                                                        position={[
                                                            veterinarian.latitude,
                                                            veterinarian.longitude,
                                                        ]}
                                                        icon={priceMarkerIcon(
                                                            veterinarian
                                                        )}
                                                        pane="markerPane"
                                                    >
                                                        <Popup>
                                                            <div className="text-center">
                                                                {
                                                                    veterinarian.name
                                                                }
                                                                <br />
                                                                <span
                                                                    title={
                                                                        veterinarian.price_level_tooltip
                                                                    }
                                                                >
                                                                    {
                                                                        veterinarian.price_level_text
                                                                    }
                                                                </span>
                                                                <br />
                                                                <div className="pt-2">
                                                                    <Button
                                                                        title="Voir le détail"
                                                                        color="primary"
                                                                        onClick={() => {
                                                                            showDetail(
                                                                                veterinarian
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
export default VeterinariansPage;
