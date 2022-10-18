import Page from "../components/Page";
import React, { useEffect } from "react";
import { Button, Col, Input, Row, Table } from "reactstrap";
import VeterinariansManager from "../managers/veterinarians.manager";
import { useState } from "react";
import { MdRefresh, MdAssignment, MdPlusOne } from "react-icons/md";
import { sortBy } from "../utils/sort";

function VeterinariansPage({ ...props }) {
    const [veterinarians, setVeterinarians] = useState([]);
    const [filteredVeterinarians, setFilteredVeterinarians] = useState([]);
    const [searchText, setSearchText] = useState([]);

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );

    const getAllVeterinarians = () => {
        VeterinariansManager.getAll()
            .then((veterinarians) => {
                return sortBy(veterinarians || [], "id");
            })
            .then((veterinarians) => {
                setVeterinarians(veterinarians);
                setFilteredVeterinarians(veterinarians);
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

    useEffect(() => {
        getAllVeterinarians();
    }, []);

    useEffect(() => {
        setFilteredVeterinarians(
            veterinarians.filter((veterinarian) => {
                return veterinarian.name.includes(searchText);
            })
        );
    }, [searchText]);

    const showDetail = (veterinarian) => {
        console.log(
            `Should show veterinarian details for : ${veterinarian.name}`
        );
        props.history.push(`/veterinarians/${veterinarian.id}`);
    };

    const createVeterinarian = () => {
        props.history.push(`/veterinarians/new`);
    };

    return (
        <Page
            className="VeterinariansPage"
            title="Liste des Vétérinaires"
            breadcrumbs={[{ name: "Vétérinaires", active: true }]}
            notificationSystemCallback={(notifSystem) => {
                setNotificationSystem(notifSystem);
            }}
        >
            <Row>
                <Col>
                    <Input
                        name="name"
                        placeholder="Rechercher un vétérinaire"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Col>
                <Col xs={"auto"}>
                    <Button onClick={createVeterinarian} color={"success"}>
                        <MdPlusOne />
                    </Button>
                    <Button className="ml-2" onClick={getAllVeterinarians}>
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
                                <th scope="col">E-mail</th>
                                <th scope="col">Téléphone</th>
                                <th scope="col">Fiche vétérinaire</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVeterinarians.map((vet, index) => (
                                <tr key={index}>
                                    <th scope="row">{vet.name}</th>
                                    <td>{vet.mail}</td>
                                    <td>{vet.phone}</td>
                                    <td>
                                        <Button
                                            color="info"
                                            onClick={() => showDetail(vet)}
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
export default VeterinariansPage;
