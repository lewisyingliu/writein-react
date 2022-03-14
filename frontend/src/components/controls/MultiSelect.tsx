import React from "react";
import { Checkbox, FormControl, InputLabel, ListItemIcon, ListItemText, Select as MuiSelect, MenuItem, FormHelperText } from "@material-ui/core";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps: any = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
};

export default function MultiSelect(props: any) {
  const { name, label, error = null, options, selected, setSelected } = props;

  const handleChange = (event: React.ChangeEvent<typeof selected>) => {
    const value = event.target.value.filter((val: typeof event.target.value) => !!val);
    if (value[value.length - 1] === "all") {
      setSelected(selected.length === options.length ? [] : options);
      return;
    }
    setSelected(value);
  };

  return (
    <FormControl size="small" variant="outlined" {...(error && { error: true })}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        multiple
        label={label}
        name={name}
        value={selected}
        onChange={handleChange}
        renderValue={(selected: any) =>
          selected.map(function (item: any) {
            return item["title"] + ",";
          })
        }
        MenuProps={MenuProps}
      >
        <MenuItem value="all">
          <ListItemIcon>
            <Checkbox checked={options.length > 0 && selected.length === options.length} indeterminate={selected.length > 0 && selected.length < options.length} />
          </ListItemIcon>
          <ListItemText primary="Select All" />
        </MenuItem>
        {options.map((option: any) => (
          <MenuItem key={option.id} value={option}>
            <ListItemIcon>
              <Checkbox checked={selected.indexOf(option) > -1} />
            </ListItemIcon>
            <ListItemText primary={option.title} />
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
