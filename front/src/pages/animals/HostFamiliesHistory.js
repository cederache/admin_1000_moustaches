import React from "react";
import { MdAssignment } from "react-icons/md";
import { Button, Card, CardBody, CardHeader, Table } from "reactstrap";

function HostFamiliesHistory({ animalToHostFamilies, ...props }) {
    const showDetail = (animalToHostFamily) => {
        props.history.push(
            `/hostFamilies/${animalToHostFamily.host_family_id}`
        );
    };

    return (
        <Card>
            <CardHeader>
                <h3>Historique des Familles d'Accueil</h3>
            </CardHeader>
            <CardBody className="table-responsive">
                <Table {...{ striped: true }}>
                    <thead>
                        <tr>
                            <th scope="col">Nom Prénom</th>
                            <th scope="col">Date d'entrée</th>
                            <th scope="col">Date de sortie</th>
                            <th scope="col">Fiche de la FA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {animalToHostFamilies.map(
                            (animalToHostFamily, index) => (
                                <tr>
                                    <th scope="row">
                                        {animalToHostFamily.display_name}
                                    </th>
                                    <td>
                                        {
                                            animalToHostFamily.entry_date_object
                                                .readable
                                        }
                                    </td>
                                    <td>
                                        {
                                            animalToHostFamily.exit_date_object
                                                .readable
                                        }
                                    </td>
                                    <td>
                                        <Button
                                            color="info"
                                            onClick={() =>
                                                showDetail(animalToHostFamily)
                                            }
                                        >
                                            <MdAssignment />
                                        </Button>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
}
export default HostFamiliesHistory;
