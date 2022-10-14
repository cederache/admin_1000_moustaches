import React from "react";
import NullableDropdown from "./NullableDropdown";
import PropTypes from "../utils/propTypes";

const BooleanNullableDropdown = ({ value, onChange, ...props }) => {
    return (
        <NullableDropdown
            {...{
                ...props,
                values: ["Oui", "Non"],
                value: value === null ? null : value === true ? "Oui" : "Non",
                onChange: (newValue) => {
                    if (newValue === "Oui") {
                        onChange(true);
                    } else if (newValue === "Non") {
                        onChange(false);
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
