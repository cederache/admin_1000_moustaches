import Page from "components/Page";
import React, { useEffect } from "react";
import { Button, Col, Input, Row, Table } from "reactstrap";
import VeterinariansManager from "../managers/veterinarians.manager";
import { useState } from "react";
import { MdRefresh, MdAssignment } from "react-icons/md";
import { sortBy } from "../utils/sort";

function VeterinariansPage() {
    const [veterinarians, setVeterinarians] = useState([]);
    const [filteredVeterinarians, setFilteredVeterinarians] = useState([]);
    const [searchText, setSearchText] = useState([]);

    const getAllVeterinarians = () => {
        VeterinariansManager.getAll()
            .then((veterinarians) => {
                return sortBy(veterinarians || [], "id");
            })
            .then((veterinarians) => {
                setVeterinarians(veterinarians);
                setFilteredVeterinarians(veterinarians);
            });
    };

    const showDetail = (veterinarian) => {
        console.log(
            `Should show veterinarian details for : ${veterinarian.name}`
        );
        window.location.assign(`/veterinarians/${veterinarian.id}`);
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

    return (
        <Page
            className="VeterinariansPage"
            title="Liste des vétérinaires"
            breadcrumbs={[{ name: "Vétérinaires", active: true }]}
        >
            <Row>
                <Col xs={10}>
                    <Input
                        name="name"
                        placeholder="Rechercher un vétérinaire"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Col>
                <Col xs={{ span: 1, offset: 1 }}>
                    <Button onClick={getAllVeterinarians}>
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
                                <tr>
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
