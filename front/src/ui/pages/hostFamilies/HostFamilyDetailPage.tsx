import React, { FC, useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import HostFamiliesManager from "../../../managers/hostFamilies.manager";
import Geocode from "../../../utils/geocode";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import HostFamilyKindsManager from "../../../managers/hostFamilyKinds.manager";
import UsersManager from "../../../managers/users.manager";
import HostFamilyKind from "../../../logic/entities/HostFamilyKind";
import HostFamily from "../../../logic/entities/HostFamily";
import User from "../../../logic/entities/User";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useGetPermissions from "../../../hooks/useGetPermissions";
import { Ressource } from "../../../logic/entities/Permissions";
import HostFamilyDetailPageActions from "./HostFamilyDetailPageActions";
import HostFamilyDetailHeader from "./HostFamilyDetailHeader";
import HostFamilyDetailSummary from "./HostFamilyDetailSummary";
import HostFamilyContactAccordion from "./HostFamilyContactAccordion";
import HostFamilyHomeAccordion from "./HostFamilyHomeAccordion";
import HostFamilyHostAccordion from "./HostFamilyHostAccordion";
import HostFamilyAnimalsHistory from "./HostFamilyAnimalsHistory";

interface HostFamilyDetailPageProps {
    [key: string]: any;
}

const permissionsName: Ressource[] = [
    Ressource.HF_CONTACT,
    Ressource.HF_ADDRESS,
    Ressource.HF_HOST,
    Ressource.HF_HIST_PETS,
];

const HostFamilyDetailPage: FC<HostFamilyDetailPageProps> = () => {
    const { id: paramHostFamilyId } = useParams();
    const hostFamilyId = paramHostFamilyId ?? "new";
    const [hostFamily, setHostFamily] = useState<HostFamily | null>(null);
    const [hostFamilyKinds, setHostFamilyKinds] = useState<HostFamilyKind[]>([]);
    const [referents, setReferents] = useState<User[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

    const [geocodeFound, setGeocodeFound] = useState<boolean | null>(null);
    const [previousAddress, setPreviousAddress] = useState<string | null>(null);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [shouldSave, setShouldSave] = useState(false);

    const [openContactInfo, setOpenContactInfo] = useState<string>("");
    const [openHomeInfo, setOpenHomeInfo] = useState<string>("");
    const [openHostInfo, setOpenHostInfo] = useState<string>("");

    const navigate = useNavigate();
    const pagePermissions = useGetPermissions(permissionsName);

    const onHostFamilyChange = (updates: Partial<HostFamily>) => {
        if (hostFamily) {
            setHostFamily({ ...hostFamily, ...updates });
        }
    };

    const getHostFamily = () => {
        setHostFamily(null);
        const id = parseInt(hostFamilyId, 10);
        if (isNaN(id)) return;
        return HostFamiliesManager.getById(id)
            .then(setHostFamily)
            .catch((err) => {
                console.error(err);
                toast.error(`Une erreur s'est produite pendant la récupération des données\n${err}`);
            });
    };

    const getHostFamilyKinds = () => {
        setHostFamilyKinds([]);
        return HostFamilyKindsManager.getAll()
            .then((hfk) =>
                setHostFamilyKinds(
                    hfk.sort((a, b) => {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                        return 0;
                    })
                )
            )
            .catch((err) => {
                console.error(err);
                toast.error(`Une erreur s'est produite pendant la récupération des données\n${err}`);
            });
    };

    const getReferents = () => {
        setReferents([]);
        return UsersManager.getAllReferents()
            .then(setReferents)
            .catch((err) => {
                console.error(err);
                toast.error(`Une erreur s'est produite pendant la récupération des données\n${err}`);
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
            if (hostFamily.address && hostFamily.address.length > 10) {
                setIsGeocoding(true);
                setGeocodeFound(null);
                Geocode.getCoordinatesFromAddress(hostFamily.address)
                    .then((coordinates) => {
                        if (coordinates !== null) {
                            hostFamily.latitude = coordinates.lat;
                            hostFamily.longitude = coordinates.lng;
                        } else {
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

    const save = () => {
        if (!isGeocoding) {
            setIsEditing(false);
            setShouldSave(true);
        } else {
            setShouldSave(true);
        }
    };

    const saveIfNeeded = () => {
        if (!shouldSave || hostFamily === null) return;
        setShouldSave(false);
        setIsEditing(false);

        if (hostFamilyId === "new") {
            if (hostFamily.firstname === undefined) {
                toast.error("Le prénom est obligatoire");
                setIsEditing(true);
                return;
            }
            if (hostFamily.name === undefined) {
                toast.error("Le nom est obligatoire");
                setIsEditing(true);
                return;
            }
            HostFamiliesManager.create(hostFamily)
                .then((updatedHostFamily) => {
                    toast.success("Famille d'Accueil créée");
                    navigate(`/hostFamilies/${updatedHostFamily.id}`);
                })
                .catch((err) => {
                    console.error(err);
                    toast.error(`Une erreur s'est produite pendant la création des données\n${err}`);
                    setIsEditing(true);
                });
            return;
        }

        HostFamiliesManager.update(hostFamily)
            .then(() => {
                getHostFamily();
                toast.success("Famille d'Accueil mis à jour");
            })
            .catch((err) => {
                console.error(err);
                getHostFamily();
                toast.error(`Une erreur s'est produite pendant la mise à jour des données\n${err}`);
            });
    };

    const deleteHF = () => {
        if (hostFamily === null) return;
        HostFamiliesManager.delete(hostFamily)
            .then(() => {
                toast.success("Famille d'Accueil supprimée");
                navigate("/hostFamilies");
            })
            .catch((err) => {
                console.error(err);
                getHostFamily();
                toast.error(`Une erreur s'est produite pendant la suppression des données\n${err}`);
            });
    };

    const formattedPhone = (): string | undefined => {
        if (!hostFamily?.phone) return hostFamily?.phone;
        const cleaned = String(hostFamily.phone).replace(/\D/g, "");
        const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
        if (match) {
            match.shift();
            return match.join(".");
        }
        return hostFamily?.phone;
    };

    const canEdit =
        pagePermissions[Ressource.HF_CONTACT].can_update ||
        pagePermissions[Ressource.HF_ADDRESS].can_update ||
        pagePermissions[Ressource.HF_HOST].can_update ||
        pagePermissions[Ressource.HF_HIST_PETS].can_update;

    let content = <div>Chargement...</div>;

    if (hostFamily === undefined) {
        content = <div>Famille d'Accueil non trouvé</div>;
    } else if (hostFamily === null) {
        content = <div>Chargement...</div>;
    } else {
        content = (
            <div>
                <HostFamilyDetailPageActions
                    hostFamilyId={hostFamilyId}
                    isEditing={isEditing}
                    canEdit={canEdit}
                    onEdit={() => setIsEditing(true)}
                    onSave={save}
                    onRefresh={refresh}
                    onDelete={() => setShowDeleteConfirmationModal(true)}
                />

                <br />

                <Card>
                    <HostFamilyDetailHeader
                        hostFamilyId={hostFamilyId}
                        hostFamily={hostFamily}
                        isEditing={isEditing}
                        canUpdateContact={!!pagePermissions[Ressource.HF_CONTACT]?.can_update}
                        onHostFamilyChange={onHostFamilyChange}
                    />
                    <CardBody>
                        <HostFamilyDetailSummary
                            hostFamily={hostFamily}
                            referents={referents}
                            isEditing={isEditing}
                            canUpdateContact={!!pagePermissions[Ressource.HF_CONTACT]?.can_update}
                            onHostFamilyChange={onHostFamilyChange}
                        />
                        {pagePermissions[Ressource.HF_CONTACT].can_read && (
                            <HostFamilyContactAccordion
                                hostFamilyId={hostFamilyId}
                                hostFamily={hostFamily}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.HF_CONTACT]?.can_update}
                                openId={openContactInfo}
                                onToggle={(id) => setOpenContactInfo(openContactInfo === id ? "" : id)}
                                onHostFamilyChange={onHostFamilyChange}
                                formattedPhone={formattedPhone()}
                                geocodeFound={geocodeFound}
                            />
                        )}
                        {pagePermissions[Ressource.HF_ADDRESS].can_read && (
                            <HostFamilyHomeAccordion
                                hostFamily={hostFamily}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.HF_ADDRESS]?.can_update}
                                openId={openHomeInfo}
                                onToggle={(id) => setOpenHomeInfo(openHomeInfo === id ? "" : id)}
                                onHostFamilyChange={onHostFamilyChange}
                            />
                        )}
                        {pagePermissions[Ressource.HF_HOST].can_read && (
                            <HostFamilyHostAccordion
                                hostFamily={hostFamily}
                                hostFamilyKinds={hostFamilyKinds}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.HF_HOST]?.can_update}
                                openId={openHostInfo}
                                onToggle={(id) => setOpenHostInfo(openHostInfo === id ? "" : id)}
                                onHostFamilyChange={onHostFamilyChange}
                            />
                        )}
                    </CardBody>
                </Card>

                <br />

                {hostFamilyId !== "new" && pagePermissions[Ressource.HF_HIST_PETS].can_read && (
                    <HostFamilyAnimalsHistory hostFamilyId={hostFamilyId} />
                )}
            </div>
        );
    }

    return (
        <Page
            className="HostFamilyPage"
            title="Détail de la Famille d'Accueil"
            breadcrumbs={[
                { name: "Familles d'Accueil", to: "/hostFamilies" } as CustomBreadcrumbItem,
                { name: "Famille d'Accueil", active: true } as CustomBreadcrumbItem,
            ]}
        >
            {content}
            <DeleteConfirmationModal
                show={showDeleteConfirmationModal}
                handleClose={(confirmed) => {
                    setShowDeleteConfirmationModal(false);
                    if (confirmed) deleteHF();
                }}
                bodyEntityName="une Famille d'Accueil"
            />
        </Page>
    );
};

export default HostFamilyDetailPage;
