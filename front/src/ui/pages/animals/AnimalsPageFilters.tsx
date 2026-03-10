import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
import { MdFilterAlt } from "react-icons/md";
import Switch from "../../components/Switch";
import Dropdown from "../../components/Dropdown";
import Animal from "../../../logic/entities/Animal";
import User from "../../../logic/entities/User";
import Species from "../../../logic/entities/Species";

export class Filter {
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

export enum FilterType {
    ICAD_MISSING = "ICAD manquant",
    BROADCASTABLE = "Publiable",
    RESERVED = "Réservé·e",
    ADOPTED = "Adopté·e",
    DEAD = "Mort·e",
    SPECIES = "Espèce(s)",
    REFERENT = "Référent·e",
    NAME = "Nom",
}

export namespace FilterType {
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

interface AnimalsPageFiltersProps {
    filters: Filter[];
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
    species: Species[] | undefined;
    referents: User[] | undefined;
}

const AnimalsPageFilters: FC<AnimalsPageFiltersProps> = ({ filters, setFilters, species, referents }) => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col xs="auto" className="mb-0 border-end">
                        <MdFilterAlt />
                    </Col>
                    <Col>
                        <Row>
                            <Col className="mb-0">
                                <Label>{t("animals.filter.broadcastable")}</Label>
                                <Dropdown
                                    withNewLine={true}
                                    color="primary"
                                    value={filters.find((f) => f.type === FilterType.BROADCASTABLE)?.value}
                                    values={[true, false, null]}
                                    valueDisplayName={(value) =>
                                        value === null
                                            ? t("common.all")
                                            : value === true
                                            ? t("animals.filter.broadcastableYes")
                                            : t("animals.filter.broadcastableNo")
                                    }
                                    valueActiveCheck={(value) => filters.find((f) => f.type === FilterType.BROADCASTABLE)?.value === value}
                                    key="broadcastable"
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
                                    color="primary"
                                    value={filters.find((f) => f.type === FilterType.RESERVED)?.value}
                                    values={[true, false, null]}
                                    valueDisplayName={(value) =>
                                        value === null ? t("common.all") : value === true ? t("animals.filter.reservedYes") : t("animals.filter.reservedNo")
                                    }
                                    valueActiveCheck={(value) => filters.find((f) => f.type === FilterType.RESERVED)?.value === value}
                                    key="reserved"
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
                                    color="primary"
                                    value={filters.find((f) => f.type === FilterType.ADOPTED)?.value}
                                    values={[true, false, null]}
                                    valueDisplayName={(value) =>
                                        value === null ? t("common.all") : value === true ? t("animals.filter.adoptedYes") : t("animals.filter.adoptedNo")
                                    }
                                    valueActiveCheck={(value) => filters.find((f) => f.type === FilterType.ADOPTED)?.value === value}
                                    key="adopted"
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
                                    color="primary"
                                    value={filters.find((f) => f.type === FilterType.DEAD)?.value}
                                    values={[true, false, null]}
                                    valueDisplayName={(value) =>
                                        value === null ? t("common.all") : value === true ? t("animals.filter.deadYes") : t("animals.filter.alive")
                                    }
                                    valueActiveCheck={(value) => filters.find((f) => f.type === FilterType.DEAD)?.value === value}
                                    key="dead"
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
                                    color="primary"
                                    value={species?.find((aSpecies) => aSpecies.id === filters.find((f) => f.type === FilterType.SPECIES)?.value)}
                                    values={[...(species ?? []), null]}
                                    valueDisplayName={(aSpecies) => (aSpecies === null ? t("animals.filter.speciesAll") : aSpecies?.name)}
                                    valueActiveCheck={(aSpecies) => aSpecies?.id === filters.find((f) => f.type === FilterType.SPECIES)?.value}
                                    key="species"
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
                                    color="primary"
                                    value={referents?.find((referent) => referent.id === filters.find((f) => f.type === FilterType.REFERENT)?.value)}
                                    values={[...(referents ?? []), null]}
                                    valueDisplayName={(referent) => (referent === null ? t("animals.filter.referentAll") : referent?.displayName)}
                                    valueActiveCheck={(referent) => referent?.id === filters.find((f) => f.type === FilterType.REFERENT)?.value}
                                    key="referents"
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
                                            previous.map((f) =>
                                                f.type === FilterType.ICAD_MISSING ? new Filter(!f.value, FilterType.ICAD_MISSING) : f
                                            )
                                        );
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default AnimalsPageFilters;
