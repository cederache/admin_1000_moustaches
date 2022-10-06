import bg11Image from "assets/img/bg/background_1920-11.jpg";
import bg18Image from "assets/img/bg/background_1920-18.jpg";
import bg1Image from "assets/img/bg/background_640-1.jpg";
import bg3Image from "assets/img/bg/background_640-3.jpg";
import user1Image from "assets/img/users/100_1.jpg";
import { UserCard } from "components/Card";
import Page from "components/Page";
import React from "react";
import { Line } from "react-chartjs-2";
import {
    Button,
    Card,
    CardBody,
    CardImg,
    CardImgOverlay,
    CardLink,
    CardText,
    CardTitle,
    Col,
    ListGroup,
    ListGroupItem,
    Row,
} from "reactstrap";

const CardPage = () => {
    return (
        <Page title="Cards" breadcrumbs={[{ name: "cards", active: true }]}>
            <Row>
                <Col md={6} sm={6} xs={12} className="mb-3">
                    <Card className="flex-row">
                        <CardImg
                            className="card-img-left"
                            src={bg1Image}
                            style={{ width: "auto", height: 150 }}
                        />
                        <CardBody>
                            <CardTitle>Horizontal Image Card(Left)</CardTitle>
                            <CardText>
                                Some quick example text to build on the card
                                title and make up the bulk of the card's
                                content.
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={6} sm={6} xs={12} className="mb-3">
                    <Card className="flex-row">
                        <CardBody>
                            <CardTitle>Horizontal Image Card(Right)</CardTitle>
                            <CardText>Some quick example card</CardText>
                        </CardBody>
                        <CardImg
                            className="card-img-right"
                            src={bg3Image}
                            style={{ width: "auto", height: 150 }}
                        />
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={6} sm={6} xs={12} className="mb-3">
                    <Card>
                        <CardImg top src={bg11Image} />
                        <CardBody>
                            <CardTitle>Card with image</CardTitle>
                            <CardText>
                                Some quick example text to build on the card
                                title and make up the bulk of the card's
                                content.
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={6} sm={6} xs={12} className="mb-3">
                    <Card>
                        <CardImg top src={bg18Image} />
                        <CardBody>
                            <CardTitle>Card with list group</CardTitle>
                            <CardText>
                                This example shows how to use card with list
                                group{" "}
                            </CardText>
                        </CardBody>
                        <ListGroup flush>
                            <ListGroupItem>Cras justo odio</ListGroupItem>
                            <ListGroupItem>
                                Dapibus ac facilisis in
                            </ListGroupItem>
                            <ListGroupItem>Morbi leo risus</ListGroupItem>
                        </ListGroup>
                        <CardBody>
                            <CardLink tag="a" href="#">
                                Go to details
                            </CardLink>
                            <CardLink tag="a" href="#">
                                More
                            </CardLink>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                {["", "top", "left", "right"].map((color, index) => (
                    <Col key={index} md={6} sm={6} xs={12} className="mb-3">
                        <Card
                            inverse
                            className={`border-0 bg-gradient-theme${
                                !!color ? "-" : ""
                            }${color}`}
                            style={{
                                height: 200,
                            }}
                        >
                            <CardBody className="d-flex flex-column justify-content-start align-items-start">
                                <CardTitle>Card title</CardTitle>
                                <CardText>card text</CardText>
                            </CardBody>

                            <CardBody className="d-flex justify-content-between align-items-center">
                                <CardText>Karl David</CardText>
                                <Button outline color="light">
                                    Click
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row>
                <Col md={5}>
                    <UserCard
                        avatar={user1Image}
                        title="Chris"
                        subtitle="Project Lead"
                        text="Give me a star!"
                        style={{
                            height: 300,
                        }}
                    />
                </Col>
            </Row>
        </Page>
    );
};

export default CardPage;
