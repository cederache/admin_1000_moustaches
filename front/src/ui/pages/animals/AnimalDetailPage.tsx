import React, { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Row } from "reactstrap";
import AnimalsManager from "../../../managers/animals.manager";
import { MdRefresh, MdOutlineModeEdit, MdSave, MdDelete } from "react-icons/md";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import BooleanNullableDropdown from "../../components/BooleanNullableDropdown";
import NullableDropdown from "../../components/NullableDropdown";
import AnimalsToHostFamiliesManager from "../../../managers/animalsToHostFamilies.manager";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import toast from "react-hot-toast";
import AnimalToHostFamily from "../../../logic/entities/AnimalToHostFamily";
import Animal from "../../../logic/entities/Animal";
import { useNavigate, useParams } from "react-router-dom";
import useGetPermissions from "../../../hooks/useGetPermissions";
import { Ressource } from "../../../logic/entities/Permissions";
import HostFamiliesHistory from "./HostFamiliesHistory";
import VeterinarianInterventionsHistory from "./VeterinarianInterventionsHistory";
import AnimalInfoAccordion from "./AnimalInfoAccordion";
import AnimalPecAccordion from "./AnimalPecAccordion";
import AnimalHealthAccordion from "./AnimalHealthAccordion";
import AnimalBehaviourAccordion from "./AnimalBehaviourAccordion";
import AnimalExitAccordion from "./AnimalExitAccordion";
import AnimalDeathAccordion from "./AnimalDeathAccordion";
import { useAnimal } from "../../../hooks/animals/useAnimal";
import { useSpecies } from "../../../hooks/animals/useSpecies";
import { useSexes } from "../../../hooks/animals/useSexes";
import { useCreateAnimal } from "../../../hooks/animals/useCreateAnimal";
import { useUpdateAnimal } from "../../../hooks/animals/useUpdateAnimal";
import { useDeleteAnimal } from "../../../hooks/animals/useDeleteAnimal";

interface AnimalDetailPageProps {
    [key: string]: any;
}

enum AnimalDetailPageAccordion {
    INFO = "INFO",
    PEC = "PEC",
    HEALTH = "HEALTH",
    BEHAVIOUR = "BEHAVIOUR",
    EXIT = "EXIT",
    DEATH = "DEATH",
}

class AnimalDetailPageAccordionState {
    type: AnimalDetailPageAccordion;
    id: string;

    constructor(type: AnimalDetailPageAccordion, id: string) {
        this.type = type;
        this.id = id;
    }
}

const permissionsName: Ressource[] = [
    Ressource.PET_INFO,
    Ressource.PET_PICKUP,
    Ressource.PET_HEALTH,
    Ressource.PET_BEHAVIOR,
    Ressource.PET_DIFFUSION,
    Ressource.PET_EXIT,
    Ressource.PET_DEATH,
    Ressource.PET_HIST_VETO,
    Ressource.PET_HIST_HF,
];

const AnimalDetailPage: FC<AnimalDetailPageProps> = ({ props }) => {
    const { t } = useTranslation();
    const { id: paramAnimalId } = useParams();
    const animalId = paramAnimalId ?? "new";
    const numericId = animalId === "new" ? null : parseInt(animalId, 10);
    const validId = numericId != null && !Number.isNaN(numericId) ? numericId : null;

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);
    const [formAnimal, setFormAnimal] = useState<Animal | null>(null);

    const navigate = useNavigate();
    const pagePermissions = useGetPermissions(permissionsName);

    const { data: animal, isPending: isAnimalPending, isError: isAnimalError, refetch: refetchAnimal } = useAnimal(validId);
    const { data: speciesData, isPending: isSpeciesPending, refetch: refetchSpecies } = useSpecies();
    const { data: sexesData, isPending: isSexesPending, refetch: refetchSexes } = useSexes();

    const { mutate: createAnimalMutation } = useCreateAnimal();
    const { mutate: updateAnimalMutation } = useUpdateAnimal();
    const { mutate: deleteAnimalMutation } = useDeleteAnimal();

    const species = useMemo(
        () => (speciesData ? [...speciesData].sort((a, b) => a.name.localeCompare(b.name)) : []),
        [speciesData]
    );
    const sexes = useMemo(
        () => (sexesData ? [...sexesData].sort((a, b) => a.value.localeCompare(b.value)) : []),
        [sexesData]
    );

    const [accordions, setAccordions] = useState<AnimalDetailPageAccordionState[]>(
        Object.values(AnimalDetailPageAccordion)
            .map((type) => {
                if (typeof type !== "string") return null;
                const accordionType = type as AnimalDetailPageAccordion;
                return new AnimalDetailPageAccordionState(accordionType, "");
            })
            .filter((a): a is AnimalDetailPageAccordionState => a !== null)
    );

    const isNewAnimal = animalId === "new";

    useEffect(() => {
        if (isNewAnimal && formAnimal === null) {
            setFormAnimal(AnimalsManager.createAnimal());
            setIsEditing(true);
            setAccordions((prev) =>
                prev.map((value) => {
                    switch (value.type) {
                        case AnimalDetailPageAccordion.INFO:
                        case AnimalDetailPageAccordion.PEC:
                        case AnimalDetailPageAccordion.HEALTH:
                        case AnimalDetailPageAccordion.BEHAVIOUR:
                            return new AnimalDetailPageAccordionState(value.type, "1");
                        case AnimalDetailPageAccordion.EXIT:
                        case AnimalDetailPageAccordion.DEATH:
                            return new AnimalDetailPageAccordionState(value.type, "");
                        default:
                            return value;
                    }
                })
            );
        }
    }, [isNewAnimal]);

    useEffect(() => {
        if (animalId === "new" && formAnimal != null && species.length > 0 && formAnimal.species === undefined) {
            setFormAnimal((prev) => (prev ? { ...prev, species: species[0] } : prev));
        }
    }, [animalId, formAnimal?.species, species]);

    const toggleAccordion = (type: AnimalDetailPageAccordion, id: string) => {
        setAccordions((prev) =>
            prev.map((accordion) => {
                if (accordion.type !== type) return accordion;
                return new AnimalDetailPageAccordionState(type, accordion.id === id ? "" : id);
            })
        );
    };

    const onAnimalChange = (updates: Partial<Animal>) => {
        const target = isNewAnimal ? formAnimal : formAnimal ?? animal;
        if (target) setFormAnimal({ ...target, ...updates });
    };

    const handleRefresh = () => {
        if (isNewAnimal) {
            setFormAnimal(AnimalsManager.createAnimal());
            setIsEditing(true);
            setAccordions((prev) =>
                prev.map((value) => {
                    switch (value.type) {
                        case AnimalDetailPageAccordion.INFO:
                        case AnimalDetailPageAccordion.PEC:
                        case AnimalDetailPageAccordion.HEALTH:
                        case AnimalDetailPageAccordion.BEHAVIOUR:
                            return new AnimalDetailPageAccordionState(value.type, "1");
                        case AnimalDetailPageAccordion.EXIT:
                        case AnimalDetailPageAccordion.DEATH:
                            return new AnimalDetailPageAccordionState(value.type, "");
                        default:
                            return value;
                    }
                })
            );
        } else {
            refetchAnimal();
            refetchSpecies();
            refetchSexes();
        }
    };

    const save = () => {
        const animalToSave = isNewAnimal ? formAnimal : formAnimal ?? animal;
        if (animalToSave == null) return;

        setIsEditing(false);

        if (isNewAnimal) {
            createAnimalMutation(animalToSave, {
                onSuccess: (updatedAnimal) => {
                    toast.success(t("animals.message.animalCreated"));
                    navigate(`/animals/${updatedAnimal.id}`);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(`${t("common.errorCreate")}\n${err}`);
                },
            });
            return;
        }

        updateAnimalMutation(animalToSave, {
            onSuccess: () => {
                const exitOrDeathDate = animalToSave.deathDate || animalToSave.exitDate;
                if (exitOrDeathDate !== undefined && exitOrDeathDate !== "") {
                    animalToSave.hostFamilyRelations
                        ?.filter((athf) => athf.exitDate === undefined)
                        .forEach((athf) => {
                            if (
                                athf.animal?.id == null ||
                                athf.hostFamily?.id == null
                            ) return;
                            AnimalsToHostFamiliesManager.update(
                                new AnimalToHostFamily(undefined, athf.animal, athf.hostFamily, athf.entryDate, athf.exitDate)
                            );
                        });
                }
                refetchAnimal();
                toast.success(t("animals.message.animalUpdated"));
            },
            onError: (err) => {
                console.error(err);
                refetchAnimal();
                toast.error(`${t("common.errorUpdate")}\n${err}`);
            },
        });
    };

    const deleteA = () => {
        const animalToDelete = isNewAnimal ? formAnimal : animal;
        if (animalToDelete == null) return;
        deleteAnimalMutation(animalToDelete, {
            onSuccess: () => {
                toast.success(t("animals.message.animalDeleted"));
                navigate("/animals");
            },
            onError: (err) => {
                console.error(err);
                refetchAnimal();
                toast.error(`${t("common.errorDelete")}\n${err}`);
            },
        });
    };

    const displayAnimal = isNewAnimal ? formAnimal : (isEditing ? formAnimal : animal) ?? animal;

    let content = <div>{t("common.loading")}</div>;

    if (isNewAnimal) {
        if (formAnimal) {
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
                            <h2>{t("animals.newAnimal")}</h2>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col xs={12}>
                                    <Label>{t("animals.table.name")}</Label>
                                    <Input
                                        value={formAnimal.name || ""}
                                        disabled={!isEditing || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                        onChange={(evt) => onAnimalChange({ name: evt.target.value })}
                                    />
                                </Col>
                            </Row>
                            <Row className="text-center">
                                <Col md={4} lg={3}>
                                    <Label>{t("animals.detail.broadcastable")}</Label>
                                    <BooleanNullableDropdown
                                        withNewLine={true}
                                        value={formAnimal.broadcastable ?? null}
                                        disabled={!isEditing || formAnimal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                        onChange={(newValue) => onAnimalChange({ broadcastable: newValue ?? undefined })}
                                    />
                                </Col>
                                <Col md={4} lg={3}>
                                    <Label>{t("animals.detail.reservable")}</Label>
                                    <BooleanNullableDropdown
                                        withNewLine={true}
                                        value={formAnimal.bookable ?? null}
                                        disabled={!isEditing || formAnimal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                        onChange={(newValue) => onAnimalChange({ bookable: newValue ?? undefined })}
                                    />
                                </Col>
                                <Col md={4} lg={3}>
                                    <Label>{t("animals.detail.reserved")}</Label>
                                    <BooleanNullableDropdown
                                        withNewLine={true}
                                        value={formAnimal.reserved ?? null}
                                        disabled={!isEditing || formAnimal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                        onChange={(newValue) => onAnimalChange({ reserved: newValue ?? undefined })}
                                    />
                                </Col>
                                <Col md={4} lg={3}>
                                    <Label>{t("animals.detail.needIcadDuplicate")}</Label>
                                    <NullableDropdown
                                        withNewLine={true}
                                        color={
                                            formAnimal.needIcadDuplicate == null ? "warning" :
                                            formAnimal.needIcadDuplicate === "received" ? "success" :
                                            formAnimal.needIcadDuplicate === "waiting" ? "info" : "danger"
                                        }
                                        value={formAnimal.needIcadDuplicate}
                                        values={["no", "waiting", "received"]}
                                        valueDisplayName={(value) =>
                                            value == null ? t("common.nsp") :
                                            value === "received" ? t("animals.dropdown.icadReceived") :
                                            value === "waiting" ? t("animals.dropdown.icadWaiting") : t("animals.dropdown.icadNo")
                                        }
                                        valueActiveCheck={(value) => formAnimal.needIcadDuplicate === value}
                                        key="needIcadDuplicate"
                                        disabled={!isEditing || formAnimal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                        onChange={(newNeedIcadDuplicate) => onAnimalChange({ needIcadDuplicate: newNeedIcadDuplicate })}
                                    />
                                </Col>
                                <Col md={4} lg={3}>
                                    <Label>{t("animals.detail.adopted")}</Label>
                                    <BooleanNullableDropdown
                                        withNewLine={true}
                                        value={formAnimal.adopted ?? null}
                                        disabled={!isEditing || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                        onChange={(newValue) => onAnimalChange({ adopted: newValue ?? undefined })}
                                    />
                                </Col>
                                <Col md={4} lg={3}>
                                    <Label>{t("animals.detail.albumCreated")}</Label>
                                    <BooleanNullableDropdown
                                        withNewLine={true}
                                        value={formAnimal.albumCreated ?? null}
                                        disabled={!isEditing || formAnimal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                        onChange={(newValue) => onAnimalChange({ albumCreated: newValue ?? undefined })}
                                    />
                                </Col>
                                <Col md={4} lg={3}>
                                    <Label>{t("animals.detail.contractSent")}</Label>
                                    <BooleanNullableDropdown
                                        withNewLine={true}
                                        value={formAnimal.contractSent ?? null}
                                        disabled={!isEditing || formAnimal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                        onChange={(newValue) => onAnimalChange({ contractSent: newValue ?? undefined })}
                                    />
                                </Col>
                            </Row>
                            {pagePermissions[Ressource.PET_INFO].can_read && (
                                <AnimalInfoAccordion
                                    animal={formAnimal}
                                    species={species}
                                    sexes={sexes}
                                    isEditing={isEditing}
                                    canUpdate={!!pagePermissions[Ressource.PET_INFO]?.can_update}
                                    openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.INFO)?.id ?? ""}
                                    onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.INFO, id)}
                                    onAnimalChange={onAnimalChange}
                                />
                            )}
                            {pagePermissions[Ressource.PET_PICKUP].can_read && (
                                <AnimalPecAccordion
                                    animal={formAnimal}
                                    isEditing={isEditing}
                                    canUpdate={!!pagePermissions[Ressource.PET_PICKUP]?.can_update}
                                    openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.PEC)?.id ?? ""}
                                    onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.PEC, id)}
                                    onAnimalChange={onAnimalChange}
                                />
                            )}
                            {pagePermissions[Ressource.PET_HEALTH].can_read && (
                                <AnimalHealthAccordion
                                    animal={formAnimal}
                                    isEditing={isEditing}
                                    canUpdate={!!pagePermissions[Ressource.PET_HEALTH]?.can_update}
                                    openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.HEALTH)?.id ?? ""}
                                    onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.HEALTH, id)}
                                    onAnimalChange={onAnimalChange}
                                />
                            )}
                            {pagePermissions[Ressource.PET_BEHAVIOR].can_read && (
                                <AnimalBehaviourAccordion
                                    animal={formAnimal}
                                    isEditing={isEditing}
                                    canUpdate={!!pagePermissions[Ressource.PET_BEHAVIOR]?.can_update}
                                    openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.BEHAVIOUR)?.id ?? ""}
                                    onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.BEHAVIOUR, id)}
                                    onAnimalChange={onAnimalChange}
                                />
                            )}
                            {pagePermissions[Ressource.PET_EXIT].can_read && (
                                <AnimalExitAccordion
                                    animal={formAnimal}
                                    isEditing={isEditing}
                                    canUpdate={!!pagePermissions[Ressource.PET_EXIT]?.can_update}
                                    openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.EXIT)?.id ?? ""}
                                    onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.EXIT, id)}
                                    onAnimalChange={onAnimalChange}
                                />
                            )}
                            {pagePermissions[Ressource.PET_DEATH].can_read && (
                                <AnimalDeathAccordion
                                    animal={formAnimal}
                                    isEditing={isEditing}
                                    canUpdate={!!pagePermissions[Ressource.PET_DEATH]?.can_update}
                                    openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.DEATH)?.id ?? ""}
                                    onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.DEATH, id)}
                                    onAnimalChange={onAnimalChange}
                                />
                            )}
                        </CardBody>
                    </Card>
                </div>
            );
        }
    } else if (isAnimalPending && !animal) {
        content = <div>{t("common.loading")}</div>;
    } else if (isAnimalError || (animal === undefined && !isAnimalPending)) {
        content = <div>{t("animals.message.animalNotFound")}</div>;
    } else if (displayAnimal) {
        const canEditAny =
            pagePermissions[Ressource.PET_INFO].can_update ||
            pagePermissions[Ressource.PET_PICKUP].can_update ||
            pagePermissions[Ressource.PET_HEALTH].can_update ||
            pagePermissions[Ressource.PET_BEHAVIOR].can_update ||
            pagePermissions[Ressource.PET_DIFFUSION].can_update ||
            pagePermissions[Ressource.PET_EXIT].can_update ||
            pagePermissions[Ressource.PET_DEATH].can_update ||
            pagePermissions[Ressource.PET_HIST_VETO].can_update ||
            pagePermissions[Ressource.PET_HIST_HF].can_update;

        content = (
            <div>
                <Row className="justify-content-end">
                    <Col xs="auto">
                        {animalId !== "new" && isEditing && (
                            <Button color="danger" onClick={() => setShowDeleteConfirmationModal(true)}>
                                <MdDelete />
                            </Button>
                        )}
                        {!isEditing && canEditAny && (
                            <Button className="ms-2" color="primary" onClick={() => { setFormAnimal({ ...displayAnimal }); setIsEditing(true); }}>
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
                        <h2>{displayAnimal.name}</h2>
                    </CardHeader>
                    <CardBody>
                        {(animalId === "new" || isEditing) && (
                            <Row>
                                <Col xs={12}>
                                    <Label>{t("animals.table.name")}</Label>
                                    <Input
                                        value={displayAnimal.name || ""}
                                        disabled={!isEditing || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                        onChange={(evt) => onAnimalChange({ name: evt.target.value })}
                                    />
                                </Col>
                            </Row>
                        )}
                        <Row className="text-center">
                            <Col md={4} lg={3}>
                                <Label>{t("animals.detail.broadcastable")}</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={displayAnimal.broadcastable ?? null}
                                    disabled={!isEditing || displayAnimal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newValue) => onAnimalChange({ broadcastable: newValue ?? undefined })}
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>{t("animals.detail.reservable")}</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={displayAnimal.bookable ?? null}
                                    disabled={!isEditing || displayAnimal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newValue) => onAnimalChange({ bookable: newValue ?? undefined })}
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>{t("animals.detail.reserved")}</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={displayAnimal.reserved ?? null}
                                    disabled={!isEditing || displayAnimal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newValue) => onAnimalChange({ reserved: newValue ?? undefined })}
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>{t("animals.detail.needIcadDuplicate")}</Label>
                                <NullableDropdown
                                    withNewLine={true}
                                    color={
                                        displayAnimal.needIcadDuplicate == null ? "warning" :
                                        displayAnimal.needIcadDuplicate === "received" ? "success" :
                                        displayAnimal.needIcadDuplicate === "waiting" ? "info" : "danger"
                                    }
                                    value={displayAnimal.needIcadDuplicate}
                                    values={["no", "waiting", "received"]}
                                    valueDisplayName={(value) =>
                                        value == null ? t("common.nsp") :
                                        value === "received" ? t("animals.dropdown.icadReceived") :
                                        value === "waiting" ? t("animals.dropdown.icadWaiting") : t("animals.dropdown.icadNo")
                                    }
                                    valueActiveCheck={(value) => displayAnimal.needIcadDuplicate === value}
                                    key="needIcadDuplicate"
                                    disabled={!isEditing || displayAnimal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newNeedIcadDuplicate) => onAnimalChange({ needIcadDuplicate: newNeedIcadDuplicate })}
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>{t("animals.detail.adopted")}</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={displayAnimal.adopted ?? null}
                                    disabled={!isEditing || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newValue) => onAnimalChange({ adopted: newValue ?? undefined })}
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>{t("animals.detail.albumCreated")}</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={displayAnimal.albumCreated ?? null}
                                    disabled={!isEditing || displayAnimal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newValue) => onAnimalChange({ albumCreated: newValue ?? undefined })}
                                />
                            </Col>
                            <Col md={4} lg={3}>
                                <Label>{t("animals.detail.contractSent")}</Label>
                                <BooleanNullableDropdown
                                    withNewLine={true}
                                    value={displayAnimal.contractSent ?? null}
                                    disabled={!isEditing || displayAnimal.adopted || !pagePermissions[Ressource.PET_INFO]?.can_update}
                                    onChange={(newValue) => onAnimalChange({ contractSent: newValue ?? undefined })}
                                />
                            </Col>
                        </Row>
                        {pagePermissions[Ressource.PET_INFO].can_read && (
                            <AnimalInfoAccordion
                                animal={displayAnimal}
                                species={species}
                                sexes={sexes}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.PET_INFO]?.can_update}
                                openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.INFO)?.id ?? ""}
                                onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.INFO, id)}
                                onAnimalChange={onAnimalChange}
                            />
                        )}
                        {pagePermissions[Ressource.PET_PICKUP].can_read && (
                            <AnimalPecAccordion
                                animal={displayAnimal}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.PET_PICKUP]?.can_update}
                                openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.PEC)?.id ?? ""}
                                onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.PEC, id)}
                                onAnimalChange={onAnimalChange}
                            />
                        )}
                        {pagePermissions[Ressource.PET_HEALTH].can_read && (
                            <AnimalHealthAccordion
                                animal={displayAnimal}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.PET_HEALTH]?.can_update}
                                openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.HEALTH)?.id ?? ""}
                                onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.HEALTH, id)}
                                onAnimalChange={onAnimalChange}
                            />
                        )}
                        {pagePermissions[Ressource.PET_BEHAVIOR].can_read && (
                            <AnimalBehaviourAccordion
                                animal={displayAnimal}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.PET_BEHAVIOR]?.can_update}
                                openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.BEHAVIOUR)?.id ?? ""}
                                onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.BEHAVIOUR, id)}
                                onAnimalChange={onAnimalChange}
                            />
                        )}
                        {pagePermissions[Ressource.PET_EXIT].can_read && (
                            <AnimalExitAccordion
                                animal={displayAnimal}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.PET_EXIT]?.can_update}
                                openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.EXIT)?.id ?? ""}
                                onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.EXIT, id)}
                                onAnimalChange={onAnimalChange}
                            />
                        )}
                        {pagePermissions[Ressource.PET_DEATH].can_read && (
                            <AnimalDeathAccordion
                                animal={displayAnimal}
                                isEditing={isEditing}
                                canUpdate={!!pagePermissions[Ressource.PET_DEATH]?.can_update}
                                openId={accordions.find((a) => a.type === AnimalDetailPageAccordion.DEATH)?.id ?? ""}
                                onToggle={(id) => toggleAccordion(AnimalDetailPageAccordion.DEATH, id)}
                                onAnimalChange={onAnimalChange}
                            />
                        )}
                    </CardBody>
                </Card>
                <br />
                {pagePermissions[Ressource.PET_HIST_VETO].can_read && (
                    <VeterinarianInterventionsHistory animal={displayAnimal} />
                )}
                <br />
                {pagePermissions[Ressource.PET_HIST_HF].can_read && (
                    <HostFamiliesHistory animal={displayAnimal} />
                )}
            </div>
        );
    }

    return (
        <Page
            className="AnimalPage"
            title={t("animals.detailTitle")}
            breadcrumbs={[
                { name: t("animals.breadcrumbList"), to: "/animals", active: false } as CustomBreadcrumbItem,
                { name: t("animals.breadcrumbDetail"), active: true, to: null } as CustomBreadcrumbItem,
            ]}
        >
            {content}
            <DeleteConfirmationModal
                show={showDeleteConfirmationModal}
                handleClose={(confirmed) => {
                    setShowDeleteConfirmationModal(false);
                    if (confirmed) deleteA();
                }}
                bodyEntityName={t("animals.entityName")}
            />
        </Page>
    );
};
export default AnimalDetailPage;
