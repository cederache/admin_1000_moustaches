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
    valueDisplayName,
    valueActiveCheck,
    key,
    color,
    disabled,
    onChange,
    withNewLine,
    ...props
}) => {
    return (
        <>
            {withNewLine && <br />}
            <UncontrolledButtonDropdown key={key} {...props}>
                <DropdownToggle
                    caret
                    color={color || "primary"}
                    className="text-capitalize m-1"
                    disabled={disabled || false}
                >
                    {value !== null
                        ? valueDisplayName !== undefined
                            ? valueDisplayName(value)
                            : value
                        : "NSP"}
                </DropdownToggle>
                <DropdownMenu>
                    {values.map((aValue) => {
                        return (
                            <DropdownItem
                                active={
                                    valueActiveCheck !== undefined
                                        ? valueActiveCheck(aValue)
                                        : aValue === value
                                }
                                onClick={() => onChange(aValue)}
                            >
                                {valueDisplayName !== undefined
                                    ? valueDisplayName(aValue)
                                    : aValue}
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
        </>
    );
};

NullableDropdown.propTypes = {
    value: PropTypes.string,
    values: PropTypes.array.isRequired,
    valueDisplayName: PropTypes.func,
    valueActiveCheck: PropTypes.func,
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
    withNewLine: PropTypes.bool,
};

export default NullableDropdown;
