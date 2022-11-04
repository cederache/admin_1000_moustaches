import React from "react";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledButtonDropdown,
} from "reactstrap";
import PropTypes from "../utils/propTypes";

const BooleanDropdown = ({ value, key, disabled, onChange, ...props }) => {
    return (
        <>
            <br />
            <UncontrolledButtonDropdown key={key} {...props}>
                <DropdownToggle
                    caret
                    color={value == 1 ? "success" : "danger"}
                    className="text-capitalize m-1"
                    disabled={disabled || false}
                >
                    {value === 1 ? "Oui" : "Non"}
                </DropdownToggle>
                <DropdownMenu>
                    {[0, 1].map((aValue) => {
                        return (
                            <DropdownItem
                                active={aValue === value}
                                onClick={() => onChange(aValue)}
                            >
                                {aValue === 1 ? "Oui" : "Non"}
                            </DropdownItem>
                        );
                    })}
                    <DropdownItem divider />
                </DropdownMenu>
            </UncontrolledButtonDropdown>
        </>
    );
};

BooleanDropdown.propTypes = {
    value: PropTypes.bool.isRequired,
    key: PropTypes.string,
    color: PropTypes.oneOf([
        "primary",
        "secondary",
        "success",
        "danger",
        "warning",
        "info",
        "light",
        "dark",
    ]),
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};

export default BooleanDropdown;
