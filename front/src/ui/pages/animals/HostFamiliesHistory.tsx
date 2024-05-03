import React, { FC, useState } from "react";
import { MdAddBox, MdAssignment, MdDelete } from "react-icons/md";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Table,
} from "reactstrap";
import AnimalsToHostFamiliesManager from "../../../managers/animalsToHostFamilies.manager";
import AnimalToHostFamilyModal from "./AnimalToHostFamilyModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import AnimalToHostFamily from "../../../logic/entities/AnimalToHostFamily";
import HostFamily from "../../../logic/entities/HostFamily";
import { useHistory } from "react-router-dom";

interface HostFamiliesHistoryProps {
    animalId: number;
    animalName: string;
    hostFamilies: HostFamily[];
    animalToHostFamilies: AnimalToHostFamily[];
    notificationSystem: any; // Replace 'any' with the type of your notification system
    shouldRefresh: () => void;
}

const HostFamiliesHistory: FC<HostFamiliesHistoryProps> = ({
    animalId,
    animalName,
    hostFamilies,
    animalToHostFamilies,
    notificationSystem,
    shouldRefresh,
    ...props
}) => {
    const history = useHistory();

    const [modalAnimalToHostFamily, setModalAnimalToHostFamily] =
        useState<AnimalToHostFamily | null>(null);
    const [showHAnimalToHostFamilyModal, setShowAnimalToHostFamilyModal] =
        useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
        useState<boolean>(false);
    const [animalToHostFamilyToDelete, setAnimalToHostFamilyToDelete] =
        useState<AnimalToHostFamily | null>(null);

    const [currentAnimalToHostFamily] = animalToHostFamilies.filter(
        (athf) => athf.exit_date !== null
    );

    const showDetail = (animalToHostFamily: AnimalToHostFamily) => {
        history.push(`/hostFamilies/${animalToHostFamily.host_family_id}`);
    };

    const deleteAnimalToHostFamily = () => {
        if (animalToHostFamilyToDelete === null) {
            return;
        }
        AnimalsToHostFamiliesManager.delete(animalToHostFamilyToDelete)
            .then((updatedAnimalToHostFamily) => {
                notificationSystem.addNotification({
                    message: "Lien Animal / Famille d'accueil supprimé",
                    level: "success",
                });
                shouldRefresh();
            })
            .catch((err) => {
                console.error(err);
                notificationSystem.addNotification({
                    message: `Une erreur s'est produite pendant la suppression des données\n${err}`,
                    level: "error",
                });
            });
        setAnimalToHostFamilyToDelete(null);
        return;
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <Row>
                        <Col>
                            <h3>Historique des Familles d'Accueil</h3>
                        </Col>
                        <Col xs={"auto"}>
                            <Button
                                color="primary"
                                onClick={() => {
                                    setModalAnimalToHostFamily(
                                        AnimalsToHostFamiliesManager.createAnimalToHostFamily(
                                            animalId,
                                            animalName
                                        )
                                    );
                                    setShowAnimalToHostFamilyModal(true);
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
                                <th scope="col">Prénom Nom</th>
                                <th scope="col">Date d'entrée</th>
                                <th scope="col">Fiche de la FA</th>
                                <th scope="col">Modification</th>
                                <th scope="col">Suppression</th>
                            </tr>
                        </thead>
                        <tbody>
                            {animalToHostFamilies.map(
                                (animalToHostFamily, index) => {
                                    var hostFamily = hostFamilies.find(
                                        (hf) =>
                                            hf.id ===
                                            animalToHostFamily.host_family_id
                                    );
                                    return (
                                        <tr>
                                            <th scope="row">
                                                {hostFamily?.displayName}
                                            </th>
                                            <td>
                                                {animalToHostFamily
                                                    .entry_dateObject
                                                    .readable ??
                                                    animalToHostFamily.entry_date}
                                            </td>
                                            <td>
                                                <Button
                                                    color="info"
                                                    onClick={() =>
                                                        showDetail(
                                                            animalToHostFamily
                                                        )
                                                    }
                                                >
                                                    <MdAssignment />
                                                </Button>
                                            </td>
                                            <td>
                                                <Button
                                                    color="info"
                                                    onClick={() => {
                                                        setModalAnimalToHostFamily(
                                                            animalToHostFamily
                                                        );
                                                        setShowAnimalToHostFamilyModal(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <MdDelete />
                                                </Button>
                                            </td>
                                            <td>
                                                <Button
                                                    color="danger"
                                                    onClick={() => {
                                                        setAnimalToHostFamilyToDelete(
                                                            animalToHostFamily
                                                        );
                                                        setShowDeleteConfirmationModal(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <MdDelete />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>

            {modalAnimalToHostFamily !== null && (
                <AnimalToHostFamilyModal
                    hostFamilies={hostFamilies}
                    animalToHostFamily={modalAnimalToHostFamily}
                    currentAnimalToHostFamily={currentAnimalToHostFamily}
                    show={showHAnimalToHostFamilyModal}
                    handleClose={(shouldReload: boolean) => {
                        setShowAnimalToHostFamilyModal(false);
                        setModalAnimalToHostFamily(null);

                        if (shouldReload) {
                            shouldRefresh();
                        }
                    }}
                    notificationSystem={notificationSystem}
                />
            )}

            <DeleteConfirmationModal
                show={showDeleteConfirmationModal}
                handleClose={(confirmed) => {
                    setShowDeleteConfirmationModal(false);
                    if (confirmed) {
                        deleteAnimalToHostFamily();
                    }
                }}
                bodyEntityName={
                    "le lien entre l'Animal et la Famille D'acceuil"
                }
            />
        </>
    );
};

export default HostFamiliesHistory;
