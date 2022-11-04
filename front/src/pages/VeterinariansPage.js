import Page from "../components/Page";
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
import VeterinariansManager from "../managers/veterinarians.manager";
import { useState } from "react";
import { MdRefresh, MdAssignment, MdAddBox } from "react-icons/md";
import { sortBy } from "../utils/sort";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [30, 46],
    iconAnchor: [15, 46],
});

L.Marker.prototype.options.icon = DefaultIcon;

function VeterinariansPage({ ...props }) {
    const [veterinarians, setVeterinarians] = useState([]);
    const [filteredVeterinarians, setFilteredVeterinarians] = useState([]);
    const [searchText, setSearchText] = useState([]);
    const [showMap, setShowMap] = useState(true);

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );
    const [mapRef, setMapRef] = useState(React.createRef());

    const getAllVeterinarians = () => {
        VeterinariansManager.getAll()
            .then((veterinarians) => {
                return sortBy(veterinarians || [], "id");
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
                return veterinarian.name.includes(searchText);
            })
        );
    }, [searchText]);

    useEffect(() => {
        if (mapRef.current !== null) {
            mapRef.invalidateSize();
            mapRef.locate();
        }
    }, [showMap]);

    const showDetail = (veterinarian) => {
        console.log(
            `Should show veterinarian details for : ${veterinarian.name}`
        );
        props.history.push(`/veterinarians/${veterinarian.id}`);
    };

    const createVeterinarian = () => {
        props.history.push(`/veterinarians/new`);
    };

    const toggleMap = () => {
        setShowMap(!showMap);
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
                        className="ml-2"
                        onClick={createVeterinarian}
                        color={"success"}
                    >
                        <MdAddBox />
                    </Button>
                    <Button className="ml-2" onClick={getAllVeterinarians}>
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
                                <Col xs={12}>
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
                                                console.log(
                                                    veterinarian.name,
                                                    veterinarian.latitude,
                                                    veterinarian.longitude
                                                );
                                                return (
                                                    <Marker
                                                        key={veterinarian.id}
                                                        position={[
                                                            veterinarian.latitude,
                                                            veterinarian.longitude,
                                                        ]}
                                                        onClick={() => {
                                                            showDetail(
                                                                veterinarian
                                                            );
                                                        }}
                                                    />
                                                );
                                            })}
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
