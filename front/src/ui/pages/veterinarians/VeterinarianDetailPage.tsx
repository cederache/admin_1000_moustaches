import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Row } from "reactstrap";
import VeterinariansManager from "../../../managers/veterinarians.manager";
import { MdDelete, MdDirections, MdOutlineModeEdit, MdRefresh, MdSave } from "react-icons/md";
import SourceLink from "../../components/SourceLink";
import BooleanNullableDropdown from "../../components/BooleanNullableDropdown";
import PriceLevelDropdown from "../../components/PriceLevelDropdown";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Geocode from "../../../utils/geocode";
import toast from "react-hot-toast";
import Veterinarian from "../../../logic/entities/Veterinarian";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import { useNavigate, useParams } from "react-router-dom";
import useGetPermissions from "../../../hooks/useGetPermissions";
import { Ressource } from "../../../logic/entities/Permissions";
import { useVeterinarian } from "../../../hooks/veterinarians/useVeterinarian";
import { useCreateVeterinarian } from "../../../hooks/veterinarians/useCreateVeterinarian";
import { useUpdateVeterinarian } from "../../../hooks/veterinarians/useUpdateVeterinarian";
import { useDeleteVeterinarian } from "../../../hooks/veterinarians/useDeleteVeterinarian";

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

    useEffect(() => {
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
    }, [isNewVeterinarian ? formVeterinarian?.address : (formVeterinarian ?? veterinarian)?.address]);

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
                    <Row className="justify-content-end">
                        <Col xs="auto">
                            <Button className="ms-2" color="success" onClick={save}>
                                <MdSave />
                            </Button>
                            <Button className="ms-2" onClick={handleRefresh}>
                                <MdRefresh />
                            </Button>
                        </Col>
                    </Row>
                    <br />
                    <Card>
                        <CardHeader>
                            <h2>{t("veterinarians.newVeterinarian")}</h2>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xs={12}>
                                    <Label>Nom</Label>
                                    <Input
                                        value={formVeterinarian.name || ""}
                                        disabled={!isEditing}
                                        onChange={(evt) => setFormVeterinarian({ ...formVeterinarian, name: evt.target.value })}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6}>
                                    <Row>
                                        <Col xs={12}>
                                            <Label>Téléphone</Label>
                                            <Input
                                                value={formVeterinarian.phone}
                                                disabled={!isEditing}
                                                onChange={(evt) => setFormVeterinarian({ ...formVeterinarian, phone: evt.target.value })}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <Label>E-mail</Label>
                                            <Input
                                                value={formVeterinarian.mail}
                                                disabled={!isEditing}
                                                onChange={(evt) => setFormVeterinarian({ ...formVeterinarian, mail: evt.target.value })}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={6}>
                                    <Label>
                                        {formVeterinarian.address !== undefined && (
                                            <SourceLink link={`https://www.google.com/maps/place/${formVeterinarian.address}`}>
                                                <span>Adresse <MdDirections /></span>
                                            </SourceLink>
                                        )}
                                        {formVeterinarian.address === undefined && <span>Adresse</span>}
                                    </Label>
                                    <Input
                                        type="textarea"
                                        value={formVeterinarian.address}
                                        disabled={!isEditing}
                                        onChange={(evt) => setFormVeterinarian({ ...formVeterinarian, address: evt.target.value })}
                                    />
                                    {geocodeFound != null && (
                                        <p className={geocodeFound ? "text-success" : "text-danger"}>
                                            <small>{geocodeFound ? t("veterinarians.addressValid") : t("veterinarians.addressNotFound")}</small>
                                        </p>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6}>
                                    <Row>
                                        <Col xs={6}><Label>Gestion des urgences</Label></Col>
                                        <Col xs={6}><Label>Niveau de prix</Label></Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <BooleanNullableDropdown
                                                value={formVeterinarian.emergencies ?? null}
                                                disabled={!isEditing}
                                                onChange={(newValue) => setFormVeterinarian({ ...formVeterinarian, emergencies: newValue ?? undefined })}
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            <PriceLevelDropdown
                                                value={formVeterinarian.priceLevel}
                                                disabled={!isEditing}
                                                onChange={(newValue) => setFormVeterinarian({ ...formVeterinarian, priceLevel: newValue })}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={6}>
                                    <Label>Méthode de confirmation de rendez-vous</Label>
                                    <Input
                                        type="textarea"
                                        value={formVeterinarian.appointmentConfirmationProcedure}
                                        disabled={!isEditing}
                                        onChange={(evt) => setFormVeterinarian({ ...formVeterinarian, appointmentConfirmationProcedure: evt.target.value })}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6}>
                                    <Label>Date de paiement</Label>
                                    <Input
                                        type="textarea"
                                        value={formVeterinarian.invoicePaymentDate}
                                        disabled={!isEditing}
                                        onChange={(evt) => setFormVeterinarian({ ...formVeterinarian, invoicePaymentDate: evt.target.value })}
                                    />
                                </Col>
                                <Col xs={6}>
                                    <Label>Moyen de paiement</Label>
                                    <Input
                                        type="textarea"
                                        value={formVeterinarian.paymentMethod}
                                        disabled={!isEditing}
                                        onChange={(evt) => setFormVeterinarian({ ...formVeterinarian, paymentMethod: evt.target.value })}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
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
                <Row className="justify-content-end">
                    <Col xs="auto">
                        {vetId !== "new" && isEditing && (
                            <Button color="danger" onClick={() => setShowDeleteConfirmationModal(true)}>
                                <MdDelete />
                            </Button>
                        )}
                        {!isEditing && pagePermissions[Ressource.VET_INFO].can_update && (
                            <Button className="ms-2" color="primary" onClick={handleStartEditing}>
                                <MdOutlineModeEdit />
                            </Button>
                        )}
                        {isEditing && (
                            <Button className="ms-2" color="success" onClick={save}>
                                <MdSave />
                            </Button>
                        )}
                        <Button className="ms-2" onClick={handleRefresh}>
                            <MdRefresh />
                        </Button>
                    </Col>
                </Row>
                <br />
                <Card>
                    <CardHeader>
                        <h2>{displayVeterinarian.name}</h2>
                    </CardHeader>
                    <CardBody>
                        {vetId === "new" && (
                            <Row>
                                <Col xs={12}>
                                    <Label>Nom</Label>
                                    <Input
                                        value={displayVeterinarian.name || ""}
                                        disabled={!isEditing}
                                        onChange={(evt) =>
                                            setFormVeterinarian(
                                                formVeterinarian ? { ...formVeterinarian, name: evt.target.value } : { ...displayVeterinarian, name: evt.target.value }
                                            )
                                        }
                                    />
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col xs={6}>
                                <Row>
                                    <Col xs={12}>
                                        <Label>Téléphone</Label>
                                        <Input
                                            value={displayVeterinarian.phone}
                                            disabled={!isEditing}
                                            onChange={(evt) =>
                                                setFormVeterinarian(
                                                    formVeterinarian ? { ...formVeterinarian, phone: evt.target.value } : { ...displayVeterinarian, phone: evt.target.value }
                                                )
                                            }
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <Label>E-mail</Label>
                                        <Input
                                            value={displayVeterinarian.mail}
                                            disabled={!isEditing}
                                            onChange={(evt) =>
                                                setFormVeterinarian(
                                                    formVeterinarian ? { ...formVeterinarian, mail: evt.target.value } : { ...displayVeterinarian, mail: evt.target.value }
                                                )
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Label>
                                    {displayVeterinarian.address !== undefined && (
                                        <SourceLink link={`https://www.google.com/maps/place/${displayVeterinarian.address}`}>
                                            <span>Adresse <MdDirections /></span>
                                        </SourceLink>
                                    )}
                                    {displayVeterinarian.address === undefined && <span>Adresse</span>}
                                </Label>
                                <Input
                                    type="textarea"
                                    value={displayVeterinarian.address}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setFormVeterinarian(
                                            formVeterinarian ? { ...formVeterinarian, address: evt.target.value } : { ...displayVeterinarian, address: evt.target.value }
                                        )
                                    }
                                />
                                {geocodeFound != null && (
                                    <p className={geocodeFound ? "text-success" : "text-danger"}>
                                        <small>{geocodeFound ? t("veterinarians.addressValid") : t("veterinarians.addressNotFound")}</small>
                                    </p>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Row>
                                    <Col xs={6}><Label>Gestion des urgences</Label></Col>
                                    <Col xs={6}><Label>Niveau de prix</Label></Col>
                                </Row>
                                <Row>
                                    <Col xs={6}>
                                        <BooleanNullableDropdown
                                            value={displayVeterinarian.emergencies ?? null}
                                            disabled={!isEditing}
                                            onChange={(newValue) =>
                                                setFormVeterinarian(
                                                    formVeterinarian ? { ...formVeterinarian, emergencies: newValue ?? undefined } : { ...displayVeterinarian, emergencies: newValue ?? undefined }
                                                )
                                            }
                                        />
                                    </Col>
                                    <Col xs={6}>
                                        <PriceLevelDropdown
                                            value={displayVeterinarian.priceLevel}
                                            disabled={!isEditing}
                                            onChange={(newValue) =>
                                                setFormVeterinarian(
                                                    formVeterinarian ? { ...formVeterinarian, priceLevel: newValue } : { ...displayVeterinarian, priceLevel: newValue }
                                                )
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Label>Méthode de confirmation de rendez-vous</Label>
                                <Input
                                    type="textarea"
                                    value={displayVeterinarian.appointmentConfirmationProcedure}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setFormVeterinarian(
                                            formVeterinarian ? { ...formVeterinarian, appointmentConfirmationProcedure: evt.target.value } : { ...displayVeterinarian, appointmentConfirmationProcedure: evt.target.value }
                                        )
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Label>Date de paiement</Label>
                                <Input
                                    type="textarea"
                                    value={displayVeterinarian.invoicePaymentDate}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setFormVeterinarian(
                                            formVeterinarian ? { ...formVeterinarian, invoicePaymentDate: evt.target.value } : { ...displayVeterinarian, invoicePaymentDate: evt.target.value }
                                        )
                                    }
                                />
                            </Col>
                            <Col xs={6}>
                                <Label>Moyen de paiement</Label>
                                <Input
                                    type="textarea"
                                    value={displayVeterinarian.paymentMethod}
                                    disabled={!isEditing}
                                    onChange={(evt) =>
                                        setFormVeterinarian(
                                            formVeterinarian ? { ...formVeterinarian, paymentMethod: evt.target.value } : { ...displayVeterinarian, paymentMethod: evt.target.value }
                                        )
                                    }
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
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
