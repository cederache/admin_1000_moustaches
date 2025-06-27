import React, { FC, useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import VeterinariansManager from "../../../managers/veterinarians.manager";
import { MdRefresh, MdAssignment, MdAddBox, MdFilterAlt } from "react-icons/md";
import { sortBy } from "../../../utils/sort";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BlueIcon, GreenIcon, RedIcon, UserIcon, YellowIcon } from "../../../utils/mapIcons";
import Switch from "../../components/Switch";
import SortableTable from "../../components/SortableTable";
import Veterinarian from "../../../logic/entities/Veterinarian";
import NotificationSystem from "react-notification-system";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import { useNavigate } from "react-router-dom";
import useGetPermissions from "../../../hooks/useGetPermissions";

L.Marker.prototype.options.icon = BlueIcon;

interface VeterinariansPageProps {
    [key: string]: any;
}

interface Position {
    lat: number;
    lng: number;
}

class Filter {
    value: any;
    type: FilterType;

    constructor(value: any, type: FilterType) {
        this.value = value;
        this.type = type;
    }

    check(veterinarian: Veterinarian): boolean {
        return FilterType.check(this.type, this.value, veterinarian);
    }
}

enum FilterType {
    EMERGENCIES = "Gère les urgences",
}

namespace FilterType {
    export function check(filter: FilterType, value: any, veterinarian: Veterinarian): boolean {
        if (value === null || value === undefined) return true;
        switch (filter) {
            case FilterType.EMERGENCIES:
                return veterinarian.emergencies === value;
        }
    }
}

const VET_LIST_RESOURCE = "vet_list";

const VeterinariansPage: FC<VeterinariansPageProps> = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
    const [filteredVeterinarians, setFilteredVeterinarians] = useState<Veterinarian[]>([]);
    const [searchText, setSearchText] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [userPosition, setUserPosition] = useState<Position | null>(null);
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

    const pagePermissions = useGetPermissions(["vet_list"]);
    console.log(pagePermissions);

    const [notificationSystem, setNotificationSystem] = useState<NotificationSystem | undefined>(undefined);
    const [mapRef, setMapRef] = useState<L.Map | null>(null);

    const getAllVeterinarians = () => {
        return VeterinariansManager.getAll()
            .then((veterinarians) => {
                return sortBy(veterinarians || [], "name");
            })
            .then((veterinarians) => {
                setVeterinarians(veterinarians);
                setFilteredVeterinarians(veterinarians);
            })
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
        getAllVeterinarians().then(() => {
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        setFilteredVeterinarians(
            veterinarians.filter(
                (veterinarian) =>
                    filters.every((f) => (f.value === true ? f.check(veterinarian) === true : true)) &&
                    (veterinarian.name ?? "").toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [searchText, filters]);

    useEffect(() => {
        if (mapRef !== null && mapRef !== null) {
            mapRef.invalidateSize();
            mapRef.locate().on("locationfound", function (e) {
                setUserPosition(e.latlng);
            });
        }
    }, [mapRef, showMap]);

    useEffect(() => {
        if (mapRef !== null && mapRef !== null) {
            let latLngs = filteredVeterinarians
                .filter((vet) => vet.latitude !== null && vet.longitude !== null)
                .map((vet) => [vet.latitude, vet.longitude]) as [number, number][];
            if (latLngs.length > 0) {
                if (userPosition !== null) {
                    latLngs.push([userPosition.lat, userPosition.lng] as [number, number]);
                }
                var bounds = new L.LatLngBounds(latLngs);
                mapRef.fitBounds(bounds);
            }
        }
    }, [filteredVeterinarians, mapRef, userPosition]);

    const showDetail = (veterinarian: Veterinarian) => {
        navigate(`/veterinarians/${veterinarian.id}`);
    };

    const createVeterinarian = () => {
        navigate("/veterinarians/new");
    };

    const toggleMap = () => {
        setShowMap(!showMap);
    };

    const priceMarkerIcon = (veterinarian: Veterinarian) => {
        switch (veterinarian.priceLevel) {
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
            breadcrumbs={[
                {
                    name: "Vétérinaires",
                    active: true,
                    to: null,
                } as CustomBreadcrumbItem,
            ]}
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
                    {pagePermissions["vet_list"]?.can_create && (
                        <Button title="Créer un vétérinaire" className="ms-2" onClick={createVeterinarian} color={"success"}>
                            <MdAddBox />
                        </Button>
                    )}
                    <Button title="Rafraîchir les données" className="ms-2" onClick={getAllVeterinarians}>
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
                        {filters.map((filter) => {
                            return (
                                <Col className="mb-0">
                                    <Label>{filter.type}</Label>
                                    <Switch
                                        id={filter.type}
                                        isOn={filter.value === true}
                                        disabled={false}
                                        handleToggle={() => {
                                            setFilters((prevFilters) => {
                                                return prevFilters.map((f) => {
                                                    if (f.type === filter.type) {
                                                        return new Filter(!f.value, f.type);
                                                    }
                                                    return f;
                                                });
                                            });
                                        }}
                                    />
                                </Col>
                            );
                        })}
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
                                                value: "Nom",
                                                isMain: true,
                                            },
                                            {
                                                key: "mail",
                                                value: "E-mail",
                                                isMain: false,
                                            },
                                            {
                                                key: "phone",
                                                value: "Téléphone",
                                                isMain: false,
                                            },
                                            {
                                                key: "price",
                                                value: "Tarif",
                                            },
                                            {
                                                key: "veterinarianDetail",
                                                value: "Fiche vétérinaire",
                                                isMain: false,
                                                sortable: false,
                                            },
                                        ]}
                                        values={filteredVeterinarians.map((vet) => {
                                            return {
                                                name: vet.name,
                                                mail: vet.mail,
                                                phone: vet.phone,
                                                price: vet.priceLevelText,
                                                veterinarianDetail: (
                                                    <Button title="Voir le détail" color="info" onClick={() => showDetail(vet)}>
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
                                        ref={(map) => {
                                            if (map) {
                                                setMapRef(map);
                                            }
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
                                        {filteredVeterinarians
                                            .filter((vet) => {
                                                return vet.latitude !== null && vet.longitude !== null;
                                            })
                                            .map((veterinarian) => {
                                                return (
                                                    <Marker
                                                        title={veterinarian.name}
                                                        key={veterinarian.id}
                                                        position={[veterinarian.latitude!, veterinarian.longitude!]}
                                                        icon={priceMarkerIcon(veterinarian)}
                                                        pane="markerPane"
                                                    >
                                                        <Popup>
                                                            <div className="text-center">
                                                                {veterinarian.name}
                                                                <br />
                                                                <span title={veterinarian.priceLevelTooltip ?? ""}>{veterinarian.priceLevelText}</span>
                                                                <br />
                                                                <div className="pt-2">
                                                                    <Button
                                                                        title="Voir le détail"
                                                                        color="primary"
                                                                        onClick={() => {
                                                                            showDetail(veterinarian);
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
export default VeterinariansPage;
