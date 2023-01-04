import React from "react";
import NullableDropdown from "./NullableDropdown";
import PropTypes from "../utils/propTypes";

const PriceLevelDropdown = ({ value, onChange, ...props }) => {
    let valueColor = (value) => {
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
    let valueText = (value) => {
        switch (value) {
            case 0:
                return "€";
            case 1:
                return "€€";
            case 2:
                return "€€€";
            default:
                return null;
        }
    };

    return (
        <NullableDropdown
            withNewLine={true}
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
                        onChange(null);
                    }
                },
            }}
        />
    );
};

PriceLevelDropdown.propTypes = {
    value: PropTypes.int,
    onChange: PropTypes.func,
};

export default PriceLevelDropdown;
