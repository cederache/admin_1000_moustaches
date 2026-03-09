import React, { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { MdRefresh, MdAssignment, MdAddBox } from "react-icons/md";
import { sortBy } from "../../../utils/sort";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BlueIcon, GreenIcon, RedIcon, UserIcon, YellowIcon } from "../../../utils/mapIcons";
import SortableTable from "../../components/SortableTable";
import Veterinarian from "../../../logic/entities/Veterinarian";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import { useNavigate } from "react-router-dom";
import useGetPermissions from "../../../api/hooks/useGetPermissions";
import { Ressource } from "../../../logic/entities/Permissions";
import { useVeterinarians } from "../../../api/hooks/veterinarians/useVeterinarians";
import VeterinariansPageFilters, { Filter, FilterType } from "./VeterinariansPageFilters";

L.Marker.prototype.options.icon = BlueIcon;

interface VeterinariansPageProps {
    [key: string]: any;
}

interface Position {
    lat: number;
    lng: number;
}

const VeterinariansPage: FC<VeterinariansPageProps> = ({ ...props }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const pagePermissions = useGetPermissions([Ressource.VET_LIST]);

    const { data: veterinariansData, isPending: isVeterinariansPending, isError: isVeterinariansError, refetch: refetchVeterinarians } = useVeterinarians();

    const veterinarians = useMemo(() => (veterinariansData ? sortBy([...veterinariansData], "name") : []), [veterinariansData]);

    const [searchText, setSearchText] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [userPosition, setUserPosition] = useState<Position | null>(null);
    const [filters, setFilters] = useState<Filter[]>(
        Object.values(FilterType)
            .map((ft) => {
                if (typeof ft !== "string") return null;
                const filterType = ft as FilterType;
                return new Filter(null, filterType);
            })
            .filter((f): f is Filter => f !== null)
    );

    const [mapRef, setMapRef] = useState<L.Map | null>(null);

    const filteredVeterinarians = useMemo(
        () =>
            veterinarians.filter(
                (veterinarian) =>
                    filters.every((f) => (f.value === true ? f.check(veterinarian) === true : true)) &&
                    (veterinarian.name ?? "").toLowerCase().includes(searchText.toLowerCase())
            ),
        [veterinarians, searchText, filters]
    );

    useEffect(() => {
        if (mapRef != null && showMap) {
            mapRef.invalidateSize();
            mapRef.locate().on("locationfound", function (e) {
                setUserPosition(e.latlng);
            });
        }
    }, [mapRef, showMap]);

    useEffect(() => {
        if (mapRef != null) {
            const latLngs = filteredVeterinarians
                .filter((vet) => vet.latitude != null && vet.longitude != null)
                .map((vet) => [vet.latitude, vet.longitude]) as [number, number][];
            if (latLngs.length > 0) {
                if (userPosition != null) {
                    latLngs.push([userPosition.lat, userPosition.lng]);
                }
                const bounds = new L.LatLngBounds(latLngs);
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
            title={t("veterinarians.listTitle")}
            breadcrumbs={[
                {
                    name: t("veterinarians.breadcrumb"),
                    active: true,
                    to: null,
                } as CustomBreadcrumbItem,
            ]}
        >
            <Row>
                <Col>
                    <Input name="name" placeholder={t("veterinarians.searchPlaceholder")} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                </Col>
                <Col xs="auto">
                    {pagePermissions[Ressource.VET_LIST]?.can_create && (
                        <Button title={t("veterinarians.createButton")} className="ms-2" onClick={createVeterinarian} color="success">
                            <MdAddBox />
                        </Button>
                    )}
                    <Button title={t("common.refresh")} className="ms-2" onClick={() => refetchVeterinarians()}>
                        <MdRefresh />
                    </Button>
                </Col>
            </Row>
            <VeterinariansPageFilters filters={filters} setFilters={setFilters} />

            <br />

            <Row>
                <Col xs={12}>
                    <Nav tabs>
                        <NavItem className="active">
                            <NavLink disabled={!showMap} onClick={toggleMap}>
                                {t("common.list")}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink disabled={showMap} onClick={toggleMap}>
                                {t("common.map")}
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={showMap ? "2" : "1"}>
                        <TabPane tabId="1">
                            <Row>
                                <Col xs={12} className="table-responsive">
                                    <SortableTable
                                        columns={[
                                            { key: "name", value: t("veterinarians.table.name"), isMain: true },
                                            { key: "mail", value: t("veterinarians.table.email"), isMain: false },
                                            { key: "phone", value: t("veterinarians.table.phone"), isMain: false },
                                            { key: "price", value: t("veterinarians.table.price") },
                                            {
                                                key: "veterinarianDetail",
                                                value: t("veterinarians.table.veterinarianSheet"),
                                                isMain: false,
                                                sortable: false,
                                            },
                                        ]}
                                        values={filteredVeterinarians.map((vet) => ({
                                            name: vet.name,
                                            mail: vet.mail,
                                            phone: vet.phone,
                                            price: vet.priceLevelText,
                                            veterinarianDetail: (
                                                <Button title={t("common.seeDetail")} color="info" onClick={() => showDetail(vet)}>
                                                    <MdAssignment />
                                                </Button>
                                            ),
                                        }))}
                                        isLoading={isVeterinariansPending}
                                    />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col xs={12}>
                                    <MapContainer
                                        ref={(map) => {
                                            if (map) setMapRef(map);
                                        }}
                                        center={[47.207959, -1.549425]}
                                        zoom={12}
                                        scrollWheelZoom={false}
                                        style={{ height: "400px", width: "100%" }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        {filteredVeterinarians
                                            .filter((vet) => vet.latitude != null && vet.longitude != null)
                                            .map((veterinarian) => (
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
                                                                <Button title={t("common.seeDetail")} color="primary" onClick={() => showDetail(veterinarian)}>
                                                                    <MdAssignment />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            ))}
                                        {userPosition != null && (
                                            <Marker
                                                title={t("common.myPosition")}
                                                key="user_position"
                                                position={[userPosition.lat, userPosition.lng]}
                                                icon={UserIcon}
                                                interactive={false}
                                                pane="overlayPane"
                                            />
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
