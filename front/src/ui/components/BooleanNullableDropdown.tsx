import React, { FC, ReactElement } from "react";
import NullableDropdown from "./NullableDropdown";

interface BooleanNullableDropdownProps {
    value: boolean | undefined;
    onChange: (value: boolean | undefined) => void;
    [key: string]: any;
}

const BooleanNullableDropdown: FC<BooleanNullableDropdownProps> = ({
    value,
    onChange,
    ...props
}): ReactElement => {
    return (
        <NullableDropdown
            {...{
                ...props,
                values: ["Oui", "Non"],
                value:
                    value === null || value === undefined
                        ? null
                        : value === true
                        ? "Oui"
                        : "Non",
                color:
                    value === null || value === undefined
                        ? "warning"
                        : value === true
                        ? "success"
                        : "danger",
                onChange: (newValue: string | null) => {
                    if (newValue === "Oui") {
                        onChange(true);
                    } else if (newValue === "Non") {
                        onChange(false);
                    } else {
                        onChange(undefined);
                    }
                },
            }}
        />
    );
};

export default BooleanNullableDropdown;
