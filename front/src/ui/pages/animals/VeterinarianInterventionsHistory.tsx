import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
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
                toast.error(`${t("common.errorFetch")}\n${err}`);
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
                toast.success(t("animals.message.interventionDeleted"));
                shouldRefresh();
            })
            .catch((err) => {
                console.error(err);
                toast.error(`${t("common.errorDelete")}\n${err}`);
            });
    };

    const pagePermissions = useGetPermissions([Ressource.PET_HIST_VETO]);

    return (
        <>
            <Card>
                <CardHeader>
                    <Row>
                        <Col>
                            <h3>{t("animals.history.veterinarianInterventionsTitle")}</h3>
                        </Col>
                        <Col xs={"auto"}>
                            {pagePermissions[Ressource.PET_HIST_VETO]?.can_create && (
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        if (!animal.id) {
                                            toast.error(t("animals.message.saveAnimalBeforeIntervention"));
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
                                <th scope="col">{t("animals.history.veterinarianInterventionsDate")}</th>
                                <th scope="col">{t("animals.history.veterinarianInterventionsNotes")}</th>
                                <th scope="col">{t("animals.history.veterinarianInterventionsDetail")}</th>
                                <th scope="col">{t("animals.history.veterinarianInterventionsDelete")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4}>{t("common.loading")}</td>
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
