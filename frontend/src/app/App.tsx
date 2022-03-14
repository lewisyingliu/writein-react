import React, { Suspense, useState, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import classNames from "classnames";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Button, ListItem } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import ElectionIcon from "@mui/icons-material/HowToVote";
import OfficeIcon from "@mui/icons-material/AccountBalance";
import CountingBoardIcon from "@mui/icons-material/Ballot";
import RecordIcon from "@mui/icons-material/WrapText";
import ProfileIcon from "@mui/icons-material/ContactPage";
import AdminUserIcon from "@mui/icons-material/SupervisorAccount";
import PersonIcon from "@mui/icons-material/Person";
import Loading from "../common/Loading";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Login from "../pages/Login/Login";
// import LoginForm from "../pages/Login/LoginForm";
// import LoginPopup from "../components/LoginPopup";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import logo from "../logo.png";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appFrame: {
    zIndex: 1,
    overflow: "hidden",
    height: "100vh",
  },
  appBar: {
    position: "fixed",
    width: "100%",
    zIndex: 1400,
    background: "DodgerBlue",
    color: "White",
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  drawerPaper: {
    position: "fixed",
    width: drawerWidth,
    borderRadius: 0,
    borderTop: "none",
    borderBottom: "none",
    top: theme.spacing(8), // push content down to fix scrollbar position
    height: `calc(100% - ${theme.spacing(8)}px)`, // subtract appbar height
  },
  drawerContent: {
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
  contentWrapper: {
    overflow: "auto",
    position: "fixed",
    top: theme.spacing(8),
    height: "calc(100% - 64px)", // Subtract width of header
    width: "calc(100% - 240px)",
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  writeinWrapper: {
    overflow: "auto",
    position: "fixed",
    top: theme.spacing(8),
    height: "calc(100% - 64px)", // Subtract width of header
    width: "calc(100% - 6px)",
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentLeft: {
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  content: {
    padding: theme.spacing(3),
  },
  paperButton: {
    fontSize: "16px",
    textTransform: "none",
    marginRight: 15,
    backgroundColor: "#007bff",
  },
  toolbarButtons: {
    marginRight: 15,
    marginTop: "auto",
    textTransform: "none",
    fontSize: "16px",
  },
  toolbar: {
    display: "flex",
    height: "75px",
    marginLeft: "auto",
    marginTop: "auto",
    alignSelf: "flex-end",
  },
  userName: {
    marginRight: 15,
    marginTop: "auto",
    fontSize: "16px",
    marginBottom: 7,
  },
  logo: {
    maxWidth: 33,
    marginRight: 5,
  },
  link: {
    textDecoration: "none",
    fontSize: 18,
    color: "DodgerBlue",
    fontWeight: 300,
    lineHeight: 2,
  },
}));

const App = () => {
  const classes = useStyles();
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
  const [open, setOpen] = useState(false);
  // const [openPopup, setOpenPopup] = useState(false);
  // const [popupTitle, setPopupTitle] = useState("");
  const handleDrawerToggle = () => setOpen(!open);

  // useEffect(() => {
  //   if (currentUser && currentUser.roles) {
  //     setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
  //     setOpen(currentUser.roles.includes("ROLE_ADMIN"));
  //   } else {
  //     openLoginPopup();
  //   }
  // }, [currentUser]);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
      setOpen(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  // const openLoginPopup = () => {
  //   setPopupTitle("Write In");
  //   setOpenPopup(true);
  //   setCurrentUser(undefined);
  // };

  // const processFormData = (entity: IUser) => {
  //   setOpenPopup(false);
  //   setCurrentUser(entity);
  // };

  const drawer = (
    <Drawer variant="persistent" anchor="left" open={open} elevation={0} PaperProps={{ variant: "outlined" }} classes={{ paper: classes.drawerPaper }}>
      <div className={classes.drawerContent}>
        {showAdminBoard ? (
          <List style={{ flexGrow: 1 }}>
            <ListItem>
              <ListItemIcon>
                <ElectionIcon color="primary" />
              </ListItemIcon>
              <Typography>
                <Link to="/election" className={classes.link}>
                  Election
                </Link>
              </Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AdminUserIcon color="primary" />
              </ListItemIcon>
              <Typography>
                <Link to="/adminUser" className={classes.link}>
                  Admin User
                </Link>
              </Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CountingBoardIcon color="primary" />
              </ListItemIcon>
              <Typography>
                <Link to="/countingBoard" className={classes.link}>
                  Counting Board
                </Link>
              </Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <OfficeIcon color="primary" />
              </ListItemIcon>
              <Typography>
                <Link to="/office" className={classes.link}>
                  Office
                </Link>
              </Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <Typography>
                <Link to="/user" className={classes.link}>
                  Write In User
                </Link>
              </Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <RecordIcon color="primary" />
              </ListItemIcon>
              <Typography>
                <Link to="/record" className={classes.link}>
                  Write In Records
                </Link>
              </Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ProfileIcon color="primary" />
              </ListItemIcon>
              <Typography>
                <Link to="/profile" className={classes.link}>
                  Profile
                </Link>
              </Typography>
            </ListItem>
          </List>
        ) : (
          <List style={{ flexGrow: 1 }}>
            <ListItem>
              <ListItemIcon>
                <RecordIcon color="primary" />
              </ListItemIcon>
              <Typography>
                <Link to="/writein" className={classes.link}>
                  Write In App
                </Link>
              </Typography>
            </ListItem>
          </List>
        )}
      </div>
    </Drawer>
  );

  const ElectionView = React.lazy(() => import("../pages/Election/ElectionView"));
  const CountingBoardView = React.lazy(() => import("../pages/CountingBoard/CountingBoardView"));
  const UserView = React.lazy(() => import("../pages/User/UserView"));
  const OfficeView = React.lazy(() => import("../pages/Office/OfficeView"));
  const AdminUserView = React.lazy(() => import("../pages/AdminUser/AdminUserView"));
  const WriteInView = React.lazy(() => import("../pages/WriteIn/WriteInView"));
  const RecordView = React.lazy(() => import("../pages/Record/RecordView"));
  const Profile = React.lazy(() => import("../pages/Login/Profile"));
  const NotFound = React.lazy(() => import("../common/NotFound"));

  return (
    <div className={classes.root}>
      <CssBaseline />
      {currentUser ? (
        <div className={classes.appFrame}>
          <AppBar className={classes.appBar} elevation={0}>
            <Toolbar disableGutters={true}>
              <IconButton color="inherit" aria-label="Open drawer" onClick={handleDrawerToggle} className={classes.menuButton} disabled={!showAdminBoard}>
                <MenuIcon />
              </IconButton>
              <img src={logo} alt="logo" className={classes.logo} />
              <Typography variant="h4" noWrap>
                Write-In Manager
              </Typography>
              <div className={classes.toolbar}>
                {currentUser && <Typography className={classes.userName}>{currentUser.username}</Typography>}
                <Button className={classes.toolbarButtons} color="inherit" startIcon={<LogoutIcon />} onClick={logOut}>
                  Logout
                </Button>
              </div>
            </Toolbar>
          </AppBar>
          {drawer}
          {showAdminBoard ? (
            <div
              className={classNames(classes.contentWrapper, {
                [classes.contentShift]: open,
                [classes.contentLeft]: open,
              })}
            >
              <div className={classes.content}>
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/election" element={<ElectionView />} />
                    <Route path="/adminUser" element={<AdminUserView />} />
                    <Route path="/countingBoard" element={<CountingBoardView />} />
                    <Route path="/office" element={<OfficeView />} />
                    <Route path="/user" element={<UserView />} />
                    <Route path="/record" element={<RecordView />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/" element={<ElectionView />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
          ) : (
            <div
              className={classNames(classes.writeinWrapper, {
                [classes.contentShift]: open,
                [classes.contentLeft]: open,
              })}
            >
              <div className={classes.content}>
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/writein" element={<WriteInView />} />
                    <Route path="/" element={<WriteInView />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};
export default App;
