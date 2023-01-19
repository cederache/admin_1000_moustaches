import React, { useState } from "react";
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
import AnimalsToHostFamiliesManager from "../../managers/animalsToHostFamilies.manager";
import AnimalToHostFamilyModal from "./AnimalToHostFamilyModal";
import PropTypes from "../../utils/propTypes";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

function HostFamiliesHistory({
    animalId,
    hostFamilies,
    animalToHostFamilies,
    notificationSystem,
    shouldRefresh,
    ...props
}) {
    const [modalAnimalToHostFamily, setModalAnimalToHostFamily] =
        useState(null);
    const [showHAnimalToHostFamilyModal, setShowAnimalToHostFamilyModal] =
        useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [animalToHostFamilyToDelete, setAnimalToHostFamilyToDelete] = useState(undefined);

    const [currentAnimalToHostFamily] = animalToHostFamilies.filter(
        (athf) => athf.exit_date_object !== null
    );

    const showDetail = (animalToHostFamily) => {
        props.history.push(
            `/hostFamilies/${animalToHostFamily.host_family_id}`
        );
    };

    const deleteAnimalToHostFamily = () => {
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
        setAnimalToHostFamilyToDelete(undefined);
        return;
    }

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
                                            animalId
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
                                <th scope="col">Nom Prénom</th>
                                <th scope="col">Date d'entrée</th>
                                <th scope="col">Date de sortie</th>
                                <th scope="col">Fiche de la FA</th>
                                <th scope="col">Suppression</th>
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
                                                animalToHostFamily
                                                    .entry_date_object.readable
                                            }
                                        </td>
                                        <td>
                                            {
                                                animalToHostFamily
                                                    .exit_date_object.readable
                                            }
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
                                                color="danger"
                                                onClick={() => {
                                                    setAnimalToHostFamilyToDelete(animalToHostFamily);
                                                    setShowDeleteConfirmationModal(true);
                                                }}
                                            >
                                                <MdDelete />
                                            </Button>
                                        </td>
                                    </tr>
                                )
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
                    handleClose={(shouldReload) => {
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
                bodyEntityName={"le lien entre l'Animal et la Famille D'acceuil"}
            />
        </>
    );
}

HostFamiliesHistory.propTypes = {
    animalId: PropTypes.string.isRequired,
    hostFamilies: PropTypes.array.isRequired,
    animalToHostFamily: PropTypes.object.isRequired,
    notificationSystem: PropTypes.object.isRequired,
    shouldRefresh: PropTypes.bool.isRequired
};

export default HostFamiliesHistory;
