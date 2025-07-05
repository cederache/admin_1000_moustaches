import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";
import SpeciesCounts from "../../../../logic/entities/SpeciesCounts";
import { PiCatFill, PiDogFill } from "react-icons/pi";
import { PiRabbitFill } from "react-icons/pi";
import { MdPestControlRodent } from "react-icons/md";
import { SPECIES_ID } from "../../../../utils/constants";

// pagePermissions[navItem.ressourceName]?.can_read)
const AnimalsCard = ({ title, datas }: { title: string; datas: SpeciesCounts | null }) => {
    const [countDog, setCountDog] = useState<number | undefined>(undefined);
    const [countRabbit, setCountRabbit] = useState<number | undefined>(undefined);
    const [countCat, setCountCat] = useState<number | undefined>(undefined);
    const [countOther, setCountOther] = useState<number | undefined>(undefined);

    useEffect(() => {
        setCountDog(datas?.species.find((specie) => specie.id === SPECIES_ID.DOG)?.count);
        setCountRabbit(datas?.species.find((specie) => specie.id === SPECIES_ID.RABBIT)?.count);
        setCountCat(datas?.species.find((specie) => specie.id === SPECIES_ID.CAT)?.count);
        setCountOther(datas?.species.find((specie) => specie.id === SPECIES_ID.OTHER)?.count);
    }, [datas]);

    return (
        <Card body className="text-center" xs="auto">
            <CardBody>
                <CardTitle>{title}</CardTitle>
            </CardBody>
            <Row className="justify-content-center">
                <Col className="d-flex align-items-center" xs="4">
                    <Card body style={{ borderColor: "#43ABC9" }}>
                        <CardTitle> Total </CardTitle>
                        <CardText className="fs-1">{datas?.total}</CardText>
                    </Card>
                </Col>
                <Col xs="4">
                    <Card body style={{ borderColor: "#43ABC9" }} className="align-items-center">
                        <PiDogFill size={35} />
                        <CardText className="fs-4"> {countDog ?? "-"} </CardText>
                    </Card>
                    <br />
                    <Card body style={{ borderColor: "#43ABC9" }} className="align-items-center">
                        <PiRabbitFill size={35} />
                        <CardText className="fs-4"> {countRabbit ?? "-"} </CardText>
                    </Card>
                </Col>
                <Col xs="4">
                    <Card body style={{ borderColor: "#43ABC9" }} className="align-items-center">
                        <PiCatFill size={35} />
                        <CardText className="fs-4"> {countCat ?? "-"} </CardText>
                    </Card>
                    <br />
                    <Card body style={{ borderColor: "#43ABC9" }} className="align-items-center">
                        <MdPestControlRodent size={35} />
                        <CardText className="fs-4"> {countOther ?? "-"} </CardText>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default AnimalsCard;
