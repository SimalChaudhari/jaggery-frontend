import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

// ----------------------------------------------------------------------

export function RHFSelect({
  name,
  native,
  children,
  slotProps,
  helperText,
  inputProps,
  InputLabelProps,
  ...other
}) {
  const { control } = useFormContext();

  const labelId = `${name}-select-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{
            native,
            MenuProps: { PaperProps: { sx: { maxHeight: 220, ...slotProps?.paper } } },
            sx: { textTransform: 'capitalize' },
          }}
          InputLabelProps={{ htmlFor: labelId, ...InputLabelProps }}
          inputProps={{ id: labelId, ...inputProps }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFMultiSelect({
  name,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  slotProps,
  helperText,
  showSelectAll,
  onSelectAll,
  ...other
}) {
  const { control, setValue } = useFormContext();

  const labelId = `${name}-select-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const allSelected = options.length > 0 && options.every((option) => field.value.includes(option.value));
        const someSelected = field.value.length > 0 && !allSelected;

        const handleSelectAll = (e) => {
          e.stopPropagation();
          if (onSelectAll) {
            onSelectAll();
          } else if (allSelected) {
            setValue(name, [], { shouldValidate: true });
          } else {
            const allValues = options.map((option) => option.value);
            setValue(name, allValues, { shouldValidate: true });
          }
        };

        return (
          <FormControl error={!!error} {...other}>
            {label && (
              <InputLabel htmlFor={labelId} {...slotProps?.inputLabel}>
                {label}
              </InputLabel>
            )}

            <Select
              {...field}
              multiple
              displayEmpty={!!placeholder}
              label={label}
              renderValue={(selected) => {
                const selectedItems = options.filter((item) => selected.includes(item.value));

                if (!selectedItems.length && placeholder) {
                  return <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>;
                }

                if (chip) {
                  return (
                    <Box sx={{ gap: 0.5, display: 'flex', flexWrap: 'wrap' }}>
                      {selectedItems.map((item) => (
                        <Chip
                          key={item.value}
                          size="small"
                          variant="soft"
                          label={item.label}
                          {...slotProps?.chip}
                        />
                      ))}
                    </Box>
                  );
                }

                return selectedItems.map((item) => item.label).join(', ');
              }}
              {...slotProps?.select}
              inputProps={{ id: labelId, ...slotProps?.select?.inputProps }}
            >
              {showSelectAll && checkbox && (
                <>
                  <MenuItem onClick={handleSelectAll}>
                    <Checkbox
                      size="small"
                      disableRipple
                      checked={allSelected}
                      indeterminate={someSelected}
                      {...slotProps?.checkbox}
                    />
                    Select All
                  </MenuItem>
                  <Divider />
                </>
              )}
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {checkbox && (
                    <Checkbox
                      size="small"
                      disableRipple
                      checked={field.value.includes(option.value)}
                      {...slotProps?.checkbox}
                    />
                  )}

                  {option.label}
                </MenuItem>
              ))}
            </Select>

            {(!!error || helperText) && (
              <FormHelperText error={!!error} {...slotProps?.formHelperText}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
}
