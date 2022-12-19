import React, { useEffect, useState } from "react";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Input,
    UncontrolledButtonDropdown,
} from "reactstrap";
import PropTypes from "../utils/propTypes";

const Dropdown = ({
    withNewLine,
    value,
    values,
    key,
    color,
    disabled,
    valueDisplayName,
    valueActiveCheck,
    onChange,
    withSearch,
    withSort,
    ...props
}) => {
    const [search, setSearch] = useState("");
    const [sortedValues, setSortedValues] = useState([]);
    const [filteredValues, setFilteredValues] = useState([]);

    useEffect(() => {
        let sortedValues = values;
        if (withSort === true) {
            sortedValues.sort((a, b) => {
                let aValue =
                    valueDisplayName !== undefined ? valueDisplayName(a) : a;
                let bValue =
                    valueDisplayName !== undefined ? valueDisplayName(b) : b;

                if (aValue < bValue) return -1;
                else if (aValue > bValue) return 1;
                else return 0;
            });
        }
        setSortedValues(sortedValues);
        setFilteredValues(sortedValues);
    }, [values]);

    useEffect(() => {
        if (search === "") {
            setFilteredValues(sortedValues);
            return;
        }
        setFilteredValues(
            sortedValues.filter((value) => {
                return (
                    valueDisplayName !== undefined
                        ? valueDisplayName(value)
                        : value
                )
                    .toLowerCase()
                    .includes(search.toLowerCase());
            })
        );
    }, [search]);

    return (
        <>
            {withNewLine && <br />}
            <UncontrolledButtonDropdown key={key} {...props}>
                <DropdownToggle
                    caret
                    color={color}
                    className="text-capitalize m-1"
                    disabled={disabled || false}
                >
                    {valueDisplayName !== undefined
                        ? valueDisplayName(value)
                        : value}
                </DropdownToggle>
                <DropdownMenu>
                    {withSearch === true && (
                        <Input
                            value={search}
                            onChange={(evt) => setSearch(evt.target.value)}
                        />
                    )}
                    {filteredValues.map((aValue) => {
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
                </DropdownMenu>
            </UncontrolledButtonDropdown>
        </>
    );
};

Dropdown.propTypes = {
    value: PropTypes.any.isRequired,
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
    valueDisplayName: PropTypes.func,
    valueActiveCheck: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    withSearch: PropTypes.bool,
    withSort: PropTypes.bool,
};

export default Dropdown;
