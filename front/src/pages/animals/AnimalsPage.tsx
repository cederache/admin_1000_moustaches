import React, { FC, useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Input, Label, Row } from "reactstrap";
import { MdRefresh, MdAssignment, MdAddBox, MdFilterAlt } from "react-icons/md";
import Page, { CustomBreadcrumbItem } from "../../components/Page";
import AnimalsManager, { Sexe } from "../../managers/animals.manager";
import Switch from "../../components/Switch";
import Dropdown from "../../components/Dropdown";
import UsersManager from "../../managers/users.manager";
import SortableTable from "../../components/SortableTable";
import HostFamiliesManager from "../../managers/hostFamilies.manager";
import { sortBy } from "../../utils/sort";
import Animal from "../../entities/Animal";
import Species from "../../entities/Species";
import User from "../../entities/User";
import HostFamily from "../../entities/HostFamily";
import NotificationSystem from "react-notification-system";
import { useHistory } from "react-router-dom";

interface Filter {
    activated: boolean;
    name: string;
    check: (animal: Animal) => boolean;
}

interface AnimalsPageProps {}

const AnimalsPage: FC<AnimalsPageProps> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [sexes, setSexes] = useState<Sexe[]>([]);
    const [species, setSpecies] = useState<Species[]>([]);
    const [referents, setReferents] = useState<User[]>([]);
    const [hostFamilies, setHostFamilies] = useState<HostFamily[]>([]);

    const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [filters, setFilters] = useState<Filter[]>([
        {
            activated: false,
            name: "ICAD manquant",
            check: (animal: Animal) => {
                return animal.icad === null || animal.icad === "";
            },
        },
    ]);
    const [filterBroadcastable, setFilterBroadcastable] = useState<
        boolean | null
    >(null);
    const [filterReserved, setFilterReserved] = useState<boolean | undefined>();
    const [filterAdopted, setFilterAdopted] = useState<boolean | undefined>();
    const [filterDead, setFilterDead] = useState<number>(0);
    const [filterSpecies, setFilterSpecies] = useState<Species | undefined>();
    const [filterReferent, setFilterReferent] = useState<User | undefined>();

    const [notificationSystem, setNotificationSystem] =
        useState<NotificationSystem | null>(null);

    const history = useHistory();

    const getSpecies = () => {
        return AnimalsManager.getSpecies()
            .then((species) => {
                return sortBy(species, "name") as Species[];
            })
            .then(setSpecies)
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const getSexes = () => {
        return AnimalsManager.getSexes()
            .then((sexes) => {
                return sortBy(sexes, "name") as Sexe[];
            })
            .then(setSexes)
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const getAllAnimals = () => {
        AnimalsManager.getAll()
            .then((animals) => {
                return sortBy(animals, "id") as Animal[];
            })
            .then((animals) => {
                setAnimals(animals);
                setFilteredAnimals(animals);
            })
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
            .then((referents) => {
                return sortBy(referents, "display_name") as User[];
            })
            .then(setReferents)
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const getHostFamilies = () => {
        setHostFamilies([]);
        return HostFamiliesManager.getAll()
            .then(setHostFamilies)
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const showDetail = (animal: Animal) => {
        history.push(`/animals/${animal.id}`);
    };

    useEffect(() => {
        setIsLoading(true);
        getSexes()
            .then(getSpecies)
            .then(getReferents)
            .then(getHostFamilies)
            .then(getAllAnimals)
            .then(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        setFilteredAnimals(
            animals.filter((animal) => {
                return (
                    filters.every((f) =>
                        f.activated === true ? f.check(animal) === true : true
                    ) &&
                    animal.name
                        ?.toLowerCase()
                        .includes(searchText.toLowerCase()) &&
                    (filterBroadcastable === undefined
                        ? true
                        : animal.broadcastable === filterBroadcastable) &&
                    (filterReserved === undefined
                        ? true
                        : animal.reserved === filterReserved) &&
                    (filterAdopted === undefined
                        ? true
                        : animal.adopted === filterAdopted) &&
                    (filterSpecies === undefined
                        ? true
                        : animal.species_id === filterSpecies?.id) &&
                    (filterReferent === undefined
                        ? true
                        : animal.current_host_family_referent_id ===
                          filterReferent?.id) &&
                    (filterDead === undefined
                        ? true
                        : filterDead === 0
                        ? animal.death_date === undefined
                        : animal.death_date !== undefined)
                );
            })
        );
    }, [
        animals,
        searchText,
        filters,
        filterBroadcastable,
        filterReserved,
        filterAdopted,
        filterSpecies,
        filterReferent,
        filterDead,
    ]);

    const createAnimal = () => {
        history.push("animals/new");
    };

    return (
        <Page
            className="AnimalsPage"
            title="Liste des Animaux"
            breadcrumbs={[
                { name: "Animaux", active: true } as CustomBreadcrumbItem,
            ]}
            notificationSystemCallback={(notifSystem) => {
                setNotificationSystem(notifSystem);
            }}
        >
            <Row>
                <Col>
                    <Input
                        name="animal"
                        placeholder="Rechercher un animal"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Col>
                <Col xs={"auto"}>
                    <Button onClick={createAnimal} color={"success"}>
                        <MdAddBox />
                    </Button>
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
                                        value={filterBroadcastable}
                                        values={[1, 0, undefined]}
                                        valueDisplayName={(value) =>
                                            value === undefined
                                                ? "Tous"
                                                : value === 1
                                                ? "Diffusable"
                                                : "Non diffusable"
                                        }
                                        valueActiveCheck={(value) =>
                                            filterBroadcastable === value
                                        }
                                        key={"broadcastable"}
                                        onChange={setFilterBroadcastable}
                                    />
                                </Col>
                                <Col className="mb-0">
                                    <Label>Réservé·e</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={filterReserved}
                                        values={[1, 0, undefined]}
                                        valueDisplayName={(value) =>
                                            value === undefined
                                                ? "Tous"
                                                : value === 1
                                                ? "Réservé·e"
                                                : "Non réservé·es"
                                        }
                                        valueActiveCheck={(value) =>
                                            filterReserved === value
                                        }
                                        key={"reserved"}
                                        onChange={setFilterReserved}
                                    />
                                </Col>
                                <Col className="mb-0">
                                    <Label>Adopté·e</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={filterAdopted}
                                        values={[1, 0, undefined]}
                                        valueDisplayName={(value) =>
                                            value === undefined
                                                ? "Tous"
                                                : value === 1
                                                ? "Adopté·e"
                                                : "Non adopté·es"
                                        }
                                        valueActiveCheck={(value) =>
                                            filterAdopted === value
                                        }
                                        key={"adopted"}
                                        onChange={setFilterAdopted}
                                    />
                                </Col>
                                <Col className="mb-0">
                                    <Label>Décédé·e</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={filterDead}
                                        values={[1, 0, undefined]}
                                        valueDisplayName={(value) =>
                                            value === undefined
                                                ? "Tous"
                                                : value === 1
                                                ? "Décédé·e"
                                                : "Vivant·e"
                                        }
                                        valueActiveCheck={(value) =>
                                            filterDead === value
                                        }
                                        key={"dead"}
                                        onChange={setFilterDead}
                                    />
                                </Col>
                                <Col className="mb-0">
                                    <Label>Espèce</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={species.find(
                                            (aSpecies) =>
                                                aSpecies.id ===
                                                filterSpecies?.id
                                        )}
                                        values={[...species, undefined]}
                                        valueDisplayName={(aSpecies) =>
                                            aSpecies === undefined
                                                ? "Toutes"
                                                : aSpecies?.name
                                        }
                                        valueActiveCheck={(aSpecies) =>
                                            aSpecies?.id === filterSpecies?.id
                                        }
                                        key={"species"}
                                        onChange={setFilterSpecies}
                                    />
                                </Col>
                                <Col className="mb-0">
                                    <Label>Référent·e</Label>
                                    <Dropdown
                                        withNewLine={true}
                                        color={"primary"}
                                        value={referents.find(
                                            (referent) =>
                                                referent.id ===
                                                filterReferent?.id
                                        )}
                                        values={[...referents, undefined]}
                                        valueDisplayName={(referent) =>
                                            referent === undefined
                                                ? "Tous·tes"
                                                : referent?.display_name
                                        }
                                        valueActiveCheck={(referent) =>
                                            referent?.id === filterReferent?.id
                                        }
                                        key={"referents"}
                                        onChange={setFilterReferent}
                                    />
                                </Col>
                                {filters.map((filter) => {
                                    return (
                                        <Col className="mb-0">
                                            <Label>{filter.name}</Label>
                                            <Switch
                                                id={filter.name}
                                                disabled={false}
                                                isOn={filter.activated}
                                                handleToggle={() => {
                                                    setFilters((previous) =>
                                                        previous.map((f) =>
                                                            f.name ===
                                                            filter.name
                                                                ? {
                                                                      ...f,
                                                                      activated:
                                                                          !f.activated,
                                                                  }
                                                                : f
                                                        )
                                                    );
                                                }}
                                            />
                                        </Col>
                                    );
                                })}
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
                            var hostFamily = hostFamilies.find(
                                (hf) => hf.id == animal.current_host_family_id
                            );
                            return {
                                name: animal.name,
                                sexe:
                                    sexes.find(
                                        (aSexe) => aSexe.key === animal.sexe
                                    )?.value || "",
                                icad: animal.icad,
                                birthdate:
                                    animal.birthdateObject.readable ??
                                    animal.birthdate,
                                hostFamily: hostFamily?.displayName || "",
                                pec_date:
                                    animal.entry_dateObject.readable ??
                                    animal.entry_date,
                                animal_detail: (
                                    <Button
                                        color="info"
                                        onClick={() => showDetail(animal)}
                                    >
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
