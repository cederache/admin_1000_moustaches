import React, { FC, ReactElement } from "react";
import Dropdown from "./Dropdown";

interface BooleanDropdownProps {
    value: number;
    key?: string;
    disabled?: boolean;
    onChange: (value: number) => void;
    [key: string]: any;
}

const BooleanDropdown: FC<BooleanDropdownProps> = ({
    value,
    key,
    disabled,
    onChange,
    ...props
}): ReactElement => {
    return (
        <>
            <Dropdown
                value={value}
                values={[0, 1]}
                key={key}
                color={value === 1 ? "success" : "danger"}
                disabled={disabled || false}
                valueDisplayName={(aValue: number) =>
                    aValue === 1 ? "Oui" : "Non"
                }
                onChange={onChange}
                {...props}
            />
        </>
    );
};

export default BooleanDropdown;
