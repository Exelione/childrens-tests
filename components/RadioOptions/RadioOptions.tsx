import React from 'react';

interface Option {
    label: string;
    value: string; // Можно оставить string, если значения могут быть строками
}

interface RadioOptionsProps {
    name: string;
    options: Option[];
    selected?: string;
    onChange: (value: string) => void;
}

const RadioOptions: React.FC<RadioOptionsProps> = ({ name, options, selected, onChange }) => {
    return (
        <div className="optionsGroup">
            {options.map((opt) => (
                <label key={opt.value} className="optionLabel">
                    <input
                        type="radio"
                        name={name}
                        value={opt.value}
                        checked={selected === opt.value}
                        onChange={() => onChange(opt.value)}
                    />
                    {opt.label}
                </label>
            ))}
        </div>
    );
};

export default RadioOptions;