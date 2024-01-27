import React, { FC, ChangeEvent } from "react";

interface SwitchProps {
    id?: string;
    isOn: boolean | undefined;
    handleToggle: (event: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

const Switch: FC<SwitchProps> = ({
    id,
    isOn,
    handleToggle,
    disabled = false,
}) => {
    return (
        <>
            <input
                disabled={disabled}
                checked={isOn}
                onChange={handleToggle}
                className="react-switch-checkbox"
                id={id || `react-switch-new`}
                type="checkbox"
            />
            <label
                style={{ background: isOn ? "#06D6A0" : "grey" }}
                className="react-switch-label"
                htmlFor={id || `react-switch-new`}
            >
                <span className={`react-switch-button`} />
            </label>
        </>
    );
};

export default Switch;
