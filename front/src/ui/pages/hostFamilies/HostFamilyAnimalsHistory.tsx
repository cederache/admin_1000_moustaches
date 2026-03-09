import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, CardHeader, Table } from "reactstrap";
import { MdAssignment } from "react-icons/md";
import AnimalsToHostFamiliesManager from "../../../managers/animalsToHostFamilies.manager";
import AnimalToHostFamily from "../../../logic/entities/AnimalToHostFamily";
import { useNavigate } from "react-router-dom";

interface HostFamilyAnimalsHistoryProps {
    hostFamilyId: string;
}

const HostFamilyAnimalsHistory: FC<HostFamilyAnimalsHistoryProps> = ({ hostFamilyId }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [animalToHostFamilies, setAnimalToHostFamilies] = useState<AnimalToHostFamily[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = () => {
        const id = parseInt(hostFamilyId, 10);
        if (isNaN(id)) return;
        setLoading(true);
        AnimalsToHostFamiliesManager.getByHostFamilyId(id)
            .then((data) => {
                setAnimalToHostFamilies(data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (hostFamilyId !== "new") {
            fetchData();
        }
    }, [hostFamilyId]);

    const showDetail = (animalToHostFamily: AnimalToHostFamily) => {
        navigate(`/animals/${animalToHostFamily.animal?.id}`);
    };

    if (hostFamilyId === "new") {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <h3>{t("hostFamilies.history.animalsTitle")}</h3>
            </CardHeader>
            <CardBody className="table-responsive">
                <Table striped>
                    <thead>
                        <tr>
                            <th scope="col">{t("animals.table.name")}</th>
                            <th scope="col">{t("hostFamilies.table.entryDate")}</th>
                            <th scope="col">{t("hostFamilies.table.exitDate")}</th>
                            <th scope="col">{t("hostFamilies.table.animalSheetLink")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4}>{t("common.loading")}</td>
                            </tr>
                        ) : (
                            animalToHostFamilies.map((animalToHostFamily) => (
                                <tr key={animalToHostFamily.animal?.id ?? Math.random()}>
                                    <th scope="row">{animalToHostFamily.animal?.name}</th>
                                    <td>{animalToHostFamily.entryDateObject?.readable}</td>
                                    <td>{animalToHostFamily.exitDateObject?.readable}</td>
                                    <td>
                                        <Button color="info" onClick={() => showDetail(animalToHostFamily)}>
                                            <MdAssignment />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

export default HostFamilyAnimalsHistory;
