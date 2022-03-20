import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function ComboBox(props) {

  return (
    <Autocomplete
      disablePortal
      value={props.value}
      onChange={(event, newValue) => {
        props.onChangeCategory(newValue);
      }}
      id="combo-box-demo"
      options={props.categories}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Category" />}
    />
  );
}
