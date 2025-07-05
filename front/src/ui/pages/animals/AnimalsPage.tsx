import React, { FC, useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Input, Label, Row } from "reactstrap";
import { MdRefresh, MdAssignment, MdAddBox, MdFilterAlt } from "react-icons/md";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import AnimalsManager, { Sexe } from "../../../managers/animals.manager";
import Switch from "../../components/Switch";
import Dropdown from "../../components/Dropdown";
import UsersManager from "../../../managers/users.manager";
import SortableTable from "../../components/SortableTable";
import HostFamiliesManager from "../../../managers/hostFamilies.manager";
import { sortBy } from "../../../utils/sort";
import Animal from "../../../logic/entities/Animal";
import Species from "../../../logic/entities/Species";
import User from "../../../logic/entities/User";
import HostFamily from "../../../logic/entities/HostFamily";
import NotificationSystem from "react-notification-system";
import { useNavigate } from "react-router-dom";
import useGetPermissions from "../../../hooks/useGetPermissions";
import { Ressource } from "../../../logic/entities/Permissions";

class Filter {
    value: any;
    type: FilterType;

    constructor(value: any, type: FilterType) {
        this.value = value;
        this.type = type;
    }

    check(animal: Animal): boolean {
        return FilterType.check(this.type, this.value, animal);
    }
}

enum FilterType {
    ICAD_MISSING = "ICAD manquant",
    BROADCASTABLE = "Publiable",
    RESERVED = "Réservé·e",
    ADOPTED = "Adopté·e",
    DEAD = "Mort·e",
    SPECIES = "Espèce(s)",
    REFERENT = "Référent·e",
    NAME = "Nom",
}

namespace FilterType {
    export function check(filter: FilterType, value: any, animal: Animal): boolean {
        if (value === null || value === undefined) return true;
        switch (filter) {
            case FilterType.ICAD_MISSING:
                if (value === true) return animal.icad === null || animal.icad === "";
                return true;
            case FilterType.BROADCASTABLE:
                return animal.broadcastable === value;
            case FilterType.RESERVED:
                return animal.reserved === value;
            case FilterType.ADOPTED:
                return animal.adopted === value;
            case FilterType.DEAD:
                if (value === true) return animal.deathDate !== undefined;
                return animal.deathDate === undefined;
            case FilterType.SPECIES:
                return animal.species?.id === value;
            case FilterType.REFERENT:
                if (value instanceof User) return animal.currentHostFamilyReferentId === value.id;
                return true;
            case FilterType.NAME:
                if (typeof value === "string") return animal.name?.toLowerCase().includes(value.toLowerCase()) ?? false;
                return true;
        }
    }
}

interface AnimalsPageProps {}

class AnimalsPageData {
    animals: Animal[];
    sexes: Sexe[];
    species: Species[];
    referents: User[];
    hostFamilies: HostFamily[];

    constructor() {
        this.animals = [];
        this.sexes = [];
        this.species = [];
        this.referents = [];
        this.hostFamilies = [];
    }
}

const AnimalsPage: FC<AnimalsPageProps> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<AnimalsPageData>(new AnimalsPageData());

    const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
    const [filters, setFilters] = useState<Filter[]>(
        Object.values(FilterType)
            .map((ft) => {
                if (typeof ft !== "string") return null;
                var filterType = ft as FilterType;
                return new Filter(null, filterType);
            })
            .filter((f) => f !== null) as Filter[]
    );

    const [notificationSystem, setNotificationSystem] = useState<NotificationSystem | undefined>(undefined);

    const pagePermissions = useGetPermissions([Ressource.PET_LIST]);
    const navigate = useNavigate();

    const getSpecies = () => {
        return AnimalsManager.getSpecies()
            .then((species) => {
                return sortBy(species, "name") as Species[];
            })
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
                return [] as Species[];
            });
    };

    const getSexes = () => {
        return AnimalsManager.getSexes()
            .then((sexes) => {
                return sortBy(sexes, "name") as Sexe[];
            })
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
                return [] as Sexe[];
            });
    };

    const getAllAnimals = () => {
        return AnimalsManager.getAll()
            .then((animals) => {
                return sortBy(animals, "id") as Animal[];
            })
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
                return [] as Animal[];
            });
    };

    const getReferents = () => {
        return UsersManager.getAllReferents()
            .then((referents) => {
                return sortBy(referents, "displayName") as User[];
            })
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
                return [] as User[];
            });
    };

    const getHostFamilies = () => {
        return HostFamiliesManager.getAll()
            .then((hostFamilies) => {
                return sortBy(hostFamilies, "displayName") as HostFamily[];
            })
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
                return [] as HostFamily[];
            });
    };

    const showDetail = (animal: Animal) => {
        navigate(`/animals/${animal.id}`);
    };

    useEffect(() => {
        setIsLoading(true);
        Promise.all([getSexes(), getSpecies(), getReferents(), getHostFamilies(), getAllAnimals()]).then(
            ([sexes, species, referents, hostFamilies, animals]) => {
                setData({
                    sexes,
                    species,
                    referents,
                    hostFamilies,
                    animals,
                });
                setIsLoading(false);
            }
        );
    }, []);

    useEffect(() => {
        setFilteredAnimals(
            data.animals.filter((animal) => {
                return filters.every((f) => f.check(animal) === true);
            })
        );
    }, [data, filters]);

    const createAnimal = () => {
        navigate("/animals/new");
    };

    return (
        <Page
            className="AnimalsPage"
            title="Liste des Animaux"
            breadcrumbs={[{ name: "Animaux", active: true } as CustomBreadcrumbItem]}
            notificationSystemCallback={(notifSystem) => {
                setNotificationSystem(notifSystem);
            }}
        >
            <Row>
                <Col>
                    <Input
                        name="animal"
                        placeholder="Rechercher un animal"
                        value={filters.find((f) => f.type === FilterType.NAME)?.value ?? ""}
                        onChange={(e) =>
                            setFilters((previous) => previous.map((f) => (f.type === FilterType.NAME ? new Filter(e.target.value, FilterType.NAME) : f)))
                        }
                    />
                </Col>
                <Col xs={"auto"}>
                    {pagePermissions[Ressource.PET_LIST]?.can_create && (
                        <Button onClick={createAnimal} color={"success"}>
                            <MdAddBox />
                        </Button>
                    )}
                    <Button className="ms-2" onClick={getAllAnimals}>
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
                        <Col>
                            <Row>
                                <Col className="mb-0">
                                    <Label>Diffusable</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={filters.find((f) => f.type === FilterType.BROADCASTABLE)?.value}
                                        values={[true, false, null]}
                                        valueDisplayName={(value) => (value === null ? "Tous" : value === true ? "Diffusable" : "Non diffusable")}
                                        valueActiveCheck={(value) => filters.find((f) => f.type === FilterType.BROADCASTABLE)?.value === value}
                                        key={"broadcastable"}
                                        onChange={(value) => {
                                            setFilters((previous) =>
                                                previous.map((f) => (f.type === FilterType.BROADCASTABLE ? new Filter(value, FilterType.BROADCASTABLE) : f))
                                            );
                                        }}
                                    />
                                </Col>
                                <Col className="mb-0">
                                    <Label>Réservé·e</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={filters.find((f) => f.type === FilterType.RESERVED)?.value}
                                        values={[true, false, null]}
                                        valueDisplayName={(value) => (value === null ? "Tous" : value === true ? "Réservé·e" : "Non réservé·es")}
                                        valueActiveCheck={(value) => filters.find((f) => f.type === FilterType.RESERVED)?.value === value}
                                        key={"reserved"}
                                        onChange={(value) => {
                                            setFilters((previous) =>
                                                previous.map((f) => (f.type === FilterType.RESERVED ? new Filter(value, FilterType.RESERVED) : f))
                                            );
                                        }}
                                    />
                                </Col>
                                <Col className="mb-0">
                                    <Label>Adopté·e</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={filters.find((f) => f.type === FilterType.ADOPTED)?.value}
                                        values={[true, false, null]}
                                        valueDisplayName={(value) => (value === null ? "Tous" : value === true ? "Adopté·e" : "Non adopté·es")}
                                        valueActiveCheck={(value) => filters.find((f) => f.type === FilterType.ADOPTED)?.value === value}
                                        key={"adopted"}
                                        onChange={(value) => {
                                            setFilters((previous) =>
                                                previous.map((f) => (f.type === FilterType.ADOPTED ? new Filter(value, FilterType.ADOPTED) : f))
                                            );
                                        }}
                                    />
                                </Col>
                                <Col className="mb-0">
                                    <Label>Décédé·e</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={filters.find((f) => f.type === FilterType.DEAD)?.value}
                                        values={[true, false, null]}
                                        valueDisplayName={(value) => (value === null ? "Tous" : value === true ? "Décédé·e" : "Vivant·e")}
                                        valueActiveCheck={(value) => filters.find((f) => f.type === FilterType.DEAD)?.value === value}
                                        key={"dead"}
                                        onChange={(value) => {
                                            setFilters((previous) =>
                                                previous.map((f) => (f.type === FilterType.DEAD ? new Filter(value, FilterType.DEAD) : f))
                                            );
                                        }}
                                    />
                                </Col>
                                <Col className="mb-0">
                                    <Label>Espèce</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={data.species.find((aSpecies) => aSpecies.id === filters.find((f) => f.type === FilterType.SPECIES)?.value)}
                                        values={[...data.species, null]}
                                        valueDisplayName={(aSpecies) => (aSpecies === null ? "Toutes" : aSpecies?.name)}
                                        valueActiveCheck={(aSpecies) => aSpecies?.id === filters.find((f) => f.type === FilterType.SPECIES)?.value}
                                        key={"species"}
                                        onChange={(value) => {
                                            setFilters((previous) =>
                                                previous.map((f) => (f.type === FilterType.SPECIES ? new Filter(value?.id, FilterType.SPECIES) : f))
                                            );
                                        }}
                                    />
                                </Col>
                                <Col className="mb-0">
                                    <Label>Référent·e</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={data.referents.find((referent) => referent.id === filters.find((f) => f.type === FilterType.REFERENT)?.value)}
                                        values={[...data.referents, null]}
                                        valueDisplayName={(referent) => (referent === null ? "Tous·tes" : referent?.displayName)}
                                        valueActiveCheck={(referent) => referent?.id === filters.find((f) => f.type === FilterType.REFERENT)?.value}
                                        key={"referents"}
                                        onChange={(value) => {
                                            setFilters((previous) =>
                                                previous.map((f) => (f.type === FilterType.REFERENT ? new Filter(value, FilterType.REFERENT) : f))
                                            );
                                        }}
                                    />
                                </Col>
                                <Col className="mb-0">
                                    <Label>ICAD manquant</Label>
                                    <Switch
                                        disabled={false}
                                        isOn={filters.find((f) => f.type === FilterType.ICAD_MISSING)?.value}
                                        handleToggle={() => {
                                            setFilters((previous) =>
                                                previous.map((f) => (f.type === FilterType.ICAD_MISSING ? new Filter(!f.value, FilterType.ICAD_MISSING) : f))
                                            );
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <br />

            <Row>
                <Col xs={12} className="table-responsive">
                    <SortableTable
                        columns={[
                            { key: "name", value: "Nom", isMain: true },
                            { key: "sexe", value: "Sexe", isMain: false },
                            { key: "icad", value: "ICAD", isMain: false },
                            {
                                key: "birthdate",
                                value: "Date de naissance",
                                isMain: false,
                            },
                            {
                                key: "hostFamily",
                                value: "Famille d'acceuil",
                                isMain: false,
                            },
                            {
                                key: "pec_date",
                                value: "Date de PEC",
                                isMain: false,
                            },
                            {
                                key: "animal_detail",
                                value: "Fiche animal",
                                isMain: false,
                                sortable: false,
                            },
                        ]}
                        values={filteredAnimals.map((animal) => {
                            var hostFamily = data.hostFamilies.find((hf) => hf.id === animal.currentHostFamilyId);
                            return {
                                name: animal.name,
                                sexe: data.sexes.find((aSexe) => aSexe.key === animal.sexe)?.value || "",
                                icad: animal.icad,
                                birthdate: animal.birthdateObject.readable ?? animal.birthdate,
                                hostFamily: hostFamily?.displayName || "",
                                pec_date: animal.entryDateObject.readable ?? animal.entryDate,
                                animal_detail: (
                                    <Button color="info" onClick={() => showDetail(animal)}>
                                        <MdAssignment />
                                    </Button>
                                ),
                            };
                        })}
                        isLoading={isLoading}
                    />
                </Col>
            </Row>
        </Page>
    );
};
export default AnimalsPage;
