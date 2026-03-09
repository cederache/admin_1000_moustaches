import React, { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "reactstrap";
import HostFamiliesManager from "../../../managers/hostFamilies.manager";
import Geocode from "../../../utils/geocode";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import HostFamily from "../../../logic/entities/HostFamily";
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
import { useHostFamily } from "../../../hooks/hostFamilies/useHostFamily";
import { useHostFamilyKinds } from "../../../hooks/hostFamilies/useHostFamilyKinds";
import { useReferents } from "../../../hooks/users/useReferents";
import { useCreateHostFamily } from "../../../hooks/hostFamilies/useCreateHostFamily";
import { useUpdateHostFamily } from "../../../hooks/hostFamilies/useUpdateHostFamily";
import { useDeleteHostFamily } from "../../../hooks/hostFamilies/useDeleteHostFamily";

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
    const { t } = useTranslation();
    const { id: paramHostFamilyId } = useParams();
    const hostFamilyId = paramHostFamilyId ?? "new";
    const numericId = hostFamilyId === "new" ? null : parseInt(hostFamilyId, 10);
    const validId = numericId != null && !Number.isNaN(numericId) ? numericId : null;

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [formHostFamily, setFormHostFamily] = useState<HostFamily | null>(null);

    const [geocodeFound, setGeocodeFound] = useState<boolean | null>(null);
    const [previousAddress, setPreviousAddress] = useState<string | null>(null);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [shouldSave, setShouldSave] = useState(false);

    const [openContactInfo, setOpenContactInfo] = useState<string>("");
    const [openHomeInfo, setOpenHomeInfo] = useState<string>("");
    const [openHostInfo, setOpenHostInfo] = useState<string>("");

    const navigate = useNavigate();
    const pagePermissions = useGetPermissions(permissionsName);

    const { data: hostFamily, isPending: isHostFamilyPending, isError: isHostFamilyError, refetch: refetchHostFamily } = useHostFamily(validId);
    const { data: hostFamilyKindsData, isPending: isHostFamilyKindsPending, refetch: refetchHostFamilyKinds } = useHostFamilyKinds();
    const { data: referentsData, isPending: isReferentsPending, refetch: refetchReferents } = useReferents();

    const { mutate: createHostFamilyMutation, isPending: isCreatePending } = useCreateHostFamily();
    const { mutate: updateHostFamilyMutation, isPending: isUpdatePending } = useUpdateHostFamily();
    const { mutate: deleteHostFamilyMutation, isPending: isDeletePending } = useDeleteHostFamily();

    const hostFamilyKinds = useMemo(
        () => (hostFamilyKindsData ? [...hostFamilyKindsData].sort((a, b) => a.name.localeCompare(b.name)) : []),
        [hostFamilyKindsData]
    );
    const referents = referentsData ?? [];

    const isNewHostFamily = hostFamilyId === "new";

    const onHostFamilyChange = (updates: Partial<HostFamily>) => {
        const target = isNewHostFamily ? formHostFamily : formHostFamily ?? hostFamily;
        if (target) {
            const next = { ...target, ...updates };
            if (isNewHostFamily) setFormHostFamily(next);
            else setFormHostFamily(next);
        }
    };

    useEffect(() => {
        if (isNewHostFamily && formHostFamily === null) {
            setFormHostFamily(HostFamiliesManager.createHostFamily());
            setIsEditing(true);
            setOpenContactInfo("1");
            setOpenHomeInfo("1");
            setOpenHostInfo("1");
        }
    }, [isNewHostFamily]);

    useEffect(() => {
        if (!isNewHostFamily && hostFamily) {
            setFormHostFamily(null);
        }
    }, [isNewHostFamily, hostFamily?.id]);

    const handleRefresh = () => {
        if (hostFamilyId !== "new") {
            refetchHostFamily();
            refetchReferents();
            refetchHostFamilyKinds();
        } else {
            setOpenContactInfo("1");
            setOpenHomeInfo("1");
            setOpenHostInfo("1");
            setFormHostFamily(HostFamiliesManager.createHostFamily());
            setIsEditing(true);
        }
    };

    const handleStartEditing = () => {
        if (hostFamily) {
            setFormHostFamily({ ...hostFamily });
            setIsEditing(true);
        }
    };

    useEffect(() => {
        const hf = isNewHostFamily ? formHostFamily : hostFamily;
        if (hf !== null && hf !== undefined && previousAddress !== hf.address) {
            setPreviousAddress(hf.address ?? null);
            if (hf.address && hf.address.length > 10) {
                setIsGeocoding(true);
                setGeocodeFound(null);
                Geocode.getCoordinatesFromAddress(hf.address)
                    .then((coordinates) => {
                        if (coordinates !== null) {
                            onHostFamilyChange({ latitude: coordinates.lat, longitude: coordinates.lng });
                        } else {
                            onHostFamilyChange({ latitude: undefined, longitude: undefined });
                        }
                        setIsGeocoding(false);
                        setGeocodeFound(true);
                        setShouldSave(true);
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsGeocoding(false);
                        setGeocodeFound(false);
                        setShouldSave(true);
                    });
            }
        }
    }, [isNewHostFamily ? formHostFamily?.address : hostFamily?.address]);

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
        const hfToSave = isNewHostFamily ? formHostFamily : formHostFamily ?? hostFamily;
        if (!shouldSave || hfToSave == null) return;
        setShouldSave(false);
        setIsEditing(false);

        if (isNewHostFamily) {
            if (hfToSave.firstname === undefined) {
                toast.error(t("hostFamilies.validation.firstNameRequired"));
                setIsEditing(true);
                return;
            }
            if (hfToSave.name === undefined) {
                toast.error(t("hostFamilies.validation.lastNameRequired"));
                setIsEditing(true);
                return;
            }
            createHostFamilyMutation(hfToSave, {
                onSuccess: (updatedHostFamily) => {
                    toast.success(t("hostFamilies.message.hostFamilyCreated"));
                    navigate(`/hostFamilies/${updatedHostFamily.id}`);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(`${t("common.errorCreate")}\n${err}`);
                    setIsEditing(true);
                },
            });
            return;
        }

        updateHostFamilyMutation(hfToSave, {
            onSuccess: () => {
                refetchHostFamily();
                toast.success(t("hostFamilies.message.hostFamilyUpdated"));
            },
            onError: (err) => {
                console.error(err);
                refetchHostFamily();
                toast.error(`${t("common.errorUpdate")}\n${err}`);
            },
        });
    };

    const deleteHF = () => {
        const hfToDelete = isNewHostFamily ? formHostFamily : hostFamily;
        if (hfToDelete == null) return;
        deleteHostFamilyMutation(hfToDelete, {
            onSuccess: () => {
                toast.success(t("hostFamilies.message.hostFamilyDeleted"));
                navigate("/hostFamilies");
            },
            onError: (err) => {
                console.error(err);
                refetchHostFamily();
                toast.error(`${t("common.errorDelete")}\n${err}`);
            },
        });
    };

    const formattedPhone = (): string | undefined => {
        const hf = isNewHostFamily ? formHostFamily : hostFamily;
        if (!hf?.phone) return hf?.phone;
        const cleaned = String(hf.phone).replace(/\D/g, "");
        const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
        if (match) {
            match.shift();
            return match.join(".");
        }
        return hf?.phone;
    };

    const canEdit =
        pagePermissions[Ressource.HF_CONTACT].can_update ||
        pagePermissions[Ressource.HF_ADDRESS].can_update ||
        pagePermissions[Ressource.HF_HOST].can_update ||
        pagePermissions[Ressource.HF_HIST_PETS].can_update;

    const displayHostFamily = isNewHostFamily ? formHostFamily : (isEditing ? formHostFamily : hostFamily) ?? hostFamily;

    let content = <div>{t("common.loading")}</div>;

    if (isNewHostFamily) {
        if (formHostFamily) {
            content = (
                <div>
                    <HostFamilyDetailPageActions
                        hostFamilyId={hostFamilyId}
                        isEditing={isEditing}
                        canEdit={canEdit}
                        onEdit={() => setIsEditing(true)}
                        onSave={save}
                        onRefresh={handleRefresh}
                        onDelete={() => setShowDeleteConfirmationModal(true)}
                    />
                    <br />
                    <Card>
                        <HostFamilyDetailHeader
                            hostFamilyId={hostFamilyId}
                            hostFamily={formHostFamily}
                            isEditing={isEditing}
                            canUpdateContact={!!pagePermissions[Ressource.HF_CONTACT]?.can_update}
                            onHostFamilyChange={onHostFamilyChange}
                        />
                        <CardBody>
                            <HostFamilyDetailSummary
                                hostFamily={formHostFamily}
                                referents={referents}
                                isEditing={isEditing}
                                canUpdateContact={!!pagePermissions[Ressource.HF_CONTACT]?.can_update}
                                onHostFamilyChange={onHostFamilyChange}
                            />
                            {pagePermissions[Ressource.HF_CONTACT].can_read && (
                                <HostFamilyContactAccordion
                                    hostFamilyId={hostFamilyId}
                                    hostFamily={formHostFamily}
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
                                    hostFamily={formHostFamily}
                                    isEditing={isEditing}
                                    canUpdate={!!pagePermissions[Ressource.HF_ADDRESS]?.can_update}
                                    openId={openHomeInfo}
                                    onToggle={(id) => setOpenHomeInfo(openHomeInfo === id ? "" : id)}
                                    onHostFamilyChange={onHostFamilyChange}
                                />
                            )}
                            {pagePermissions[Ressource.HF_HOST].can_read && (
                                <HostFamilyHostAccordion
                                    hostFamily={formHostFamily}
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
                </div>
            );
        }
    } else if (isHostFamilyPending && !hostFamily) {
        content = <div>{t("common.loading")}</div>;
    } else if (isHostFamilyError || (hostFamily === undefined && !isHostFamilyPending)) {
        content = <div>{t("hostFamilies.hostFamilyNotFound")}</div>;
    } else if (displayHostFamily) {
        content = (
            <div>
                <HostFamilyDetailPageActions
                    hostFamilyId={hostFamilyId}
                    isEditing={isEditing}
                    canEdit={canEdit}
                    onEdit={handleStartEditing}
                    onSave={save}
                    onRefresh={handleRefresh}
                    onDelete={() => setShowDeleteConfirmationModal(true)}
                />
                <br />
                <Card>
                    <HostFamilyDetailHeader
                        hostFamilyId={hostFamilyId}
                        hostFamily={displayHostFamily}
                        isEditing={isEditing}
                        canUpdateContact={!!pagePermissions[Ressource.HF_CONTACT]?.can_update}
                        onHostFamilyChange={onHostFamilyChange}
                    />
                    <CardBody>
                        <HostFamilyDetailSummary
                            hostFamily={displayHostFamily}
                            referents={referents}
                            isEditing={isEditing}
                            canUpdateContact={!!pagePermissions[Ressource.HF_CONTACT]?.can_update}
                            onHostFamilyChange={onHostFamilyChange}
                        />
                        {pagePermissions[Ressource.HF_CONTACT].can_read && (
                            <HostFamilyContactAccordion
                                hostFamilyId={hostFamilyId}
                                hostFamily={displayHostFamily}
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
                                hostFamily={displayHostFamily}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.HF_ADDRESS]?.can_update}
                                openId={openHomeInfo}
                                onToggle={(id) => setOpenHomeInfo(openHomeInfo === id ? "" : id)}
                                onHostFamilyChange={onHostFamilyChange}
                            />
                        )}
                        {pagePermissions[Ressource.HF_HOST].can_read && (
                            <HostFamilyHostAccordion
                                hostFamily={displayHostFamily}
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
            title={t("hostFamilies.detailTitle")}
            breadcrumbs={[
                { name: t("hostFamilies.breadcrumbList"), to: "/hostFamilies" } as CustomBreadcrumbItem,
                { name: t("hostFamilies.breadcrumbDetail"), active: true } as CustomBreadcrumbItem,
            ]}
        >
            {content}
            <DeleteConfirmationModal
                show={showDeleteConfirmationModal}
                handleClose={(confirmed) => {
                    setShowDeleteConfirmationModal(false);
                    if (confirmed) deleteHF();
                }}
                bodyEntityName={t("hostFamilies.entityName")}
            />
        </Page>
    );
};

export default HostFamilyDetailPage;
