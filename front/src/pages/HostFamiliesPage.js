import Page from "components/Page";
import React, { useEffect } from "react";
import { Button, Col, Input, Row, Table } from "reactstrap";
import HostFamiliesManager from "../managers/hostFamilies.manager";
import { useState } from "react";
import { MdRefresh, MdAssignment } from "react-icons/md";
import { sortBy } from "../utils/sort";

function HostFamiliesPage() {
    const [hostFamilies, setHostFamilies] = useState([]);
    const [filteredHostFamilies, setFilteredHostFamilies] = useState([]);
    const [searchText, setSearchText] = useState([]);

    const getAllHostFamilies = () => {
        HostFamiliesManager.getAll()
            .then((hostFamily) => {
                return sortBy(hostFamily || [], "id");
            })
            .then((hostFamilies) => {
                setHostFamilies(hostFamilies);
                setFilteredHostFamilies(hostFamilies);
            });
    };

    const showDetail = (hostFamily) => {
        console.log(`Should show host family details for : ${hostFamily.name}`);
        window.location.assign(`/hostFamilies/${hostFamily.id}`);
    };

    useEffect(() => {
        getAllHostFamilies();
    }, []);

    useEffect(() => {
        setFilteredHostFamilies(
            hostFamilies.filter((hostFamily) => {
                return hostFamily.name.includes(searchText);
            })
        );
    }, [searchText]);

    return (
        <Page
            className="HostFamiliesPage"
            title="Liste des Familles d'Accueil"
            breadcrumbs={[{ name: "Familles d'Accueil", active: true }]}
        >
            <Row>
                <Col xs={10}>
                    <Input
                        name="hostFamily"
                        placeholder="Rechercher une Famille d'Accueil"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Col>
                <Col xs={{ span: 1, offset: 1 }}>
                    <Button onClick={getAllHostFamilies}>
                        <MdRefresh />
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Table {...{ striped: true }}>
                        <thead>
                            <tr>
                                <th scope="col">Nom Prénom</th>
                                <th scope="col">Téléphone</th>
                                <th scope="col">E-mail</th>
                                <th scope="col">Fiche de la FA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHostFamilies.map((hostFamily, index) => (
                                <tr>
                                    <th scope="row">
                                        <span>
                                            {hostFamily.firstname}{" "}
                                            {hostFamily.name}
                                        </span>
                                    </th>
                                    <td>{hostFamily.phone}</td>
                                    <td>{hostFamily.mail}</td>
                                    <td>
                                        <Button
                                            color="info"
                                            onClick={() =>
                                                showDetail(hostFamily)
                                            }
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
export default HostFamiliesPage;
