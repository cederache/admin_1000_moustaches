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
    Table,
} from "reactstrap";
import AnimalsManager from "../../managers/animals.manager";
import { useState } from "react";
import { MdRefresh, MdAssignment, MdAddBox, MdFilterAlt } from "react-icons/md";
import { sortBy } from "../../utils/sort";
import Switch from "../../components/Switch";
import Dropdown from "../../components/Dropdown";
import UsersManager from "../../managers/users.manager";
import SortableTable from "../../components/SortableTable";

/*eslint no-unused-expressions: "off"*/

function AnimalsPage({ ...props }) {
    const [animals, setAnimals] = useState([]);
    const [sexes, setSexes] = useState([]);
    const [species, setSpecies] = useState([]);
    const [referents, setReferents] = useState([]);

    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [searchText, setSearchText] = useState([]);
    const [filters, setFilters] = useState([
        {
            activated: false,
            name: "ICAD manquant",
            check: function (animal) {
                return animal.icad === null || animal.icad === "";
            },
        },
    ]);
    const [filterAdopted, setFilterAdopted] = useState();
    const [filterSpecies, setFilterSpecies] = useState();
    const [filterReferent, setFilterReferent] = useState();

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );

    const getSpecies = () => {
        return AnimalsManager.getSpecies()
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
        getSexes().then(getSpecies).then(getReferents).then(getAllAnimals);
    }, []);

    useEffect(() => {
        setFilteredAnimals(
            animals.filter(
                (animal) =>
                    filters.every((f) =>
                        f.activated === true ? f.check(animal) === true : true
                    ) &&
                    animal.name.includes(searchText) &&
                    (filterAdopted === undefined
                        ? true
                        : animal.adopted === filterAdopted) &&
                    (filterSpecies === undefined
                        ? true
                        : animal.species_id === filterSpecies?.id) &&
                    (filterReferent === undefined
                        ? true
                        : animal.current_host_family_referent_id ===
                          filterReferent?.id)
            )
        );
    }, [
        animals,
        searchText,
        filters,
        filterAdopted,
        filterSpecies,
        filterReferent,
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
                                                    f.name === filter.name
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
                                onChange={(newAdopted) => {
                                    setFilterAdopted(newAdopted);
                                }}
                            />
                        </Col>
                        <Col className="mb-0">
                            <Label>Espèce</Label>
                            <Dropdown
                                withNewLine={true}
                                color={"primary"}
                                value={species.find(
                                    (aSpecies) =>
                                        aSpecies.id === filterSpecies?.id
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
                                onChange={(newSpecies) =>
                                    setFilterSpecies(newSpecies)
                                }
                            />
                        </Col>
                        <Col className="mb-0">
                            <Label>Référent·e</Label>
                            <Dropdown
                                withNewLine={true}
                                color={"primary"}
                                value={referents.find(
                                    (referent) =>
                                        referent.id === filterReferent?.id
                                )}
                                values={[...referents, undefined]}
                                valueDisplayName={(referent) =>
                                    referent === undefined
                                        ? "Tous·tes"
                                        : `${referent?.firstname} ${referent?.name}`
                                }
                                valueActiveCheck={(referent) =>
                                    referent?.id === filterReferent?.id
                                }
                                key={"referents"}
                                onChange={(newReferent) =>
                                    setFilterReferent(newReferent)
                                }
                            />
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
                                key: "pec_date",
                                value: "Date de PEC",
                                isMain: false,
                            },
                            {
                                key: "animal_detail",
                                value: "Fiche animal",
                                isMain: false,
                                sortable: false
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
                    />
                </Col>
            </Row>
        </Page>
    );
}
export default AnimalsPage;
