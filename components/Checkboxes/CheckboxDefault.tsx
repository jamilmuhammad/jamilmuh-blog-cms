import React from "react";

interface CheckboxDefaultProps {
    id: string
    type: string,
    name: string,
    handleClick: (e: React.ChangeEvent<HTMLInputElement>) => void,
    isChecked: boolean
}

const CheckboxDefault = ({ id, type, name, handleClick, isChecked }: CheckboxDefaultProps) => {
    return (
        <input
            id={id}
            name={name}
            type={type}
            onChange={handleClick}
            checked={isChecked}
        />
    );
};

export default CheckboxDefault;
