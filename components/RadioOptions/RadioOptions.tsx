import React from 'react';
import style from './RadioOptions.module.scss';

interface Option {
  label: string;
  value: string; // Можно оставить string, если значения могут быть строками
}

interface RadioOptionsProps {
  name: string;
  options: Option[];
  selected?: string;
  onChange?: (value: string) => void; // Сделал необязательным, если нужно
  direction?: boolean;
}

const RadioOptions: React.FC<RadioOptionsProps> = ({ name, options, selected, onChange }) => {
  
  const handleChange = (value:string) => {
      if (onChange) {
          onChange(value);
      }
  };

  return (
      <div className={style.radioOptions}>
          {options.map((opt) => (
              <label key={opt.value} className={style.radioOption}>
                  <input
                      type="radio"
                      name={name}
                      className={style.radioInput}
                      value={opt.value}
                      checked={selected === opt.value}
                      onChange={() => handleChange(opt.value)}
                  />
                  {opt.label}
              </label>
          ))}
      </div>
  );
};

export default RadioOptions;