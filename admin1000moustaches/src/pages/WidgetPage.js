import React from "react";

import { Row, Col } from "reactstrap";

import Page from "components/Page";
import { NumberWidget, IconWidget } from "components/Widget";

const WidgetPage = () => {
    return (
        <Page
            className="WidgetPage"
            title="Widgets"
            breadcrumbs={[{ name: "widgets", active: true }]}
        ></Page>
    );
};

export default WidgetPage;
