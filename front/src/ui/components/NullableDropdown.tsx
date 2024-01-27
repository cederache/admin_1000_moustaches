import React, { FC, ReactElement } from "react";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledButtonDropdown,
} from "reactstrap";

interface NullableDropdownProps {
    value: any | undefined;
    values: any[];
    valueDisplayName?: (value: any) => string;
    valueActiveCheck?: (value: any) => boolean;
    key?: string;
    color?: string;
    disabled?: boolean;
    onChange: (value: any | undefined) => void;
    withNewLine?: boolean;
    [key: string]: any;
}

const NullableDropdown: FC<NullableDropdownProps> = ({
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
}): ReactElement => {
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
                            ? valueDisplayName(value!)
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
                        onClick={() => onChange(undefined)}
                    >
                        NSP
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledButtonDropdown>
        </>
    );
};

export default NullableDropdown;
