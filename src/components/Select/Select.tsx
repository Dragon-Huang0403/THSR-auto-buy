import type { SelectChangeEvent } from '@mui/material';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { MenuItem, Select as MuiSelect } from '@mui/material';
import React from 'react';

type Option = {
  label: string;
};

interface SelectProps<TOption extends Option> {
  label: string;
  options: readonly TOption[];
  value: TOption;
  onChange: (newOption: TOption) => void;
}

export function Select<TOption extends Option>({
  label,
  value,
  options,
  onChange,
}: SelectProps<TOption>) {
  const handleOnChange = (e: SelectChangeEvent<string>) => {
    const newOptionLabel = e.target.value;
    const newOption = options.find(
      (option) => option.label === newOptionLabel,
    ) as TOption;
    onChange(newOption);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        label={label}
        value={value.label}
        onChange={handleOnChange}
        fullWidth
      >
        {options.map((option) => (
          <MenuItem key={option.label} value={option.label}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
