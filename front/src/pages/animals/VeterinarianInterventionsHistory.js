import React from "react";
import { MdAssignment } from "react-icons/md";
import { Button, Card, CardBody, CardHeader, Table } from "reactstrap";

function VeterinarianInterventionsHistory({
    veterinarianInterventions,
    ...props
}) {
    const showDetail = (veterinarianIntervention) => {
        console.log("Show vet inter detail", veterinarianIntervention);
    };

    return (
        <Card>
            <CardHeader>
                <h3>Historique des interventions vétérinaires</h3>
            </CardHeader>
            <CardBody className="table-responsive">
                <Table {...{ striped: true }}>
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Notes</th>
                            <th scope="col">Voir plus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {veterinarianInterventions.map(
                            (veterinarianIntervention, index) => (
                                <tr>
                                    <th scope="row">
                                        {
                                            veterinarianIntervention.date_object
                                                .readable
                                        }
                                    </th>
                                    <td>
                                        {veterinarianIntervention.description}
                                    </td>
                                    <td>
                                        <Button
                                            color="info"
                                            onClick={() =>
                                                showDetail(
                                                    veterinarianIntervention
                                                )
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
export default VeterinarianInterventionsHistory;
