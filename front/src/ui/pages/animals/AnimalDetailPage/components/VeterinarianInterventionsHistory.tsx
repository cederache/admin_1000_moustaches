import React, { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAddBox, MdAssignment, MdDelete } from "react-icons/md";
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import VeterinarianInterventionsManager from "../../../../../managers/veterinarianInterventions.manager";
import VeterinarianInterventionModal from "./VeterinarianInterventionModal";
import VeterinarianIntervention from "../../../../../logic/entities/VeterinarianIntervention";
import toast from "react-hot-toast";
import Animal from "../../../../../logic/entities/Animal";
import useGetPermissions from "../../../../../hooks/useGetPermissions";
import { Ressource } from "../../../../../logic/entities/Permissions";
import { useVeterinarianInterventionsByAnimal } from "../../../../../hooks/veterinarianInterventions/useVeterinarianInterventionsByAnimal";
import { useDeleteVeterinarianIntervention } from "../../../../../hooks/veterinarianInterventions/useDeleteVeterinarianIntervention";

interface VeterinarianInterventionsHistoryProps {
    animal: Animal;
    isOpen?: boolean;
}

const VeterinarianInterventionsHistory: FC<VeterinarianInterventionsHistoryProps> = ({ animal, isOpen = true }) => {
    const { t } = useTranslation();
    const [modalVeterinarianIntervention, setModalVeterinarianIntervention] = useState<VeterinarianIntervention | null>(null);

    const animalId = animal?.id ?? null;
    const {
        data: interventionsData,
        isPending: isInterventionsPending,
        isError: isInterventionsError,
        refetch: refetchInterventions,
    } = useVeterinarianInterventionsByAnimal(animalId);
    const { mutate: deleteInterventionMutation } = useDeleteVeterinarianIntervention();

    const veterinarianInterventions = useMemo(
        () => (interventionsData ? [...interventionsData].sort((a, b) => new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime()) : []),
        [interventionsData]
    );

    const pagePermissions = useGetPermissions([Ressource.PET_HIST_VETO]);

    const showDetail = (veterinarianIntervention: VeterinarianIntervention) => {
        setModalVeterinarianIntervention(veterinarianIntervention);
    };

    const deleteVeterinarianIntervention = (veterinarianIntervention: VeterinarianIntervention) => {
        deleteInterventionMutation(veterinarianIntervention, {
            onSuccess: () => {
                toast.success(t("animals.message.interventionDeleted"));
            },
            onError: (err) => {
                console.error(err);
                toast.error(`${t("common.errorDelete")}\n${err}`);
            },
        });
    };

    const handleCloseModal = (_shouldReload: boolean) => {
        setModalVeterinarianIntervention(null);
    };

    if (!isOpen || !animal?.id) {
        return null;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <Row>
                        <Col>
                            <h3>{t("animals.history.veterinarianInterventionsTitle")}</h3>
                        </Col>
                        <Col xs="auto">
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
                            {isInterventionsPending ? (
                                <tr>
                                    <td colSpan={4}>{t("common.loading")}</td>
                                </tr>
                            ) : (
                                veterinarianInterventions.map((veterinarianIntervention) => (
                                    <tr key={veterinarianIntervention.id}>
                                        <th scope="row">{veterinarianIntervention.dateObject?.readable ?? veterinarianIntervention.date}</th>
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
                    show={true}
                    handleClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default VeterinarianInterventionsHistory;
