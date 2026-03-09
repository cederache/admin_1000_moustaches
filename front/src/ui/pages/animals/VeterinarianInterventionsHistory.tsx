import React, { FC, useEffect, useState } from "react";
import { MdAddBox, MdAssignment, MdDelete } from "react-icons/md";
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import VeterinarianInterventionsManager from "../../../managers/veterinarianInterventions.manager";
import VeterinarianInterventionModal from "./VeterinarianInterventionModal";
import VeterinarianIntervention from "../../../logic/entities/VeterinarianIntervention";
import toast from "react-hot-toast";
import Animal from "../../../logic/entities/Animal";
import useGetPermissions from "../../../hooks/useGetPermissions";
import { Ressource } from "../../../logic/entities/Permissions";

interface VeterinarianInterventionsHistoryProps {
    animal: Animal;
    isOpen?: boolean;
}

const VeterinarianInterventionsHistory: FC<VeterinarianInterventionsHistoryProps> = ({ animal, isOpen = true }) => {
    const [veterinarianInterventions, setVeterinarianInterventions] = useState<VeterinarianIntervention[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVeterinarianIntervention, setModalVeterinarianIntervention] = useState<VeterinarianIntervention | null>(null);

    const fetchInterventions = () => {
        if (!animal?.id) return Promise.resolve([]);
        setLoading(true);
        return VeterinarianInterventionsManager.getByAnimalId(animal.id)
            .then((interventions) =>
                interventions.sort((a, b) => new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime())
            )
            .then((sorted) => {
                setVeterinarianInterventions(sorted);
                return sorted;
            })
            .catch((err) => {
                console.error(err);
                toast.error(`Une erreur s'est produite pendant la récupération des données\n${err}`);
                return [] as VeterinarianIntervention[];
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (isOpen && animal?.id) {
            fetchInterventions();
        }
    }, [isOpen, animal?.id]);

    const shouldRefresh = () => {
        fetchInterventions();
    };

    const showDetail = (veterinarianIntervention: VeterinarianIntervention) => {
        setModalVeterinarianIntervention(veterinarianIntervention);
    };

    const deleteVeterinarianIntervention = (veterinarianIntervention: VeterinarianIntervention) => {
        VeterinarianInterventionsManager.delete(veterinarianIntervention)
            .then(() => {
                toast.success("Intervention vétérinaire supprimée");
                shouldRefresh();
            })
            .catch((err) => {
                console.error(err);
                toast.error(`Une erreur s'est produite pendant la suppression des données\n${err}`);
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
                                            toast.error("Sauvegardez d'abord l'animal avant d'enregistrer une intervention vétérinaire");
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
                    <Table striped>
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Notes</th>
                                <th scope="col">Détail</th>
                                <th scope="col">Suppression</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4}>Chargement...</td>
                                </tr>
                            ) : (
                            veterinarianInterventions
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
                                ))
                            )}
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
                />
            )}
        </>
    );
};

export default VeterinarianInterventionsHistory;
