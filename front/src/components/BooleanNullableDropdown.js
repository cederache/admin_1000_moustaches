import React from "react";
import NullableDropdown from "./NullableDropdown";
import PropTypes from "../utils/propTypes";

const BooleanNullableDropdown = ({ value, onChange, ...props }) => {
    return (
        <NullableDropdown
            {...{
                ...props,
                values: ["Oui", "Non"],
                value: value === null ? null : value === 1 ? "Oui" : "Non",
                color:
                    value === null
                        ? "warning"
                        : value == 1
                        ? "success"
                        : "danger",
                onChange: (newValue) => {
                    if (newValue === "Oui") {
                        onChange(1);
                    } else if (newValue === "Non") {
                        onChange(0);
                    } else {
                        onChange(null);
                    }
                },
            }}
        />
    );
};

BooleanNullableDropdown.propTypes = {
    value: PropTypes.bool,
    onChange: PropTypes.func,
};

export default BooleanNullableDropdown;
