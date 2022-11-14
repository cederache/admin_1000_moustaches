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

/*eslint no-unused-expressions: "off"*/

function AnimalsPage({ ...props }) {
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [searchText, setSearchText] = useState([]);
    const [filters, setFilters] = useState([
        {
            activated: false,
            name: "Adopté.e.s",
            check: function (animal) {
                return animal.adopted === 1;
            },
        },
        {
            activated: false,
            name: "ICAD manquant",
            check: function (animal) {
                return animal.icad === null || animal.icad === "";
            },
        },
    ]);

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );

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
                    message:
                        "Une erreur s'est produite pendant la récupération des données",
                    level: "error",
                });
            });
    };

    const showDetail = (animal) => {
        props.history.push(`/animals/${animal.id}`);
    };

    useEffect(() => {
        getAllAnimals();
    }, []);

    useEffect(() => {
        setFilteredAnimals(
            animals.filter(
                (animal) =>
                    filters.every((f) =>
                        f.activated == true ? f.check(animal) === true : true
                    ) && animal.name.includes(searchText)
            )
        );
    }, [searchText, filters]);

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
                    </Row>
                </CardBody>
            </Card>

            <br />

            <Row>
                <Col xs={12} className="table-responsive">
                    <Table {...{ striped: true }}>
                        <thead>
                            <tr>
                                <th scope="col">Nom</th>
                                <th scope="col">Sexe</th>
                                <th scope="col">ICAD</th>
                                <th scope="col">Date de naissance</th>
                                <th scope="col">Date de PEC</th>
                                <th scope="col">Fiche animal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAnimals.map((animal, index) => (
                                <tr key={index}>
                                    <th scope="row">{animal.name}</th>
                                    <td>{animal.sexe}</td>
                                    <td>{animal.icad}</td>
                                    <td>{animal.readable_birth_date}</td>
                                    <td>{animal.readable_entry_date}</td>
                                    <td>
                                        <Button
                                            color="info"
                                            onClick={() => showDetail(animal)}
                                        >
                                            <MdAssignment />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Page>
    );
}
export default AnimalsPage;
