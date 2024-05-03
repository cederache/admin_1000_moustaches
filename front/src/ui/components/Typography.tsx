import classNames from "classnames";
import React, { FC, HTMLAttributes } from "react";

const tagMap = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    "display-1": "h1",
    "display-2": "h1",
    "display-3": "h1",
    "display-4": "h1",
    p: "p",
    lead: "p",
    blockquote: "blockquote",
};

type TagType = keyof typeof tagMap;

interface TypographyProps extends HTMLAttributes<HTMLElement> {
    tag: keyof JSX.IntrinsicElements;
    type: TagType;
}

const Typography: FC<
    TypographyProps & React.HTMLAttributes<HTMLOrSVGElement>
> = ({ tag: Tag, className, type = "p", ...restProps }) => {
    const classes = classNames({ [type]: !!type }, className);
    let TypoComp: keyof JSX.IntrinsicElements;

    if (Tag) {
        TypoComp = Tag;
    } else if (!Tag && tagMap[type]) {
        TypoComp = tagMap[type] as keyof JSX.IntrinsicElements;
    } else {
        TypoComp = "p";
    }

    return <TypoComp {...restProps} className={classes} />;
};

export default Typography;
