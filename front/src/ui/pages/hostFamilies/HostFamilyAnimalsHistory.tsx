import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, CardHeader, Table } from "reactstrap";
import { MdAssignment } from "react-icons/md";
import AnimalToHostFamily from "../../../logic/entities/AnimalToHostFamily";
import { useNavigate } from "react-router-dom";
import { useAnimalHostFamiliesByHostFamily } from "../../../hooks/animalHostFamilies/useAnimalHostFamiliesByHostFamily";

interface HostFamilyAnimalsHistoryProps {
    hostFamilyId: string;
}

const HostFamilyAnimalsHistory: FC<HostFamilyAnimalsHistoryProps> = ({ hostFamilyId }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const numericId = hostFamilyId === "new" ? null : parseInt(hostFamilyId, 10);
    const validId = numericId != null && !Number.isNaN(numericId) ? numericId : null;

    const { data: animalToHostFamiliesData, isPending: isAthfsPending } =
        useAnimalHostFamiliesByHostFamily(validId);

    const animalToHostFamilies = animalToHostFamiliesData ?? [];

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
                        {isAthfsPending ? (
                            <tr>
                                <td colSpan={4}>{t("common.loading")}</td>
                            </tr>
                        ) : (
                            animalToHostFamilies.map((animalToHostFamily) => (
                                <tr key={animalToHostFamily.animal?.id ?? animalToHostFamily.entryDate}>
                                    <th scope="row">{animalToHostFamily.animal?.name}</th>
                                    <td>{animalToHostFamily.entryDateObject?.readable}</td>
                                    <td>{animalToHostFamily.exitDateObject?.readable}</td>
                                    <td>
                                        <Button
                                            color="info"
                                            onClick={() => showDetail(animalToHostFamily)}
                                        >
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
