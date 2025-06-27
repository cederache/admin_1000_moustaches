import React, { FC, useEffect, useState } from "react";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table,
} from "reactstrap";
import HostFamiliesManager from "../../../managers/hostFamilies.manager";
import { MdRefresh, MdAssignment, MdOutlineModeEdit, MdSave, MdDelete, MdDirections, MdThumbUp } from "react-icons/md";
import UsersManager from "../../../managers/users.manager";
import BooleanNullableDropdown from "../../components/BooleanNullableDropdown";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Geocode from "../../../utils/geocode";
import SourceLink from "../../components/SourceLink";
import HostFamilyKindsManager from "../../../managers/hostFamilyKinds.manager";
import Switch from "../../components/Switch";
import Dropdown from "../../components/Dropdown";
import NullableDropdown from "../../components/NullableDropdown";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import HostFamilyKind from "../../../logic/entities/HostFamilyKind";
import HostFamily from "../../../logic/entities/HostFamily";
import NotificationSystem from "react-notification-system";
import User from "../../../logic/entities/User";
import AnimalToHostFamily from "../../../logic/entities/AnimalToHostFamily";
import { useNavigate, useParams } from "react-router-dom";
import { RiZzzFill } from "react-icons/ri";
import useGetPermissions from "../../../hooks/useGetPermissions";

interface HostFamilyDetailPageProps {
    [key: string]: any;
}

interface AccordionHF {
    ressourceName: string;
}

const accordionsHF: AccordionHF[] = [
    {
        ressourceName: "hf_contact",
    },
    {
        ressourceName: "hf_address",
    },
    {
        ressourceName: "hf_host",
    },
    {
        ressourceName: "hf_hist_pets",
    },
];

const HostFamilyDetailPage: FC<HostFamilyDetailPageProps> = ({ props }) => {
    let { id: paramHostFamilyId } = useParams();
    const hostFamilyId = paramHostFamilyId ?? "new";
    const [hostFamily, setHostFamily] = useState<HostFamily | null>(null);
    const [hostFamilyKinds, setHostFamilyKinds] = useState<HostFamilyKind[]>([]);
    const [referents, setReferents] = useState<User[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

    const [notificationSystem, setNotificationSystem] = useState<NotificationSystem | undefined>(undefined);

    const [geocodeFound, setGeocodeFound] = useState<boolean | null>(null);
    const [previousAddress, setPreviousAddress] = useState<string | null>(null);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [shouldSave, setShouldSave] = useState(false);

    const [openContactInfo, setOpenContactInfo] = useState<string>("");
    const [openHomeInfo, setOpenHomeInfo] = useState<string>("");
    const [openHostInfo, setOpenHostInfo] = useState<string>("");

    const navigate = useNavigate();

    const permissionsName: string[] = accordionsHF.map((item) => item?.ressourceName).filter((name) => name !== undefined) as string[];
    const pagePermissions = useGetPermissions(permissionsName);

    const getHostFamily = () => {
        setHostFamily(null);
        let id = parseInt(hostFamilyId);
        if (isNaN(id)) {
            return;
        }
        return HostFamiliesManager.getById(id)
            .then((hostFamily) => setHostFamily(hostFamily))
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
            .then((hfk) =>
                setHostFamilyKinds(
                    hfk.sort((a, b) => {
                        if (a.name < b.name) return -1;
                        else if (a.name > b.name) return 1;
                        else return 0;
                    })
                )
            )
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

    const refresh = () => {
        if (hostFamilyId !== "new") {
            getHostFamily()?.then(getReferents).then(getHostFamilyKinds);
        } else {
            setOpenContactInfo("1");
            setOpenHomeInfo("1");
            setOpenHostInfo("1");

            getReferents()
                .then(getHostFamilyKinds)
                .then(() => {
                    setHostFamily(HostFamiliesManager.createHostFamily());
                    setIsEditing(true);
                });
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        if (hostFamily !== null && previousAddress !== hostFamily.address) {
            setPreviousAddress(hostFamily.address ?? null);

            if (hostFamily.address !== null && hostFamily.address !== undefined && hostFamily.address.length > 10) {
                // Geocode address
                setIsGeocoding(true);
                setGeocodeFound(null);
                Geocode.getCoordinatesFromAddress(hostFamily.address)
                    .then((coordinates) => {
                        if (coordinates !== null) {
                            hostFamily.latitude = coordinates.lat;
                            hostFamily.longitude = coordinates.lng;
                        } else {
                            console.warn("Can't get coordinates for address");
                            hostFamily.latitude = undefined;
                            hostFamily.longitude = undefined;
                        }
                        setIsGeocoding(false);
                        setGeocodeFound(true);

                        saveIfNeeded();
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsGeocoding(false);
                        setGeocodeFound(false);

                        saveIfNeeded();
                    });
            }
        }
    }, [hostFamily]);

    useEffect(() => {
        if (!isGeocoding && shouldSave) {
            saveIfNeeded();
        }
    }, [shouldSave, isGeocoding]);

    const showDetail = (animalToHostFamily: AnimalToHostFamily) => {
        navigate(`/animals/${animalToHostFamily.animal?.id}`);
    };

    const save = () => {
        if (!isGeocoding) {
            setIsEditing(false);
            setShouldSave(true);
        } else {
            setShouldSave(true);
        }
    };

    const saveIfNeeded = () => {
        if (shouldSave === false) {
            return;
        }

        if (hostFamily === null) {
            return;
        }

        setIsEditing(false);
        if (hostFamilyId === "new") {
            if (hostFamily.firstname === undefined) {
                notificationSystem?.addNotification({
                    message: "Le prénom est obligatoire",
                    level: "error",
                });
                setIsEditing(true);
                return;
            } else if (hostFamily.name === undefined) {
                notificationSystem?.addNotification({
                    message: "Le nom est obligatoire",
                    level: "error",
                });
                setIsEditing(true);
                return;
            }
            // Send new data to API
            HostFamiliesManager.create(hostFamily)
                .then((updatedHostFamily) => {
                    notificationSystem?.addNotification({
                        message: "Famille d'Accueil créée",
                        level: "success",
                    });
                    navigate(`/hostFamilies/${updatedHostFamily.id}`);
                })
                .catch((err) => {
                    console.error(err);
                    notificationSystem?.addNotification({
                        message: `Une erreur s'est produite pendant la création des données\n${err}`,
                        level: "error",
                    });
                    setIsEditing(true);
                });
            return;
        }

        // Send new data to API
        HostFamiliesManager.update(hostFamily)
            .then(() => {
                getHostFamily();
                notificationSystem?.addNotification({
                    message: "Famille d'Accueil mis à jour",
                    level: "success",
                });
            })
            .catch((err) => {
                console.error(err);
                getHostFamily();
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la mise à jour des données\n${err}`,
                    level: "error",
                });
            });
    };

    const deleteHF = () => {
        if (hostFamily === null) {
            return;
        }
        HostFamiliesManager.delete(hostFamily)
            .then(() => {
                notificationSystem?.addNotification({
                    message: "Famille d'Accueil supprimée",
                    level: "success",
                });
                navigate("/hostFamilies");
            })
            .catch((err) => {
                console.error(err);
                getHostFamily();
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la suppression des données\n${err}`,
                    level: "error",
                });
            });
    };

    const toggleContactInfo = (id: string) => {
        if (openContactInfo === id) {
            setOpenContactInfo("");
        } else {
            setOpenContactInfo(id);
        }
    };

    const toggleHomeInfo = (id: string) => {
        if (openHomeInfo === id) {
            setOpenHomeInfo("");
        } else {
            setOpenHomeInfo(id);
        }
    };

    const toggleHostInfo = (id: string) => {
        if (openHostInfo === id) {
            setOpenHostInfo("");
        } else {
            setOpenHostInfo(id);
        }
    };

    const formattedPhone = (): string | undefined => {
        let cleaned = ("" + hostFamily?.phone).replace(/\D/g, "");

        //Check if the input is of correct length
        let match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);

        if (match) {
            match.shift();
            return match.join(".");
        }
        return hostFamily?.phone;
    };

    let content = <div>Chargement...</div>;

    if (hostFamily === undefined) {
        content = <div>Famille d'Accueil non trouvé</div>;
    } else if (hostFamily === null) {
        content = <div>Chargement...</div>;
    } else {
        content = (
            <div>
                <Row className={"justify-content-end"}>
                    <Col xs={"auto"}>
                        {hostFamilyId !== "new" && isEditing && (
                            <Button color="danger" onClick={() => setShowDeleteConfirmationModal(true)}>
                                <MdDelete />
                            </Button>
                        )}
                        {!isEditing &&
                            (pagePermissions["hf_contact"].can_update ||
                                pagePermissions["hf_address"].can_update ||
                                pagePermissions["hf_host"].can_update ||
                                pagePermissions["hf_hist_pets"].can_update) && (
                                <Button className="ms-2" color="primary" onClick={() => setIsEditing(true)}>
                                    <MdOutlineModeEdit />
                                </Button>
                            )}
                        {isEditing && (
                            <Button className="ms-2" color="success" onClick={() => save()}>
                                <MdSave />
                            </Button>
                        )}
                        {hostFamilyId !== "new" && (
                            <Button className="ms-2" onClick={refresh}>
                                <MdRefresh />
                            </Button>
                        )}
                    </Col>
                </Row>

                <br />

                <Card>
                    <CardHeader>
                        <Row>
                            <Col>
                                {hostFamilyId === "new" && <h2>Nouvelle famille d'accueil</h2>}
                                {hostFamilyId !== "new" && <h2>{hostFamily.displayName}</h2>}
                            </Col>
                            <Col xs={"auto"} className="justify-content-end">
                                <Row>
                                    <Col>
                                        <Label>{"Statut"}</Label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {hostFamily.onBreak ? <RiZzzFill /> : <MdThumbUp />}
                                        <Switch
                                            id="break"
                                            key="break"
                                            isOn={!hostFamily.onBreak}
                                            disabled={!isEditing || !pagePermissions["hf_contact"].can_update}
                                            handleToggle={() => {
                                                setHostFamily({
                                                    ...hostFamily,
                                                    onBreak: !hostFamily.onBreak,
                                                });
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <Label>A jour des cotisations</Label>
                            </Col>
                            <Col xs={"auto"}>
                                <Switch
                                    id="membership"
                                    key="membership"
                                    isOn={hostFamily.membershipUpToDate}
                                    disabled={!isEditing || !pagePermissions["hf_contact"].can_update}
                                    handleToggle={() => {
                                        setHostFamily({
                                            ...hostFamily,
                                            membershipUpToDate: !hostFamily.membershipUpToDate,
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Label>Référent·e</Label>
                            </Col>
                            <Col xs={"auto"}>
                                <NullableDropdown
                                    color={"primary"}
                                    disabled={!isEditing || !pagePermissions["hf_contact"].can_update}
                                    value={referents.find((usr) => usr.id === hostFamily.referent?.id)}
                                    values={referents}
                                    valueDisplayName={(usr) => (usr === undefined ? "Aucun·e" : `${usr?.firstname} ${usr?.name}`)}
                                    valueActiveCheck={(usr) => usr.id === hostFamily.referent?.id}
                                    key={"referents"}
                                    onChange={(newUser) =>
                                        setHostFamily({
                                            ...hostFamily,
                                            referent: newUser,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Label>Est tampon</Label>
                            </Col>
                            <Col xs={"auto"}>
                                <Switch
                                    id="temporary"
                                    key="temporary"
                                    isOn={hostFamily.isTemporary}
                                    disabled={!isEditing || !pagePermissions["hf_contact"].can_update}
                                    handleToggle={() => {
                                        setHostFamily({
                                            ...hostFamily,
                                            isTemporary: !hostFamily.isTemporary,
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Permis de conduire</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={hostFamily.driverLicense ?? null}
                                    disabled={!isEditing || !pagePermissions["hf_contact"].can_update}
                                    onChange={(newValue) => {
                                        setHostFamily({
                                            ...hostFamily,
                                            driverLicense: newValue ?? undefined,
                                        });
                                    }}
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>Véhiculé·e</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={hostFamily.hasVehicule ?? null}
                                    disabled={!isEditing || !pagePermissions["hf_contact"].can_update}
                                    onChange={(newValue) => {
                                        setHostFamily({
                                            ...hostFamily,
                                            hasVehicule: newValue ?? undefined,
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Label>Situation</Label>
                                <Input
                                    type="textarea"
                                    value={hostFamily.situation || ""}
                                    disabled={!isEditing || !pagePermissions["hf_contact"].can_update}
                                    onChange={(evt) =>
                                        setHostFamily({
                                            ...hostFamily,
                                            situation: evt.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Row>
                        {pagePermissions["hf_contact"].can_read && (
                            <Accordion
                                className="pb-3"
                                open={openContactInfo}
                                // Workaround to pass the toggle function to the AccordionHeader component
                                // https://github.com/reactstrap/reactstrap/issues/2165
                                {...{
                                    toggle: toggleContactInfo,
                                }}
                            >
                                <AccordionItem>
                                    <AccordionHeader targetId="1">Information de contact</AccordionHeader>
                                    <AccordionBody accordionId="1">
                                        {hostFamilyId === "new" && isEditing && (
                                            <Row>
                                                <Col xs={6}>
                                                    <Label>Prénom</Label>
                                                    <Input
                                                        value={hostFamily.firstname || ""}
                                                        disabled={!isEditing || !pagePermissions["hf_contact"].can_update}
                                                        onChange={(evt) =>
                                                            setHostFamily({
                                                                ...hostFamily,
                                                                firstname: evt.target.value,
                                                            })
                                                        }
                                                    />
                                                </Col>
                                                <Col xs={6}>
                                                    <Label>Nom</Label>
                                                    <Input
                                                        value={hostFamily.name || ""}
                                                        disabled={!isEditing || !pagePermissions["hf_contact"].can_update}
                                                        onChange={(evt) =>
                                                            setHostFamily({
                                                                ...hostFamily,
                                                                name: evt.target.value,
                                                            })
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                        )}
                                        <Row>
                                            <Col xs={6}>
                                                <Label>Téléphone</Label>
                                                {isEditing && pagePermissions["hf_contact"].can_update && (
                                                    <Input
                                                        type="tel"
                                                        value={hostFamily.phone || ""}
                                                        disabled={false}
                                                        onChange={(evt) =>
                                                            setHostFamily({
                                                                ...hostFamily,
                                                                phone: evt.target.value,
                                                            })
                                                        }
                                                    />
                                                )}
                                                {!isEditing && <Input type="tel" value={formattedPhone()} disabled={true} />}
                                            </Col>
                                            <Col xs={6}>
                                                <Label>E-mail</Label>
                                                <Input
                                                    type="email"
                                                    value={hostFamily.mail || ""}
                                                    disabled={!isEditing || !pagePermissions["hf_contact"].can_update}
                                                    onChange={(evt) =>
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            mail: evt.target.value,
                                                        })
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={6}>
                                                <Label>Pseudo</Label>
                                                <Input
                                                    value={hostFamily.socialNetworkAlias || ""}
                                                    disabled={!isEditing || !pagePermissions["hf_contact"].can_update}
                                                    onChange={(evt) =>
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            socialNetworkAlias: evt.target.value,
                                                        })
                                                    }
                                                />
                                            </Col>
                                            <Col xs={6}>
                                                <Label>
                                                    {hostFamily.address !== undefined && (
                                                        <SourceLink link={`https://www.google.com/maps/place/${hostFamily.address}`}>
                                                            <span>
                                                                Adresse <MdDirections />
                                                            </span>
                                                        </SourceLink>
                                                    )}
                                                    {hostFamily.address === undefined && <span>Adresse</span>}
                                                </Label>
                                                <Input
                                                    type="textarea"
                                                    value={hostFamily.address}
                                                    disabled={!isEditing || !pagePermissions["hf_contact"].can_update}
                                                    onChange={(evt) =>
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            address: evt.target.value,
                                                        })
                                                    }
                                                />
                                                {geocodeFound !== null && (
                                                    <p className={geocodeFound === true ? "text-success" : "text-danger"}>
                                                        <small>{geocodeFound === true ? "Adresse valide" : "Adresse non trouvée"}</small>
                                                    </p>
                                                )}
                                            </Col>
                                        </Row>
                                    </AccordionBody>
                                </AccordionItem>
                            </Accordion>
                        )}
                        {pagePermissions["hf_address"].can_read && (
                            <Accordion
                                className="pb-3"
                                open={openHomeInfo}
                                // Workaround to pass the toggle function to the AccordionHeader component
                                // https://github.com/reactstrap/reactstrap/issues/2165
                                {...{
                                    toggle: toggleHomeInfo,
                                }}
                            >
                                <AccordionItem>
                                    <AccordionHeader targetId="1">Information sur le foyer</AccordionHeader>
                                    <AccordionBody accordionId="1">
                                        <Row>
                                            <Col xs={4}>
                                                <Label>Nombre d'enfant</Label>
                                                <Input
                                                    value={hostFamily.nbChildren?.toString() || ""}
                                                    disabled={!isEditing || !pagePermissions["hf_address"].can_update}
                                                    onChange={(evt) => {
                                                        let nbChildren: number | undefined = parseInt(evt.target.value);
                                                        if (isNaN(nbChildren)) {
                                                            nbChildren = undefined;
                                                        }
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            nbChildren: nbChildren,
                                                        });
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={8}>
                                                <Label>Informations enfant(s)</Label>
                                                <Input
                                                    type="textarea"
                                                    value={hostFamily.childrenInfos || ""}
                                                    disabled={!isEditing || !pagePermissions["hf_address"].can_update}
                                                    onChange={(evt) =>
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            childrenInfos: evt.target.value,
                                                        })
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12}>
                                                <Label>Informations animaux</Label>
                                                <Input
                                                    type="textarea"
                                                    value={hostFamily.animalsInfos || ""}
                                                    disabled={!isEditing || !pagePermissions["hf_address"].can_update}
                                                    onChange={(evt) =>
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            animalsInfos: evt.target.value,
                                                        })
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12}>
                                                <Label>Observations</Label>
                                                <Input
                                                    type="textarea"
                                                    value={hostFamily.observations || ""}
                                                    disabled={!isEditing || !pagePermissions["hf_address"].can_update}
                                                    onChange={(evt) =>
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            observations: evt.target.value,
                                                        })
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12}>
                                                <Label>Informations sur le logement</Label>
                                                <Input
                                                    type="textarea"
                                                    value={hostFamily.housingInformations || ""}
                                                    disabled={!isEditing || !pagePermissions["hf_address"].can_update}
                                                    onChange={(evt) =>
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            housingInformations: evt.target.value,
                                                        })
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </AccordionBody>
                                </AccordionItem>
                            </Accordion>
                        )}
                        {pagePermissions["hf_host"].can_read && (
                            <Accordion
                                className="pb-3"
                                open={openHostInfo}
                                // Workaround to pass the toggle function to the AccordionHeader component
                                // https://github.com/reactstrap/reactstrap/issues/2165
                                {...{
                                    toggle: toggleHostInfo,
                                }}
                            >
                                <AccordionItem>
                                    <AccordionHeader targetId="1">Information sur l'accueil</AccordionHeader>
                                    <AccordionBody accordionId="1">
                                        <Row>
                                            <Col xs={12}>
                                                <Label>Type de Famille d'Accueil</Label>
                                                <FormGroup check>
                                                    {hostFamilyKinds.map((hfk) => {
                                                        return (
                                                            <Row>
                                                                <Col>
                                                                    <Label check>
                                                                        <Input
                                                                            type="checkbox"
                                                                            id={hfk.id + ""}
                                                                            defaultChecked={
                                                                                (hostFamily.hostFamilyKinds?.filter((hfthfk) => hfthfk.id === hfk.id).length ??
                                                                                    0) > 0
                                                                            }
                                                                            onChange={(evt) => {
                                                                                if (evt.target.checked === true) {
                                                                                    // Create link
                                                                                    const index = hostFamily?.hostFamilyKinds?.indexOf(hfk, 0);
                                                                                    if (index === -1) {
                                                                                        hostFamily.hostFamilyKinds = [
                                                                                            ...(hostFamily?.hostFamilyKinds ?? []),
                                                                                            ...[hfk],
                                                                                        ];
                                                                                    }
                                                                                } else {
                                                                                    // Delete link
                                                                                    const index = hostFamily?.hostFamilyKinds?.indexOf(hfk, 0);
                                                                                    if (index !== undefined && index > -1) {
                                                                                        hostFamily.hostFamilyKinds = hostFamily?.hostFamilyKinds ?? [];
                                                                                        hostFamily?.hostFamilyKinds?.splice(index, 1);
                                                                                    }
                                                                                }
                                                                            }}
                                                                            disabled={!isEditing || !pagePermissions["hf_host"].can_update}
                                                                        />
                                                                        {hfk.name}
                                                                    </Label>
                                                                </Col>
                                                            </Row>
                                                        );
                                                    })}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={4} lg={3}>
                                                <Label>Peut donner soins véto</Label>
                                                <BooleanNullableDropdown
                                                    withNewLine={true}
                                                    value={hostFamily.canProvideVeterinaryCare ?? null}
                                                    disabled={!isEditing || !pagePermissions["hf_host"].can_update}
                                                    onChange={(newValue) => {
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            canProvideVeterinaryCare: newValue ?? undefined,
                                                        });
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={4} lg={3}>
                                                <Label>Peut sociabiliser</Label>
                                                <BooleanNullableDropdown
                                                    withNewLine={true}
                                                    value={hostFamily.canProvideSociabilisation ?? null}
                                                    disabled={!isEditing || !pagePermissions["hf_host"].can_update}
                                                    onChange={(newValue) => {
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            canProvideSociabilisation: newValue ?? undefined,
                                                        });
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={4} lg={3}>
                                                <Label>Peut accueillir des animaux handicapés</Label>
                                                <BooleanNullableDropdown
                                                    withNewLine={true}
                                                    value={hostFamily.canHostDisableAnimal ?? null}
                                                    disabled={!isEditing || !pagePermissions["hf_host"].can_update}
                                                    onChange={(newValue) => {
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            canHostDisableAnimal: newValue ?? undefined,
                                                        });
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={4} lg={3}>
                                                <Label>Peut donner des soins de nuit</Label>
                                                <BooleanNullableDropdown
                                                    withNewLine={true}
                                                    value={hostFamily.canProvideNightCare ?? null}
                                                    disabled={!isEditing || !pagePermissions["hf_host"].can_update}
                                                    onChange={(newValue) => {
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            canProvideNightCare: newValue ?? undefined,
                                                        });
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={4} lg={3}>
                                                <Label>Peut isoler</Label>
                                                <NullableDropdown
                                                    withNewLine={true}
                                                    color={
                                                        hostFamily.canIsolate === undefined ? "warning" : hostFamily.canIsolate === true ? "success" : "danger"
                                                    }
                                                    value={hostFamily.canIsolate}
                                                    values={["no", "yes_short", "yes_long"]}
                                                    valueDisplayName={(value) =>
                                                        value === null || value === undefined
                                                            ? "NSP"
                                                            : value === "yes_short"
                                                            ? "Oui, qqs jours"
                                                            : value === "yes_long"
                                                            ? "Oui, ok long terme"
                                                            : "Non"
                                                    }
                                                    valueActiveCheck={(value) => hostFamily.canIsolate === value}
                                                    key={"can_isolate"}
                                                    disabled={!isEditing || !pagePermissions["hf_host"].can_update}
                                                    onChange={(newCanIsolate) => {
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            canIsolate: newCanIsolate,
                                                        });
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12}>
                                                <Label>Conditions d'accueil (nb animaux, ...)</Label>
                                                <Input
                                                    type="textarea"
                                                    disabled={!isEditing || !pagePermissions["hf_host"].can_update}
                                                    value={hostFamily.hostConditions || ""}
                                                    onChange={(evt) => {
                                                        setHostFamily({
                                                            ...hostFamily,
                                                            hostConditions: evt.target.value,
                                                        });
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </AccordionBody>
                                </AccordionItem>
                            </Accordion>
                        )}
                    </CardBody>
                </Card>

                <br />

                {hostFamilyId !== "new" && pagePermissions["hf_hist_pets"].can_read && (
                    <Card>
                        <CardHeader>
                            <h3>Historique des animaux</h3>
                        </CardHeader>
                        <CardBody className="table-responsive">
                            <Table {...{ striped: true }}>
                                <thead>
                                    <tr>
                                        <th scope="col">Nom</th>
                                        <th scope="col">Date d'entrée</th>
                                        <th scope="col">Date de sortie</th>
                                        <th scope="col">Fiche de l'animal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hostFamily.animalToHostFamilies?.map((animalToHostFamily, index) => (
                                        <tr>
                                            <th scope="row">{animalToHostFamily.animal?.name}</th>
                                            <td>{animalToHostFamily.entryDateObject?.readable}</td>
                                            <td>{animalToHostFamily.exitDateObject?.readable}</td>
                                            <td>
                                                <Button color="info" onClick={() => showDetail(animalToHostFamily)}>
                                                    <MdAssignment />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                )}
            </div>
        );
    }

    return (
        <>
            <Page
                className="HostFamilyPage"
                title="Détail de la Famille d'Accueil"
                breadcrumbs={[
                    {
                        name: "Familles d'Accueil",
                        to: "/hostFamilies",
                    } as CustomBreadcrumbItem,
                    {
                        name: "Famille d'Accueil",
                        active: true,
                    } as CustomBreadcrumbItem,
                ]}
                notificationSystemCallback={(notifSystem) => {
                    setNotificationSystem(notifSystem);
                }}
            >
                {content}

                <DeleteConfirmationModal
                    show={showDeleteConfirmationModal}
                    handleClose={(confirmed) => {
                        setShowDeleteConfirmationModal(false);
                        if (confirmed) {
                            deleteHF();
                        }
                    }}
                    bodyEntityName={"une Famille d'Accueil"}
                />
            </Page>
        </>
    );
};
export default HostFamilyDetailPage;
