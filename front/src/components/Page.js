import React from "react";
import PropTypes from "../utils/propTypes";

import bn from "../utils/bemnames";

import { Breadcrumb, BreadcrumbItem } from "reactstrap";

import Typography from "./Typography";

import NotificationSystem from "react-notification-system";
import { NOTIFICATION_SYSTEM_STYLE } from "../utils/constants";

const bem = bn.create("page");

const Page = ({
    title,
    breadcrumbs,
    tag: Tag,
    className,
    children,
    notificationSystemCallback,
    ...restProps
}) => {
    const classes = bem.b("px-3", className);

    return (
        <Tag className={classes} {...restProps}>
            <div className={bem.e("header")}>
                {breadcrumbs && (
                    <Breadcrumb className={bem.e("breadcrumb")}>
                        <BreadcrumbItem>
                            <a href="/">Accueil</a>
                        </BreadcrumbItem>
                        {breadcrumbs.length &&
                            breadcrumbs.map(({ name, active, to }, index) => (
                                <BreadcrumbItem key={index} active={active}>
                                    <a
                                        href={
                                            active === true || to === null
                                                ? null
                                                : to
                                        }
                                    >
                                        {name}
                                    </a>
                                </BreadcrumbItem>
                            ))}
                    </Breadcrumb>
                )}
            </div>
            <div className={bem.e("header")}>
                {title && typeof title === "string" ? (
                    <Typography type="h1" className={bem.e("title")}>
                        {title}
                    </Typography>
                ) : (
                    title
                )}
            </div>
            {children}

            <NotificationSystem
                dismissible={false}
                ref={(notificationSystem) => {
                    if (
                        !!notificationSystemCallback &&
                        typeof notificationSystemCallback === "function"
                    ) {
                        notificationSystemCallback(notificationSystem);
                    }
                }}
                style={NOTIFICATION_SYSTEM_STYLE}
            />
        </Tag>
    );
};

Page.propTypes = {
    tag: PropTypes.component,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    className: PropTypes.string,
    children: PropTypes.node,
    breadcrumbs: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            active: PropTypes.bool,
        })
    ),
};

Page.defaultProps = {
    tag: "div",
    title: "",
};

export default Page;
