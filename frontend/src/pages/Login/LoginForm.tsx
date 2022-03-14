import React, { useState } from "react";
import { Grid, Paper, InputAdornment, IconButton, makeStyles } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import AuthService from "../../services/auth.service";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

const initialValues = {
  username: "",
  password: "",
};

export default function LoginForm(props: any) {
  const classes = useStyles();
  const { processFormData } = props;
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("username" in fieldValues) temp.username = fieldValues.username.length > 4 ? "" : "Minimum characters is 5.";
    if ("password" in fieldValues) temp.password = fieldValues.password.length > 4 ? "" : "Minimum characters is 5.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values) return Object.values(temp).every((x) => x === "");
  };

  const { values, errors, setErrors, dataErrors, setDataErrors, handleInputChange } = useForm(initialValues, true, validate);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      AuthService.login(values.username, values.password).then(
        () => {
          const user = AuthService.getCurrentUser();
          processFormData(user);
        },
        (error) => {
          setDataErrors("Check your username and password");
        }
      );
    }
  };

  return (
    <Paper className={classes.pageContent}>
      <Form onSubmit={handleSubmit}>
        <Grid
          container
          style={{
            paddingTop: "2px",
            paddingRight: "15px",
            marginBottom: "2em",
            width: "450px",
            border: "1px solid grey",
          }}
        >
          <Grid item xs={12}>
            <Controls.Input
              size="medium"
              name="username"
              label="User Name"
              value={values.username}
              onChange={handleInputChange}
              error={errors.username}
              autoComplete="off"
              autoFocus
            />
            <Controls.Input
              size="medium"
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
          </Grid>
          <Grid item xs={12}>
            <div style={{ paddingLeft: "10px", color: "red" }}>{dataErrors ? dataErrors : " "}</div>
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <div>
              <Controls.DialogButton
                style={{
                  fontSize: 25,
                  fontStyle: "bold",
                  textTransform: "none",
                  color: "white",
                  backgroundColor: "DodgerBlue",
                }}
                type="submit"
                text="Sign In"
                fullWidth={true}
              />
            </div>
          </Grid>
        </Grid>
      </Form>
    </Paper>
  );
}
