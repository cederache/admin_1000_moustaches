import React, { FC, useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Table } from "reactstrap";
import { MdAssignment } from "react-icons/md";
import AnimalsToHostFamiliesManager from "../../../managers/animalsToHostFamilies.manager";
import AnimalToHostFamily from "../../../logic/entities/AnimalToHostFamily";
import { useNavigate } from "react-router-dom";

interface HostFamilyAnimalsHistoryProps {
    hostFamilyId: string;
}

const HostFamilyAnimalsHistory: FC<HostFamilyAnimalsHistoryProps> = ({ hostFamilyId }) => {
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
                <h3>Historique des animaux</h3>
            </CardHeader>
            <CardBody className="table-responsive">
                <Table striped>
                    <thead>
                        <tr>
                            <th scope="col">Nom</th>
                            <th scope="col">Date d'entrée</th>
                            <th scope="col">Date de sortie</th>
                            <th scope="col">Fiche de l'animal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4}>Chargement...</td>
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
