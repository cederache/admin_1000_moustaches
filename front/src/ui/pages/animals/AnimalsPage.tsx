import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import toast from "react-hot-toast";
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
    const { t } = useTranslation();
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

    const pagePermissions = useGetPermissions([Ressource.PET_LIST]);
    const navigate = useNavigate();

    const getSpecies = () => {
        return AnimalsManager.getSpecies()
            .then((species) => {
                return sortBy(species, "name") as Species[];
            })
            .catch((err) => {
                console.error(err);
                toast.error(`${t("common.errorFetch")}\n${err}`);
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
                toast.error(`${t("common.errorFetch")}\n${err}`);
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
                toast.error(`${t("common.errorFetch")}\n${err}`);
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
                toast.error(`${t("common.errorFetch")}\n${err}`);
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
                toast.error(`${t("common.errorFetch")}\n${err}`);
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
            title={t("animals.listTitle")}
            breadcrumbs={[{ name: t("animals.breadcrumbList"), active: true } as CustomBreadcrumbItem]}
        >
            <Row>
                <Col>
                    <Input
                        name="animal"
                        placeholder={t("animals.searchPlaceholder")}
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
                                    <Label>{t("animals.filter.broadcastable")}</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={filters.find((f) => f.type === FilterType.BROADCASTABLE)?.value}
                                        values={[true, false, null]}
                                        valueDisplayName={(value) => (value === null ? t("common.all") : value === true ? t("animals.filter.broadcastableYes") : t("animals.filter.broadcastableNo"))}
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
                                    <Label>{t("animals.filter.reserved")}</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={filters.find((f) => f.type === FilterType.RESERVED)?.value}
                                        values={[true, false, null]}
                                        valueDisplayName={(value) => (value === null ? t("common.all") : value === true ? t("animals.filter.reservedYes") : t("animals.filter.reservedNo"))}
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
                                    <Label>{t("animals.filter.adopted")}</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={filters.find((f) => f.type === FilterType.ADOPTED)?.value}
                                        values={[true, false, null]}
                                        valueDisplayName={(value) => (value === null ? t("common.all") : value === true ? t("animals.filter.adoptedYes") : t("animals.filter.adoptedNo"))}
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
                                    <Label>{t("animals.filter.dead")}</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={filters.find((f) => f.type === FilterType.DEAD)?.value}
                                        values={[true, false, null]}
                                        valueDisplayName={(value) => (value === null ? t("common.all") : value === true ? t("animals.filter.deadYes") : t("animals.filter.alive"))}
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
                                    <Label>{t("animals.filter.species")}</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={data.species.find((aSpecies) => aSpecies.id === filters.find((f) => f.type === FilterType.SPECIES)?.value)}
                                        values={[...data.species, null]}
                                        valueDisplayName={(aSpecies) => (aSpecies === null ? t("animals.filter.speciesAll") : aSpecies?.name)}
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
                                    <Label>{t("animals.filter.referent")}</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={data.referents.find((referent) => referent.id === filters.find((f) => f.type === FilterType.REFERENT)?.value)}
                                        values={[...data.referents, null]}
                                        valueDisplayName={(referent) => (referent === null ? t("animals.filter.referentAll") : referent?.displayName)}
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
                                    <Label>{t("animals.filter.icadMissing")}</Label>
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
                            { key: "name", value: t("animals.table.name"), isMain: true },
                            { key: "sexe", value: t("animals.table.sex"), isMain: false },
                            { key: "icad", value: t("animals.table.icad"), isMain: false },
                            {
                                key: "birthdate",
                                value: t("animals.table.birthdate"),
                                isMain: false,
                            },
                            {
                                key: "hostFamily",
                                value: t("animals.table.hostFamily"),
                                isMain: false,
                            },
                            {
                                key: "pec_date",
                                value: t("animals.table.pecDate"),
                                isMain: false,
                            },
                            {
                                key: "animal_detail",
                                value: t("animals.table.animalSheet"),
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
