import Page from "../../components/Page";
import React, { useEffect } from "react";
import {
    Button,
    Card,
    CardBody,
    Col,
    Input,
    Label,
    Row,
} from "reactstrap";
import AnimalsManager from "../../managers/animals.manager";
import { useState } from "react";
import { MdRefresh, MdAssignment, MdAddBox, MdFilterAlt } from "react-icons/md";
import { sortBy } from "../../utils/sort";
import Switch from "../../components/Switch";
import Dropdown from "../../components/Dropdown";
import UsersManager from "../../managers/users.manager";
import SortableTable from "../../components/SortableTable";
import HostFamiliesManager from "../../managers/hostFamilies.manager";

/*eslint no-unused-expressions: "off"*/

function AnimalsPage({ ...props }) {
    const [isLoading, setIsLoading] = useState(false);
    const [animals, setAnimals] = useState([]);
    const [sexes, setSexes] = useState([]);
    const [species, setSpecies] = useState([]);
    const [referents, setReferents] = useState([]);
    const [hostFamilies, setHostFamilies] = useState([]);

    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filters, setFilters] = useState([
        {
            activated: false,
            name: "ICAD manquant",
            check: function (animal) {
                return animal.icad === null || animal.icad === "";
            },
        },
    ]);
    const [filterBroadcastable, setFilterBroadcastable] = useState();
    const [filterReserved, setFilterReserved] = useState();
    const [filterAdopted, setFilterAdopted] = useState();
    const [filterDead, setFilterDead] = useState(0);
    const [filterSpecies, setFilterSpecies] = useState();
    const [filterReferent, setFilterReferent] = useState();

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );

    const getSpecies = () => {
        return AnimalsManager.getSpecies()
            .then((species) => {
                return sortBy(species || [], "name");
            })
            .then(setSpecies)
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const getSexes = () => {
        return AnimalsManager.getSexes()
            .then(setSexes)
            .then((sexes) => {
                return sortBy(sexes || [], "name");
            })
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const getAllAnimals = () => {
        AnimalsManager.getAll()
            .then((animals) => {
                return sortBy(animals || [], "id");
            })
            .then((animals) => {
                setAnimals(animals);
                setFilteredAnimals(animals);
            })
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const getReferents = () => {
        setReferents([]);
        return UsersManager.getAllReferents()
            .then(setReferents)
            .then((referents) => {
                return sortBy(referents || [], "display_name");
            })
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
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
                notificationSystem.addNotification({
                    message: `Une erreur s'est produite pendant la récupération des données\n${err}`,
                    level: "error",
                });
            });
    };

    const showDetail = (animal) => {
        props.history.push(`/animals/${animal.id}`);
    };

    useEffect(() => {
        setIsLoading(true);
        getSexes().then(getSpecies).then(getReferents).then(getHostFamilies).then(getAllAnimals).then(() => {
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
                    animal.name.toLowerCase().includes(searchText.toLowerCase()) &&
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
                            ? animal.death_date_object.input === undefined
                            : animal.death_date_object.input !== undefined)
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
        props.history.push("animals/new");
    };

    return (
        <Page
            className="AnimalsPage"
            title="Liste des Animaux"
            breadcrumbs={[{ name: "Animaux", active: true }]}
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
                            return {
                                name: animal.name,
                                sexe:
                                    sexes.find(
                                        (aSexe) => aSexe.key === animal.sexe
                                    )?.value || "",
                                icad: animal.icad,
                                birthdate: animal.readable_birth_date,
                                hostFamily:
                                    hostFamilies.find(
                                        (aHF) => aHF.id === animal.current_host_family_id
                                    )?.display_name || "",
                                pec_date: animal.readable_entry_date,
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
}
export default AnimalsPage;
