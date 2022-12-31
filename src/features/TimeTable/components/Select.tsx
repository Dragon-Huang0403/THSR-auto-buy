import React from "react";

type Option<TValue> = {
  value: TValue;
  label: string;
};

interface SelectProps<
  TValue extends string | number | readonly string[] | undefined
> {
  label?: string;
  value: TValue;
  onChange: (value: TValue) => void;
  options: Option<TValue>[];
}

export function Select<
  TValue extends string | number | readonly string[] | undefined
>({ label, value, onChange, options }: SelectProps<TValue>) {
  return (
    <div>
      {label && <div>{label}</div>}
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value as TValue);
        }}
      >
        {options.map((option) => (
          <option
            key={option.label}
            value={option.value}
            label={option.label}
          />
        ))}
      </select>
    </div>
  );
}
