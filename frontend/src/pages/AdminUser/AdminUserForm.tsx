import React, { useEffect, useState } from "react";
import { Grid, MenuItem, InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import DataService from "../../services/adminUser.service";

const options = [{ status: "Active" }, { status: "Archived" }, { status: "Locked" }];

const initialValues = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  email: "",
  status: "",
};

export default function AdminUserForm(props: any) {
  const { processFormData, recordForEdit, setOpenPopup } = props;
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    recordForEdit && setValues({ ...recordForEdit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordForEdit]);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("username" in fieldValues) temp.username = fieldValues.username.length > 4 ? "" : "Minimum characters is 5.";
    if ("password" in fieldValues) temp.password = fieldValues.password.length > 4 ? "" : "Minimum characters is 5.";
    if ("email" in fieldValues) temp.email = /$^|.+@.+..+/.test(fieldValues.email) ? "" : "Email is not valid.";
    if ("status" in fieldValues) temp.status = fieldValues.status ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values) return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, dataErrors, setDataErrors, handleInputChange } = useForm(initialValues, true, validate);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      if (!recordForEdit) {
        DataService.checkUsername(values.username).then(
          (response) => {
            processFormData(values, setDataErrors);
          },
          (error) => {
            setDataErrors(error.response.data.message);
          }
        );
      } else {
        processFormData(values, setDataErrors);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid
        container
        style={{
          paddingTop: "2px",
          marginBottom: "1em",
          width: "700px",
          border: "1px solid grey",
        }}
      >
        <Grid
          item
          xs={6}
          style={{
            paddingTop: "2px",
            paddingRight: "15px",
            width: "300px",
          }}
        >
          <Controls.Input
            name="username"
            label="User Name"
            value={values.username}
            onChange={handleInputChange}
            error={errors.username}
            autoComplete="off"
            autoFocus
            // inputRef={callbackRef}
          />
          {!recordForEdit && (
            <Controls.Input
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleInputChange}
              error={errors.password}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          <Controls.Input name="email" label="Email" value={values.email == null ? "" : values.email} onChange={handleInputChange} error={errors.email} />
        </Grid>
        <Grid
          item
          xs={6}
          style={{
            paddingTop: "2px",
            paddingRight: "15px",
            width: "300px",
          }}
        >
          <Controls.Input name="firstName" label="First Name" value={values.firstName == null ? "" : values.firstName} onChange={handleInputChange} error={errors.firstName} />
          <Controls.Input name="lastName" label="Last Name" value={values.lastName == null ? "" : values.lastName} onChange={handleInputChange} error={errors.lastName} />
          <Controls.Input name="status" label="Status" value={values.status == null ? "" : values.status} onChange={handleInputChange} error={errors.status} select>
            {options.map((option) => (
              <MenuItem key={option.status} value={option.status}>
                {option.status}
              </MenuItem>
            ))}
          </Controls.Input>
        </Grid>
        <Grid item xs={12}>
          <div style={{ paddingLeft: "10px", color: "red" }}>{dataErrors ? dataErrors : " "}</div>
        </Grid>
      </Grid>
      <Grid container justifyContent="flex-end">
        <Grid item xs={12}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Controls.DialogButton type="submit" text="Submit" />
            <Controls.DialogButton
              text="Cancel"
              color="default"
              onClick={() => {
                setOpenPopup(false);
              }}
            />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
