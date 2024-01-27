import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import { Card, CardTitle, CardSubtitle, CardText, CardBody } from "reactstrap";
import Avatar from "../Avatar";

interface UserCardProps {
    avatar?: string;
    avatarSize?: number;
    title?: string;
    subtitle?: string;
    text?: string;
    children?: ReactNode;
    className?: string;
    [key: string]: any;
}

const UserCard: FC<UserCardProps> = ({
    avatar,
    avatarSize = 80,
    title,
    subtitle,
    text,
    children,
    className,
    ...restProps
}) => {
    const classes = classNames("bg-gradient-theme", className);

    return (
        <Card inverse className={classes} {...restProps}>
            <CardBody className="d-flex justify-content-center align-items-center flex-column">
                {avatar && (
                    <Avatar src={avatar} size={avatarSize} className="mb-2" />
                )}
                <CardTitle>{title}</CardTitle>
                <CardSubtitle>{subtitle}</CardSubtitle>
                <CardText>
                    <small>{text}</small>
                </CardText>
            </CardBody>
            {children}
        </Card>
    );
};

export default UserCard;
