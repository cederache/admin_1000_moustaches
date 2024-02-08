import React, { FC } from "react";
import { Spinner } from "reactstrap";

interface PageSpinnerProps {
    color?:
        | "primary"
        | "secondary"
        | "success"
        | "danger"
        | "warning"
        | "info"
        | "light"
        | "dark";
}

const PageSpinner: FC<PageSpinnerProps> = ({ color = "primary" }) => {
    return (
        <div className="cr-page-spinner">
            <Spinner color={color} />
        </div>
    );
};

export default PageSpinner;
