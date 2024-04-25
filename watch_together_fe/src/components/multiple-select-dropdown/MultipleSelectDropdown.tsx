import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(value: string, inputValue: readonly string[], theme: Theme) {
  return {
    fontWeight:
      inputValue.indexOf(value) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectDropdown({ valuesMap, onChangeAction } : {valuesMap: { [id: number]: string }, onChangeAction: (valueIds: string[] ) => void}) {
  const theme = useTheme();
  const [inputValues, setInputValues] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof inputValues>) => {
    const {
      target: { value },
    } = event;
    setInputValues(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    
    const valueIds = inputValues.map((inputValue) => {
        return Object.keys(valuesMap).find((key) => valuesMap[parseInt(key)] === inputValue) as string
    })
    onChangeAction(valueIds)
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: '100%', margin: '16px 0' }}>
        <InputLabel id="demo-multiple-chip-label">Genres</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={inputValues}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {Object.keys(valuesMap).map((valueMapKey) => (
            <MenuItem
              key={valueMapKey}
              value={valuesMap[parseInt(valueMapKey)]}
              style={getStyles(valuesMap[parseInt(valueMapKey)], inputValues, theme)}
            >
              {valuesMap[parseInt(valueMapKey)]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}