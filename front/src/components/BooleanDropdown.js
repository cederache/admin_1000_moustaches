import React from "react";
import PropTypes from "../utils/propTypes";
import Dropdown from "./Dropdown";

const BooleanDropdown = ({ value, key, disabled, onChange, ...props }) => {
    return (
        <>
            <Dropdown
                value={value}
                values={[0, 1]}
                key={key}
                color={value == 1 ? "success" : "danger"}
                disabled={disabled || false}
                valueDisplayName={(aValue) => (aValue === 1 ? "Oui" : "Non")}
                onChange={onChange}
                {...props}
            />
        </>
    );
};

BooleanDropdown.propTypes = {
    value: PropTypes.number.isRequired,
    key: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};

export default BooleanDropdown;
