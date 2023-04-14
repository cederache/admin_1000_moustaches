import React, { CSSProperties, FC, ImgHTMLAttributes } from "react";
import classNames from "classnames";
import userImage from "../assets/img/users/100_4.jpg";

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
    rounded?: boolean;
    circle?: boolean;
    src?: string;
    size?: string | number;
    className?: string;
    style?: CSSProperties;
}

const Avatar: FC<AvatarProps> = ({
    rounded,
    circle,
    src,
    size,
    className,
    style,
    ...restProps
}: AvatarProps) => {
    const classes = classNames(
        { "rounded-circle": circle, rounded },
        className
    );

    return (
        <img
            src={src}
            style={{ width: size, height: size, ...style }}
            className={classes}
            {...restProps}
        />
    );
};

export default Avatar;
