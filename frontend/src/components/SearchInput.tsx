import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

export default function SearchInput(props: any) {
  const { name, label, value, error = null, onChange, onClear, ...other } = props;
  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      width="100%"
      onChange={onChange}
      size="small"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {!value ? (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ) : (
              <IconButton onClick={onClear}>
                <ClearIcon />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
}
