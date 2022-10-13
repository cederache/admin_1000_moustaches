import Page from "../components/Page";
import React, { useEffect } from "react";
import { Button, Col, Input, Row, Table } from "reactstrap";
import AnimalsManager from "../managers/animals.manager";
import { useState } from "react";
import { MdRefresh, MdAssignment } from "react-icons/md";
import { sortBy } from "../utils/sort";

function AnimalsPage({ ...props }) {
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [searchText, setSearchText] = useState([]);

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
            animals.filter((animal) => {
                return animal.name.includes(searchText);
            })
        );
    }, [searchText]);

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
                    <Button onClick={getAllAnimals}>
                        <MdRefresh />
                    </Button>
                </Col>
            </Row>

            <br />

            <Row>
                <Col xs={12}>
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
