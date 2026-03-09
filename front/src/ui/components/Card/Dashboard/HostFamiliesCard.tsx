import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, CardTitle, CardText, Row, Col, Button } from "reactstrap";
import SpeciesCounts from "../../../../logic/entities/SpeciesCounts";
import { PiCatFill, PiDogFill } from "react-icons/pi";
import { PiRabbitFill } from "react-icons/pi";
import { MdPestControlRodent } from "react-icons/md";
import { SPECIES_ID } from "../../../../utils/constants";
import { useNavigate } from "react-router-dom";
import HostFamilyKindsManager from "../../../../managers/hostFamilyKinds.manager";

// pagePermissions[navItem.ressourceName]?.can_read)
const HostFamiliesCard = ({ title, datas }: { title: string; datas: SpeciesCounts | null }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleGoToHostFamilies = async (speciesId?: number) => {
        const hostFamilyKinds = await HostFamilyKindsManager.getAll();
        const filteredKinds = hostFamilyKinds.filter((hfk) => hfk.species.id == speciesId);
        var searchParams: String[] = [];
        filteredKinds.forEach((kind) => {
            searchParams.push(`kinds=${kind.id}`);
        });
        searchParams.push(`isAvailable=true`);
        const url = speciesId ? `/hostfamilies?${searchParams.join("&")}` : "/hostfamilies?isAvailable=true";
        navigate(url);
    };
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

    const buttonStyle: React.CSSProperties = { width: "100%", padding: "16px" };

    return (
        <Card body className="text-center" xs="auto">
            <CardBody>
                <CardTitle>{title}</CardTitle>
            </CardBody>
            <Row className="justify-content-center">
                <Col className="d-flex align-items-center" xs="4">
                    <Button onClick={() => handleGoToHostFamilies()} style={buttonStyle}>
                        <CardTitle className="fs-3">{t("dashboard.card.total")}</CardTitle>
                        <CardText className="fs-1">{datas?.total}</CardText>
                    </Button>
                </Col>
                <Col xs="4">
                    <Button onClick={() => handleGoToHostFamilies(SPECIES_ID.DOG)} className="mb-3" style={buttonStyle}>
                        <PiDogFill size={35} aria-label={t("dashboard.aria.dog")} role="img" />
                        <CardText className="fs-2"> {countDog ?? "-"}</CardText>
                    </Button>
                    <br />
                    <Button onClick={() => handleGoToHostFamilies(SPECIES_ID.RABBIT)} style={buttonStyle}>
                        <PiRabbitFill size={35} aria-label={t("dashboard.aria.rabbit")} role="img" />
                        <CardText className="fs-2"> {countRabbit ?? "-"} </CardText>
                    </Button>
                </Col>
                <Col xs="4">
                    <Button onClick={() => handleGoToHostFamilies(SPECIES_ID.CAT)} className="mb-3" style={buttonStyle}>
                        <PiCatFill size={35} aria-label={t("dashboard.aria.cat")} role="img" />
                        <CardText className="fs-2"> {countCat ?? "-"} </CardText>
                    </Button>
                    <br />
                    <Button onClick={() => handleGoToHostFamilies(SPECIES_ID.OTHER)} style={buttonStyle}>
                        <MdPestControlRodent size={35} aria-label={t("dashboard.aria.mouse")} role="img" />
                        <CardText className="fs-2"> {countOther ?? "-"}</CardText>
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};

export default HostFamiliesCard;
