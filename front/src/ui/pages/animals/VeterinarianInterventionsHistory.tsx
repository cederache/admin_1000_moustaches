import React, { FC, useState } from "react";
import { MdAddBox, MdAssignment } from "react-icons/md";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Table,
} from "reactstrap";
import VeterinarianInterventionsManager from "../../../managers/veterinarianInterventions.manager";
import VeterinarianInterventionModal from "./VeterinarianInterventionModal";
import VeterinarianIntervention from "../../../logic/entities/VeterinarianIntervention";
import NotificationSystem from "react-notification-system";

interface VeterinarianInterventionsHistoryProps {
    animalId: number;
    veterinarianInterventions: VeterinarianIntervention[];
    notificationSystem: NotificationSystem | null;
    shouldRefresh: () => void;
}

const VeterinarianInterventionsHistory: FC<
    VeterinarianInterventionsHistoryProps
> = ({
    animalId,
    veterinarianInterventions,
    notificationSystem,
    shouldRefresh,
}) => {
    const [modalVeterinarianIntervention, setModalVeterinarianIntervention] =
        useState<VeterinarianIntervention | null>(null);
    const [
        showVeterinarianInterventionModal,
        setShowVeterinarianInterventionModal,
    ] = useState<boolean>(false);

    const showDetail = (veterinarianIntervention: VeterinarianIntervention) => {
        setModalVeterinarianIntervention(veterinarianIntervention);
        setShowVeterinarianInterventionModal(true);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <Row>
                        <Col>
                            <h3>Historique des interventions vétérinaires</h3>
                        </Col>
                        <Col xs={"auto"}>
                            <Button
                                color="primary"
                                onClick={() => {
                                    setModalVeterinarianIntervention(
                                        VeterinarianInterventionsManager.createVeterinarianIntervention()
                                    );
                                    setShowVeterinarianInterventionModal(true);
                                }}
                            >
                                <MdAddBox />
                            </Button>
                        </Col>
                    </Row>
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
                            {veterinarianInterventions
                                .sort((a, b) => {
                                    if (a.date === undefined) {
                                        return -1;
                                    } else if (b.date === undefined) {
                                        return 1;
                                    } else {
                                        return a.date < b.date
                                            ? -1
                                            : a.date > b.date
                                            ? 1
                                            : 0;
                                    }
                                })
                                .map((veterinarianIntervention, index) => (
                                    <tr>
                                        <th scope="row">
                                            {veterinarianIntervention.dateObject
                                                .readable ??
                                                veterinarianIntervention.date}
                                        </th>
                                        <td>
                                            {
                                                veterinarianIntervention.description
                                            }
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
                                ))}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>

            {modalVeterinarianIntervention !== null && (
                <VeterinarianInterventionModal
                    animalId={animalId}
                    veterinarianIntervention={modalVeterinarianIntervention}
                    show={showVeterinarianInterventionModal}
                    handleClose={(shouldReload) => {
                        setShowVeterinarianInterventionModal(false);
                        setModalVeterinarianIntervention(null);

                        if (shouldReload) {
                            shouldRefresh();
                        }
                    }}
                    notificationSystem={notificationSystem}
                />
            )}
        </>
    );
};

export default VeterinarianInterventionsHistory;
