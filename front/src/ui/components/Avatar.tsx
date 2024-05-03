import { CSSProperties, FC, ImgHTMLAttributes } from "react";
import classNames from "classnames";

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
            alt=""
            style={{ width: size, height: size, ...style }}
            className={classes}
            {...restProps}
        />
    );
};

export default Avatar;
