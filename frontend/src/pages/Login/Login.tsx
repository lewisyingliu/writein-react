import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@material-ui/core/Typography";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import AuthService from "../../services/auth.service";

const Login = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameState, setUsernameState] = useState({
    helperText: "",
    error: false,
  });
  const [passwordState, setPasswordState] = useState({
    helperText: "",
    error: false,
  });
  const [loginState, setLoginState] = useState({
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const username = event.target.value;
    setUsername(username);
    setLoginState({ message: "" });
    if (event.target.value.length >= 1) {
      setUsernameState({ helperText: "", error: false });
    } else {
      setUsernameState({ helperText: "Required", error: true });
    }
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setPassword(password);
    setLoginState({ message: "" });
    if (event.target.value.length > 4) {
      setPasswordState({ helperText: "", error: false });
    } else {
      setPasswordState({
        helperText: "Minimum characters is 5",
        error: true,
      });
    }
  };

  const handleLogin = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    AuthService.login(username, password).then(
      () => {
        setOpen(false);
        navigate("/");
        window.location.reload();
      },
      (error) => {
        setLoginState({ message: "Check your username and password" });
        setOpen(true);
      }
    );
  };

  return (
    <div>
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            paddingTop: 8,
            backgroundColor: "DodgerBlue",
          }}
        >
          <Typography style={{ fontSize: 45, fontStyle: "bold", color: "white" }}>Write In</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontSize: 25, fontStyle: "bold", color: "black" }}>Sign In</DialogContentText>
          <form noValidate autoComplete="new-password">
            <TextField
              fullWidth={true}
              variant="outlined"
              margin="normal"
              name="username"
              label="Username"
              // autoComplete="new-password"
              required={true}
              helperText={usernameState.helperText}
              onChange={onChangeUsername}
              error={usernameState.error}
            />
            <TextField
              fullWidth={true}
              variant="outlined"
              margin="normal"
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              autoComplete="new-password"
              required={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={passwordState.helperText}
              onChange={onChangePassword}
              error={passwordState.error}
            />
          </form>
          <p style={{ color: "red" }}>{loginState.message}</p>
        </DialogContent>
        <DialogActions>
          <Button
            style={{
              fontSize: 25,
              fontStyle: "bold",
              textTransform: "none",
              color: "white",
              backgroundColor: "DodgerBlue",
            }}
            fullWidth={true}
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Login;
