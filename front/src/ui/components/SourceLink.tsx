import React, { FC, AnchorHTMLAttributes } from "react";

interface SourceLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    link: string;
}

const SourceLink: FC<SourceLinkProps> = ({ link, ...props }) => {
    /* eslint-disable jsx-a11y/anchor-has-content */
    return (
        <a href={link} target="_blank" rel="noopener noreferrer" {...props} />
    );
};

export default SourceLink;
