import React, { FC, ReactElement, useState, useEffect } from "react";
import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledButtonDropdown,
} from "reactstrap";

interface DropdownProps {
    withNewLine?: boolean;
    value: any;
    values: any[];
    key?: string;
    color?: string;
    disabled?: boolean;
    valueDisplayName?: (value: any) => string;
    valueActiveCheck?: (value: any) => boolean;
    onChange: (value: any) => void;
    withSearch?: boolean;
    withSort?: boolean;
    [key: string]: any;
}

const Dropdown: FC<DropdownProps> = ({
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
}): ReactElement => {
    const [search, setSearch] = useState("");
    const [sortedValues, setSortedValues] = useState<any[]>([]);
    const [filteredValues, setFilteredValues] = useState<any[]>([]);

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
    }, [withSort, values, valueDisplayName]);

    useEffect(() => {
        if (withSearch === false || search === undefined || search === "") {
            setFilteredValues(sortedValues);
            return;
        }
        setFilteredValues(
            sortedValues.filter((value) => {
                return (
                    valueDisplayName !== undefined
                        ? valueDisplayName(value)
                        : value + ""
                )
                    .toLowerCase()
                    .includes(search.toLowerCase());
            })
        );
    }, [withSearch, search, sortedValues, valueDisplayName]);

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
                        <input
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

export default Dropdown;
