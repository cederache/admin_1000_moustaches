import React, { FC, useState } from "react";
import { MdAddBox, MdAssignment, MdDelete } from "react-icons/md";
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import VeterinarianInterventionsManager from "../../../managers/veterinarianInterventions.manager";
import VeterinarianInterventionModal from "./VeterinarianInterventionModal";
import VeterinarianIntervention from "../../../logic/entities/VeterinarianIntervention";
import NotificationSystem from "react-notification-system";
import Animal from "../../../logic/entities/Animal";
import useGetPermissions from "../../../hooks/useGetPermissions";
import { Ressource } from "../../../logic/entities/Permissions";

interface VeterinarianInterventionsHistoryProps {
    animal: Animal;
    veterinarianInterventions: VeterinarianIntervention[];
    notificationSystem?: NotificationSystem;
    shouldRefresh: () => void;
}

const VeterinarianInterventionsHistory: FC<VeterinarianInterventionsHistoryProps> = ({
    animal,
    veterinarianInterventions,
    notificationSystem,
    shouldRefresh,
}) => {
    const [modalVeterinarianIntervention, setModalVeterinarianIntervention] = useState<VeterinarianIntervention | null>(null);

    const showDetail = (veterinarianIntervention: VeterinarianIntervention) => {
        setModalVeterinarianIntervention(veterinarianIntervention);
    };

    const deleteVeterinarianIntervention = (veterinarianIntervention: VeterinarianIntervention) => {
        VeterinarianInterventionsManager.delete(veterinarianIntervention)
            .then(() => {
                notificationSystem?.addNotification({
                    message: "Intervention vétérinaire supprimée",
                    level: "success",
                });
                shouldRefresh();
            })
            .catch((err) => {
                console.error(err);
                notificationSystem?.addNotification({
                    message: `Une erreur s'est produite pendant la suppression des données\n${err}`,
                    level: "error",
                });
            });
    };

    const pagePermissions = useGetPermissions([Ressource.PET_HIST_VETO]);

    return (
        <>
            <Card>
                <CardHeader>
                    <Row>
                        <Col>
                            <h3>Historique des interventions vétérinaires</h3>
                        </Col>
                        <Col xs={"auto"}>
                            {pagePermissions[Ressource.PET_HIST_VETO]?.can_create && (
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        if (!animal.id) {
                                            notificationSystem?.addNotification({
                                                message: "Sauvegardez d'abord l'animal avant d'enregistrer une intervention vétérinaire",
                                                level: "warning",
                                            });
                                            return;
                                        }
                                        setModalVeterinarianIntervention(VeterinarianInterventionsManager.createVeterinarianIntervention());
                                    }}
                                >
                                    <MdAddBox />
                                </Button>
                            )}
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody className="table-responsive">
                    <Table {...{ striped: true }}>
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Notes</th>
                                <th scope="col">Détail</th>
                                <th scope="col">Suppression</th>
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
                                        return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
                                    }
                                })
                                .map((veterinarianIntervention, index) => (
                                    <tr>
                                        <th scope="row">{veterinarianIntervention.dateObject.readable ?? veterinarianIntervention.date}</th>
                                        <td>{veterinarianIntervention.description}</td>
                                        <td>
                                            <Button color="info" onClick={() => showDetail(veterinarianIntervention)}>
                                                <MdAssignment />
                                            </Button>
                                        </td>
                                        <td>
                                            <Button color="danger" onClick={() => deleteVeterinarianIntervention(veterinarianIntervention)}>
                                                <MdDelete />
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
                    animal={animal}
                    veterinarianIntervention={modalVeterinarianIntervention}
                    show={modalVeterinarianIntervention !== null}
                    handleClose={(shouldReload) => {
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
