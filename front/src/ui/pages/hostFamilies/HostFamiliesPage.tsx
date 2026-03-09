import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Input, Row, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { MdRefresh, MdAssignment, MdAddBox, MdOutlineThumbUp } from "react-icons/md";
import { RiZzzFill } from "react-icons/ri";
import { sortBy } from "../../../utils/sort";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HOST_FAMILY_KIND_ID } from "../../../utils/constants";
import { BlueIcon, CatIcon, DogIcon, KittenFeedingIcon, KittenIcon, PuppyIcon, UserIcon, NACIcon } from "../../../utils/mapIcons";
import SortableTable from "../../components/SortableTable";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import HostFamily from "../../../logic/entities/HostFamily";
import { useNavigate, useSearchParams } from "react-router-dom";
import useGetPermissions from "../../../hooks/useGetPermissions";
import { Ressource } from "../../../logic/entities/Permissions";
import { useHostFamilies } from "../../../hooks/hostFamilies/useHostFamilies";
import { useHostFamilyKinds } from "../../../hooks/hostFamilies/useHostFamilyKinds";
import { useReferents } from "../../../hooks/users/useReferents";
import HostFamiliesPageFilters, { Filter, FilterType } from "./HostFamiliesPageFilters";

// Leaflet icon fix
L.Marker.prototype.options.icon = BlueIcon;

interface HostFamiliesPageProps {
    [key: string]: any;
}

const HostFamiliesPage: FC<HostFamiliesPageProps> = (props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const pagePermissions = useGetPermissions([Ressource.HF_LIST]);
    const mapRef = useRef<L.Map | null>(null);

    const [searchParams] = useSearchParams();
    const kinds = searchParams.getAll("kinds");
    const kindsIds = kinds != null ? kinds.map((kind) => parseInt(kind)) : undefined;
    const isAvailableStr = searchParams.get("isAvailable");
    const isAvailable = isAvailableStr == "true" ? true : isAvailableStr == "false" ? false : undefined;

    const {
        data: hostFamiliesData,
        isPending: isHostFamiliesPending,
        isError: isHostFamiliesError,
        refetch: refetchHostFamilies,
    } = useHostFamilies({
        kinds: kindsIds,
        isAvailable,
    });
    const {
        data: hostFamilyKindsData,
        isPending: isHostFamilyKindsPending,
        isError: isHostFamilyKindsError,
        refetch: refetchHostFamilyKinds,
    } = useHostFamilyKinds();
    const { data: referentsData, isPending: isReferentsPending, isError: isReferentsError, refetch: refetchReferents } = useReferents();

    const hostFamilies = useMemo(() => (hostFamiliesData ? sortBy([...hostFamiliesData], "id") : []), [hostFamiliesData]);
    const hostFamilyKinds = useMemo(() => (hostFamilyKindsData ? sortBy([...hostFamilyKindsData], "name") : []), [hostFamilyKindsData]);
    const referents = useMemo(() => (referentsData ? sortBy([...referentsData], "displayName") : []), [referentsData]);

    const isLoading = isHostFamiliesPending || isHostFamilyKindsPending || isReferentsPending;

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

    const filteredHostFamiliesList = useMemo(() => hostFamilies.filter((hf) => filters.every((f) => f.check(hf))), [hostFamilies, filters]);

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

    const refetchAll = () => {
        refetchHostFamilies();
        refetchHostFamilyKinds();
        refetchReferents();
    };

    const hostFamilyKindNameForId = (id: number | undefined | null) => {
        return hostFamilyKinds.find((hfk) => hfk.id === id)?.name;
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

    return (
        <Page
            className="HostFamiliesPage"
            title={t("hostFamilies.listTitle")}
            breadcrumbs={[
                {
                    name: t("hostFamilies.breadcrumbList"),
                    active: true,
                } as CustomBreadcrumbItem,
            ]}
        >
            <Row>
                <Col>
                    <Input
                        name="hostFamily"
                        placeholder={t("hostFamilies.searchPlaceholder")}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Col>
                <Col xs={"auto"}>
                    {pagePermissions[Ressource.HF_LIST]?.can_create && (
                        <Button onClick={createHostFamily} color={"success"}>
                            <MdAddBox />
                        </Button>
                    )}
                    <Button className="ms-2" onClick={refetchAll}>
                        <MdRefresh />
                    </Button>
                </Col>
            </Row>
            <HostFamiliesPageFilters
                filters={filters}
                setFilters={setFilters}
                hostFamilyKinds={hostFamilyKinds}
                referents={referents}
                isLoading={isLoading}
            />

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
                                            {
                                                key: "status",
                                                value: t("hostFamilies.table.status"),
                                                isMain: false,
                                            },
                                            {
                                                key: "name",
                                                value: t("hostFamilies.table.nameFirstname"),
                                                isMain: true,
                                            },
                                            {
                                                key: "phone",
                                                value: t("hostFamilies.table.phone"),
                                                isMain: false,
                                            },
                                            {
                                                key: "situation",
                                                value: t("hostFamilies.table.situation"),
                                                isMain: false,
                                            },
                                            {
                                                key: "hostFamilyDetail",
                                                value: t("hostFamilies.table.hostFamilySheet"),
                                                isMain: false,
                                                sortable: false,
                                            },
                                        ]}
                                        values={filteredHostFamiliesList.map((hostFamily) => ({
                                            status: hostFamily.onBreak ? <RiZzzFill /> : <MdOutlineThumbUp />,
                                            name: hostFamily.displayName,
                                            phone: hostFamily.phone,
                                            situation: hostFamily.situation,
                                            hostFamilyDetail: (
                                                <Button color="info" onClick={() => showDetail(hostFamily)}>
                                                    <MdAssignment />
                                                </Button>
                                            ),
                                        }))}
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
                                        {filteredHostFamiliesList
                                            .filter((hf) => hf.latitude !== null && hf.longitude !== null)
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
                                                                        title={t("common.seeDetail")}
                                                                        color="primary"
                                                                        onClick={() => showDetail(hostFamily)}
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
                                                title={t("common.myPosition")}
                                                key={"user_position"}
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
export default HostFamiliesPage;
