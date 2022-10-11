import { AnnouncementCard } from "../components/Card";
import MapWithBubbles from "../components/MapWithBubbles";
import Page from "../components/Page";
import { IconWidget, NumberWidget } from "../components/Widget";
import React from "react";
import { MdRateReview, MdShare, MdThumbUp } from "react-icons/md";
import InfiniteCalendar from "react-infinite-calendar";
import { Card, CardBody, CardGroup, CardHeader, Col, Row } from "reactstrap";
import { getColor } from "../utils/colors";

const today = new Date();
const lastWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
);

class DashboardPage extends React.Component {
    componentDidMount() {
        // this is needed, because InfiniteCalendar forces window scroll
        window.scrollTo(0, 0);
    }

    render() {
        const primaryColor = getColor("primary");
        const secondaryColor = getColor("secondary");

        return (
            <Page
                className="DashboardPage"
                title="Dashboard"
                breadcrumbs={[{ name: "Dashboard", active: true }]}
            >
                <Row>
                    <Col lg={3} md={6} sm={6} xs={12}>
                        <NumberWidget
                            title="Total Profit"
                            subtitle="This month"
                            number="9.8k"
                            color="secondary"
                            progress={{
                                value: 75,
                                label: "Last month",
                            }}
                        />
                    </Col>

                    <Col lg={3} md={6} sm={6} xs={12}>
                        <NumberWidget
                            title="Monthly Visitors"
                            subtitle="This month"
                            number="5,400"
                            color="secondary"
                            progress={{
                                value: 45,
                                label: "Last month",
                            }}
                        />
                    </Col>

                    <Col lg={3} md={6} sm={6} xs={12}>
                        <NumberWidget
                            title="New Users"
                            subtitle="This month"
                            number="3,400"
                            color="secondary"
                            progress={{
                                value: 90,
                                label: "Last month",
                            }}
                        />
                    </Col>

                    <Col lg={3} md={6} sm={6} xs={12}>
                        <NumberWidget
                            title="Bounce Rate"
                            subtitle="This month"
                            number="38%"
                            color="secondary"
                            progress={{
                                value: 60,
                                label: "Last month",
                            }}
                        />
                    </Col>
                </Row>

                <CardGroup style={{ marginBottom: "1rem" }}>
                    <IconWidget
                        bgColor="white"
                        inverse={false}
                        icon={MdThumbUp}
                        title="50+ Likes"
                        subtitle="People you like"
                    />
                    <IconWidget
                        bgColor="white"
                        inverse={false}
                        icon={MdRateReview}
                        title="10+ Reviews"
                        subtitle="New Reviews"
                    />
                    <IconWidget
                        bgColor="white"
                        inverse={false}
                        icon={MdShare}
                        title="30+ Shares"
                        subtitle="New Shares"
                    />
                </CardGroup>

                <Row>
                    <Col lg="4" md="12" sm="12" xs="12">
                        <InfiniteCalendar
                            selected={today}
                            minDate={lastWeek}
                            width="100%"
                            theme={{
                                accentColor: primaryColor,
                                floatingNav: {
                                    background: secondaryColor,
                                    chevron: primaryColor,
                                    color: "#FFF",
                                },
                                headerColor: primaryColor,
                                selectionColor: secondaryColor,
                                textColor: {
                                    active: "#FFF",
                                    default: "#333",
                                },
                                todayColor: secondaryColor,
                                weekdayColor: primaryColor,
                            }}
                        />
                    </Col>

                    <Col lg="8" md="12" sm="12" xs="12">
                        <Card inverse className="bg-gradient-primary">
                            <CardHeader className="bg-gradient-primary">
                                Map with bubbles
                            </CardHeader>
                            <CardBody>
                                <MapWithBubbles />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col lg="4" md="12" sm="12" xs="12">
                        <AnnouncementCard
                            color="gradient-secondary"
                            header="Announcement"
                            avatarSize={60}
                            name="Jamy"
                            date="1 hour ago"
                            text="Lorem ipsum dolor sit amet,consectetuer edipiscing elit,sed diam nonummy euismod tinciduntut laoreet doloremagna"
                            buttonProps={{
                                children: "show",
                            }}
                            style={{ height: 500 }}
                        />
                    </Col>
                </Row>
            </Page>
        );
    }
}
export default DashboardPage;
