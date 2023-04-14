import React, { FC } from "react";
import NullableDropdown from "./NullableDropdown";

interface PriceLevelDropdownProps {
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    [key: string]: any;
}

const PriceLevelDropdown: FC<PriceLevelDropdownProps> = ({
    value,
    onChange,
    ...props
}) => {
    let valueColor = (value: number | undefined): string => {
        switch (value) {
            case 0:
                return "success";
            case 1:
                return "warning";
            case 2:
                return "danger";
            default:
                return "warning";
        }
    };
    let valueText = (value: number | undefined): string | undefined => {
        switch (value) {
            case 0:
                return "€";
            case 1:
                return "€€";
            case 2:
                return "€€€";
            default:
                return undefined;
        }
    };

    return (
        <NullableDropdown
            {...{
                ...props,
                // 0, 1, 2
                values: ["€", "€€", "€€€"],
                value: valueText(value),
                color: valueColor(value),
                onChange: (newValue) => {
                    if (newValue === "€") {
                        onChange(0);
                    } else if (newValue === "€€") {
                        onChange(1);
                    } else if (newValue === "€€€") {
                        onChange(2);
                    } else {
                        onChange(undefined);
                    }
                },
            }}
        />
    );
};

export default PriceLevelDropdown;
