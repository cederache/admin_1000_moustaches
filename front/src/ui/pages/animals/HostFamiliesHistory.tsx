import React, { FC, useState } from "react";
import { MdAddBox, MdAssignment, MdDelete, MdEdit } from "react-icons/md";
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import AnimalsToHostFamiliesManager from "../../../managers/animalsToHostFamilies.manager";
import AnimalToHostFamilyModal from "./AnimalToHostFamilyModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import AnimalToHostFamily from "../../../logic/entities/AnimalToHostFamily";
import HostFamily from "../../../logic/entities/HostFamily";
import NotificationSystem from "react-notification-system";
import { useNavigate } from "react-router-dom";
import Animal from "../../../logic/entities/Animal";
import useGetPermissions from "../../../hooks/useGetPermissions";

interface HostFamiliesHistoryProps {
    animal: Animal;
    hostFamilies: HostFamily[];
    animalToHostFamilies: AnimalToHostFamily[];
    notificationSystem?: NotificationSystem;
    shouldRefresh: () => void;
}

const HostFamiliesHistory: FC<HostFamiliesHistoryProps> = ({ animal, hostFamilies, animalToHostFamilies, notificationSystem, shouldRefresh, ...props }) => {
    const navigate = useNavigate();

    const pagePermissions = useGetPermissions(["pet_hist_hf"]);

    const [modalAnimalToHostFamily, setModalAnimalToHostFamily] = useState<AnimalToHostFamily | null>(null);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);
    const [animalToHostFamilyToDelete, setAnimalToHostFamilyToDelete] = useState<AnimalToHostFamily | null>(null);

    const [currentAnimalToHostFamily] = animalToHostFamilies.filter((athf) => athf.exitDate !== null);

    const showDetail = (animalToHostFamily: AnimalToHostFamily) => {
        navigate(`/hostFamilies/${animalToHostFamily.hostFamily?.id}`);
    };

    const deleteAnimalToHostFamily = () => {
        if (animalToHostFamilyToDelete === null) {
            return;
        }
        AnimalsToHostFamiliesManager.delete(animalToHostFamilyToDelete)
            .then((updatedAnimalToHostFamily) => {
                notificationSystem?.addNotification({
                    message: "Lien Animal / Famille d'accueil supprimé",
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
                            {pagePermissions["pet_hist_hf"]?.can_create && (
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        if (!animal.id) {
                                            notificationSystem?.addNotification({
                                                message: "Sauvegardez d'abord l'animal avant de lui attribuer une famille d'accueil",
                                                level: "warning",
                                            });
                                            return;
                                        }
                                        setModalAnimalToHostFamily(AnimalsToHostFamiliesManager.createAnimalToHostFamily(animal, undefined));
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
                                <th scope="col">Prénom Nom</th>
                                <th scope="col">Date d'entrée</th>
                                <th scope="col">Fiche de la FA</th>
                                <th scope="col">Modification</th>
                                <th scope="col">Suppression</th>
                            </tr>
                        </thead>
                        <tbody>
                            {animalToHostFamilies.map((animalToHostFamily, index) => {
                                var hostFamily = hostFamilies.find((hf) => hf.id === animalToHostFamily.hostFamily?.id);
                                return (
                                    <tr>
                                        <th scope="row">{hostFamily?.displayName}</th>
                                        <td>{animalToHostFamily.entryDateObject.readable ?? animalToHostFamily.entryDate}</td>
                                        <td>
                                            <Button color="info" onClick={() => showDetail(animalToHostFamily)}>
                                                <MdAssignment />
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                color="info"
                                                onClick={() => {
                                                    setModalAnimalToHostFamily(animalToHostFamily);
                                                }}
                                            >
                                                <MdEdit />
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                color="danger"
                                                onClick={() => {
                                                    setAnimalToHostFamilyToDelete(animalToHostFamily);
                                                }}
                                            >
                                                <MdDelete />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>

            {modalAnimalToHostFamily !== null && (
                <AnimalToHostFamilyModal
                    hostFamilies={hostFamilies}
                    animalToHostFamily={modalAnimalToHostFamily}
                    currentAnimalToHostFamily={currentAnimalToHostFamily}
                    show={modalAnimalToHostFamily !== null}
                    handleClose={(shouldReload: boolean) => {
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
                bodyEntityName={"le lien entre l'Animal et la Famille D'acceuil"}
            />
        </>
    );
};

export default HostFamiliesHistory;
