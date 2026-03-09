import React, { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Input, Row } from "reactstrap";
import { MdRefresh, MdAssignment, MdAddBox } from "react-icons/md";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import SortableTable from "../../components/SortableTable";
import Animal from "../../../logic/entities/Animal";
import { useNavigate } from "react-router-dom";
import useGetPermissions from "../../../api/hooks/useGetPermissions";
import { Ressource } from "../../../logic/entities/Permissions";
import { useAnimals } from "../../../api/hooks/animals/useAnimals";
import { useSpecies } from "../../../api/hooks/animals/useSpecies";
import { useSexes } from "../../../api/hooks/animals/useSexes";
import { useReferents } from "../../../api/hooks/users/useReferents";
import { useHostFamilies } from "../../../api/hooks/hostFamilies/useHostFamilies";
import AnimalsPageFilters, { Filter, FilterType } from "./AnimalsPageFilters";

interface AnimalsPageProps {}

const AnimalsPage: FC<AnimalsPageProps> = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const pagePermissions = useGetPermissions([Ressource.PET_LIST]);

    const { data: animals, isPending: isAnimalsPending, isError: isAnimalsError, refetch: refetchAnimals } = useAnimals();
    const { data: species, isPending: isSpeciesPending, isError: isSpeciesError, refetch: refetchSpecies } = useSpecies();
    const { data: sexes, isPending: isSexesPending, isError: isSexesError, refetch: refetchSexes } = useSexes();
    const { data: referents, isPending: isReferentsPending, isError: isReferentsError, refetch: refetchReferents } = useReferents();
    const { data: hostFamilies, isPending: isHostFamiliesPending, isError: isHostFamiliesError, refetch: refetchHostFamilies } = useHostFamilies();

    const isLoading = isAnimalsPending || isSpeciesPending || isSexesPending || isReferentsPending || isHostFamiliesPending;

    const [filters, setFilters] = useState<Filter[]>(
        Object.values(FilterType)
            .map((ft) => {
                if (typeof ft !== "string") return null;
                var filterType = ft as FilterType;
                return new Filter(null, filterType);
            })
            .filter((f) => f !== null) as Filter[]
    );

    const filteredAnimals = useMemo(() => animals?.filter((animal) => filters.every((f) => f.check(animal) === true)) ?? [], [animals, filters]);

    const showDetail = (animal: Animal) => {
        navigate(`/animals/${animal.id}`);
    };

    const refetchAll = () => {
        refetchAnimals();
        refetchSpecies();
        refetchSexes();
        refetchReferents();
        refetchHostFamilies();
    };

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
                    <Button className="ms-2" onClick={refetchAll}>
                        <MdRefresh />
                    </Button>
                </Col>
            </Row>
            <AnimalsPageFilters filters={filters} setFilters={setFilters} species={species} referents={referents} />

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
                            var hostFamily = hostFamilies?.find((hf) => hf.id === animal.currentHostFamilyId);
                            return {
                                name: animal.name,
                                sexe: sexes?.find((aSexe) => aSexe.key === animal.sexe)?.value || "",
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
