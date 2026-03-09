import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAddBox, MdAssignment, MdDelete, MdEdit } from "react-icons/md";
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import AnimalsToHostFamiliesManager from "../../../managers/animalsToHostFamilies.manager";
import AnimalToHostFamilyModal from "./AnimalToHostFamilyModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import AnimalToHostFamily from "../../../logic/entities/AnimalToHostFamily";
import HostFamily from "../../../logic/entities/HostFamily";
import HostFamiliesManager from "../../../managers/hostFamilies.manager";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Animal from "../../../logic/entities/Animal";
import useGetPermissions from "../../../hooks/useGetPermissions";
import { Ressource } from "../../../logic/entities/Permissions";

interface HostFamiliesHistoryProps {
    animal: Animal;
    isOpen?: boolean;
    onAnimalUpdated?: () => void;
}

const HostFamiliesHistory: FC<HostFamiliesHistoryProps> = ({ animal, isOpen = true, onAnimalUpdated }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const pagePermissions = useGetPermissions([Ressource.PET_HIST_HF]);

    const [hostFamilies, setHostFamilies] = useState<HostFamily[]>([]);
    const [animalToHostFamilies, setAnimalToHostFamilies] = useState<AnimalToHostFamily[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalAnimalToHostFamily, setModalAnimalToHostFamily] = useState<AnimalToHostFamily | null>(null);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);
    const [animalToHostFamilyToDelete, setAnimalToHostFamilyToDelete] = useState<AnimalToHostFamily | null>(null);

    const fetchData = () => {
        if (!animal?.id) return;
        setLoading(true);
        Promise.all([
            HostFamiliesManager.getAll().then((hf) => hf.sort((a, b) => a.name?.localeCompare(b.name ?? "") ?? 0)),
            HostFamiliesManager.getByAnimalId(animal.id).then((athfs) =>
                athfs.sort((a, b) => new Date(b.entryDate ?? "").getTime() - new Date(a.entryDate ?? "").getTime())
            ),
        ])
            .then(([hf, athfs]) => {
                setHostFamilies(hf);
                setAnimalToHostFamilies(athfs);
            })
            .catch((err) => {
                console.error(err);
                toast.error(`${t("common.errorFetch")}\n${err}`);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (isOpen && animal?.id) {
            fetchData();
        }
    }, [isOpen, animal?.id]);

    const shouldRefresh = () => {
        fetchData();
        onAnimalUpdated?.();
    };

    const [currentAnimalToHostFamily] = animalToHostFamilies.filter((athf) => athf.exitDate !== null);

    const showDetail = (animalToHostFamily: AnimalToHostFamily) => {
        navigate(`/hostFamilies/${animalToHostFamily.hostFamily?.id}`);
    };

    const deleteAnimalToHostFamily = (toDelete: AnimalToHostFamily | null) => {
        if (toDelete === null) {
            return;
        }
        AnimalsToHostFamiliesManager.delete(toDelete)
            .then(() => {
                toast.success(t("animals.message.linkDeleted"));
                shouldRefresh();
            })
            .catch((err) => {
                console.error(err);
                toast.error(`${t("common.errorDelete")}\n${err}`);
            });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <Row>
                        <Col>
                            <h3>{t("animals.history.hostFamiliesTitle")}</h3>
                        </Col>
                        <Col xs={"auto"}>
                            {pagePermissions[Ressource.PET_HIST_HF]?.can_create && (
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        if (!animal.id) {
                                            toast.error(t("animals.message.saveAnimalFirst"));
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
                    <Table striped>
                        <thead>
                            <tr>
                                <th scope="col">{t("animals.history.hostFamiliesFirstnameName")}</th>
                                <th scope="col">{t("animals.history.hostFamiliesEntryDate")}</th>
                                <th scope="col">{t("animals.history.hostFamiliesSheet")}</th>
                                <th scope="col">{t("animals.history.hostFamiliesEdit")}</th>
                                <th scope="col">{t("animals.history.hostFamiliesDelete")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5}>{t("common.loading")}</td>
                                </tr>
                            ) : (
                            animalToHostFamilies.map((animalToHostFamily, index) => {
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
                                                    setShowDeleteConfirmationModal(true);
                                                }}
                                            >
                                                <MdDelete />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
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
                    show={modalAnimalToHostFamily !== null}
                    handleClose={(shouldReload: boolean) => {
                        setModalAnimalToHostFamily(null);

                        if (shouldReload) {
                            shouldRefresh();
                        }
                    }}
                />
            )}

            <DeleteConfirmationModal
                show={showDeleteConfirmationModal}
                handleClose={(confirmed) => {
                    const toDelete = animalToHostFamilyToDelete;
                    setShowDeleteConfirmationModal(false);
                    setAnimalToHostFamilyToDelete(null);
                    if (confirmed && toDelete) {
                        deleteAnimalToHostFamily(toDelete);
                    }
                }}
                bodyEntityName={t("animals.history.hostFamiliesLinkEntityName")}
            />
        </>
    );
};

export default HostFamiliesHistory;
