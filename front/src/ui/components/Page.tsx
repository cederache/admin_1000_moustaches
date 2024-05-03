import React, { FC, ReactElement, ReactNode } from "react";
import bn from "../../utils/bemnames";

import { Breadcrumb, BreadcrumbItem } from "reactstrap";

import Typography from "./Typography";

import NotificationSystem from "react-notification-system";
import { NOTIFICATION_SYSTEM_STYLE } from "../../utils/constants";

const bem = bn.create("page");

export interface CustomBreadcrumbItem extends BreadcrumbItem {
    name: string;
    active: boolean;
    to: string | null;
}

interface PageProps {
    title: string;
    breadcrumbs?: CustomBreadcrumbItem[];
    className?: string;
    children?: ReactNode;
    notificationSystemCallback?: (
        notificationSystem: NotificationSystem | null
    ) => void;
    [key: string]: any;
}

const Page: FC<PageProps> = ({
    title,
    breadcrumbs,
    className,
    children,
    notificationSystemCallback,
    ...restProps
}): ReactElement => {
    const classes = bem.b("px-3", className);

    return (
        <div className={classes} {...restProps}>
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
                                                ? ""
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
                    <Typography tag="p" type="h1" className={bem.e("title")}>
                        {title}
                    </Typography>
                ) : (
                    title
                )}
            </div>
            {children}

            <NotificationSystem
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
        </div>
    );
};

export default Page;
