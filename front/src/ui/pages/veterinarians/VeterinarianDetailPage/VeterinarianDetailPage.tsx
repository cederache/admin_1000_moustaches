import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import VeterinariansManager from "../../../../api/managers/veterinarians.manager";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import Geocode from "../../../../utils/geocode";
import toast from "react-hot-toast";
import Veterinarian from "../../../../logic/entities/Veterinarian";
import Page, { CustomBreadcrumbItem } from "../../../components/Page";
import { useNavigate, useParams } from "react-router-dom";
import useGetPermissions from "../../../../api/hooks/useGetPermissions";
import { Ressource } from "../../../../logic/entities/Permissions";
import { useVeterinarian } from "../../../../api/hooks/veterinarians/useVeterinarian";
import { useCreateVeterinarian } from "../../../../api/hooks/veterinarians/useCreateVeterinarian";
import { useUpdateVeterinarian } from "../../../../api/hooks/veterinarians/useUpdateVeterinarian";
import { useDeleteVeterinarian } from "../../../../api/hooks/veterinarians/useDeleteVeterinarian";
import VeterinarianDetailPageActions from "./components/VeterinarianDetailPageActions";
import VeterinarianDetailForm from "./components/VeterinarianDetailForm";

interface VeterinarianDetailPageProps {
    [key: string]: any;
}

const VeterinarianDetailPage: FC<VeterinarianDetailPageProps> = ({ props }) => {
    const { t } = useTranslation();
    const { id: paramVetId } = useParams();
    const vetId = paramVetId ?? "new";
    const numericId = vetId === "new" ? null : parseInt(vetId, 10);
    const validId = numericId != null && !Number.isNaN(numericId) ? numericId : null;

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);
    const [formVeterinarian, setFormVeterinarian] = useState<Veterinarian | null>(null);

    const [geocodeFound, setGeocodeFound] = useState<boolean | null>(null);
    const [previousAddress, setPreviousAddress] = useState<string | null>(null);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [shouldSave, setShouldSave] = useState(false);

    const navigate = useNavigate();
    const pagePermissions = useGetPermissions([Ressource.VET_INFO]);

    const { data: veterinarian, isPending: isVeterinarianPending, isError: isVeterinarianError, refetch: refetchVeterinarian } = useVeterinarian(validId);
    const { mutate: createVeterinarianMutation } = useCreateVeterinarian();
    const { mutate: updateVeterinarianMutation } = useUpdateVeterinarian();
    const { mutate: deleteVeterinarianMutation } = useDeleteVeterinarian();

    const isNewVeterinarian = vetId === "new";

    useEffect(() => {
        if (isNewVeterinarian && formVeterinarian === null) {
            setFormVeterinarian(VeterinariansManager.createVeterinarian());
            setIsEditing(true);
        }
    }, [isNewVeterinarian]);

    const handleRefresh = () => {
        if (vetId !== "new") {
            refetchVeterinarian();
        } else {
            setFormVeterinarian(VeterinariansManager.createVeterinarian());
            setIsEditing(true);
        }
    };

    const handleStartEditing = () => {
        if (veterinarian) {
            setFormVeterinarian({ ...veterinarian });
            setIsEditing(true);
        }
    };

    const onVeterinarianChange = (updates: Partial<Veterinarian>) => {
        const target = isNewVeterinarian ? formVeterinarian : formVeterinarian ?? veterinarian;
        if (target) setFormVeterinarian({ ...target, ...updates });
    };

    useEffect(() => {
        if (!isNewVeterinarian && !isEditing) return;
        const vet = isNewVeterinarian ? formVeterinarian : formVeterinarian ?? veterinarian;
        if (vet != null && previousAddress !== vet.address) {
            setPreviousAddress(vet.address ?? null);
            if (vet.address != null && vet.address.length > 10) {
                setIsGeocoding(true);
                setGeocodeFound(null);
                Geocode.getCoordinatesFromAddress(vet.address)
                    .then((coordinates) => {
                        if (coordinates != null) {
                            setFormVeterinarian((prev) => (prev ? { ...prev, latitude: coordinates.lat, longitude: coordinates.lng } : prev));
                        } else {
                            setFormVeterinarian((prev) => (prev ? { ...prev, latitude: undefined, longitude: undefined } : prev));
                        }
                        setIsGeocoding(false);
                        setGeocodeFound(true);
                        setShouldSave(true);
                    })
                    .catch((err: Error) => {
                        console.error(err);
                        setIsGeocoding(false);
                        setGeocodeFound(false);
                        setShouldSave(true);
                    });
            }
        }
    }, [isNewVeterinarian, isEditing, isNewVeterinarian ? formVeterinarian?.address : (formVeterinarian ?? veterinarian)?.address]);

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
        const vetToSave = isNewVeterinarian ? formVeterinarian : formVeterinarian ?? veterinarian;
        if (!shouldSave || vetToSave == null) return;
        setShouldSave(false);
        setIsEditing(false);

        if (isNewVeterinarian) {
            createVeterinarianMutation(vetToSave, {
                onSuccess: (updatedVeterinarian) => {
                    toast.success(t("veterinarians.message.veterinarianCreated"));
                    navigate(`/veterinarians/${updatedVeterinarian.id}`);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(`${t("common.errorCreate")}\n${err}`);
                },
            });
            return;
        }

        updateVeterinarianMutation(vetToSave, {
            onSuccess: () => {
                refetchVeterinarian();
                toast.success(t("veterinarians.message.veterinarianUpdated"));
            },
            onError: (err) => {
                console.error(err);
                refetchVeterinarian();
                toast.error(`${t("common.errorUpdate")}\n${err}`);
            },
        });
    };

    const deleteV = () => {
        const vetToDelete = isNewVeterinarian ? formVeterinarian : veterinarian;
        if (vetToDelete == null) return;
        deleteVeterinarianMutation(vetToDelete, {
            onSuccess: () => {
                toast.success(t("veterinarians.message.veterinarianDeleted"));
                navigate("/veterinarians");
            },
            onError: (err) => {
                console.error(err);
                refetchVeterinarian();
                toast.error(`${t("common.errorDelete")}\n${err}`);
            },
        });
    };

    const displayVeterinarian = isNewVeterinarian ? formVeterinarian : (isEditing ? formVeterinarian : veterinarian) ?? veterinarian;

    let content = <div>{t("common.loading")}</div>;

    if (isNewVeterinarian) {
        if (formVeterinarian) {
            content = (
                <div>
                    <VeterinarianDetailPageActions
                        vetId={vetId}
                        isEditing={isEditing}
                        canEdit={!!pagePermissions[Ressource.VET_INFO]?.can_update}
                        onEdit={handleStartEditing}
                        onSave={save}
                        onRefresh={handleRefresh}
                        onDelete={() => setShowDeleteConfirmationModal(true)}
                    />
                    <br />
                    <VeterinarianDetailForm
                        veterinarian={formVeterinarian}
                        isEditing={isEditing}
                        isNew={true}
                        geocodeFound={geocodeFound}
                        onVeterinarianChange={onVeterinarianChange}
                    />
                </div>
            );
        }
    } else if (isVeterinarianPending && !veterinarian) {
        content = <div>{t("common.loading")}</div>;
    } else if (isVeterinarianError || (veterinarian === undefined && !isVeterinarianPending)) {
        content = <div>{t("veterinarians.veterinarianNotFound")}</div>;
    } else if (displayVeterinarian) {
        content = (
            <div>
                <VeterinarianDetailPageActions
                    vetId={vetId}
                    isEditing={isEditing}
                    canEdit={!!pagePermissions[Ressource.VET_INFO]?.can_update}
                    onEdit={handleStartEditing}
                    onSave={save}
                    onRefresh={handleRefresh}
                    onDelete={() => setShowDeleteConfirmationModal(true)}
                />
                <br />
                <VeterinarianDetailForm
                    veterinarian={displayVeterinarian}
                    isEditing={isEditing}
                    isNew={false}
                    geocodeFound={geocodeFound}
                    onVeterinarianChange={onVeterinarianChange}
                />
            </div>
        );
    }

    return (
        <Page
            className="VeterinarianPage"
            title={t("veterinarians.detailTitle")}
            breadcrumbs={[
                { name: t("veterinarians.breadcrumb"), to: "/veterinarians" } as CustomBreadcrumbItem,
                { name: t("veterinarians.breadcrumbDetail"), active: true } as CustomBreadcrumbItem,
            ]}
        >
            {content}
            <DeleteConfirmationModal
                show={showDeleteConfirmationModal}
                handleClose={(confirmed) => {
                    setShowDeleteConfirmationModal(false);
                    if (confirmed) deleteV();
                }}
                bodyEntityName={t("veterinarians.entityName")}
            />
        </Page>
    );
};
export default VeterinarianDetailPage;
