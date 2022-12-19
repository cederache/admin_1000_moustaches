import React from "react";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledButtonDropdown,
} from "reactstrap";
import PropTypes from "../utils/propTypes";

const NullableDropdown = ({
    value,
    values,
    key,
    color,
    disabled,
    onChange,
    ...props
}) => {
    return (
        <UncontrolledButtonDropdown key={key} {...props}>
            <DropdownToggle
                caret
                color={color || "primary"}
                className="text-capitalize m-1"
                disabled={disabled || false}
            >
                {value || "NSP"}
            </DropdownToggle>
            <DropdownMenu>
                {values.map((aValue) => {
                    return (
                        <DropdownItem
                            active={aValue === value}
                            onClick={() => onChange(aValue)}
                        >
                            {aValue}
                        </DropdownItem>
                    );
                })}
                <DropdownItem divider />
                <DropdownItem
                    active={value === null}
                    onClick={() => onChange(null)}
                >
                    NSP
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledButtonDropdown>
    );
};

NullableDropdown.propTypes = {
    value: PropTypes.string,
    values: PropTypes.array.isRequired,
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

export default NullableDropdown;
