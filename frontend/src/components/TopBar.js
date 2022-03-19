import { LogoutRounded, MenuRounded } from "@mui/icons-material";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Box,
  Button,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
  Divider,
  Tooltip,
  Avatar,
} from "@mui/material";
import React, { useState } from "react";
import sidebarItems from "../consts/sidebarItems";
import { Link } from "react-router-dom";

const TopBar = (props) => {
  const { darkModeButton } = props;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawer = (
    <Drawer
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      anchor="left"
      variant="temporary"
      sx={{
        width: "240px",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "240px",
          boxSizing: "border-box",
        },
      }}
    >
      <List>
        {sidebarItems.map((item, index) => (
          <>
            <ListItem button component={Link} to={item.route} key={index}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
            <Divider variant="middle" sx={{ mb: "5px", mt: "5px" }} />
          </>
        ))}
      </List>
    </Drawer>
  );

  function logOut() {
    localStorage.removeItem("token");
    document.location.reload();
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <CssBaseline />
        <AppBar
          color="transparent"
          position="fixed"
          sx={{ backdropFilter: "blur(20px)" }}
        >
          <Toolbar>
            {drawer}
            {localStorage.getItem("token") !== null && (
              <Tooltip title="Меню" arrow placement="bottom">
                <IconButton
                  edge="start"
                  onClick={() => setDrawerOpen(!drawerOpen)}
                >
                  <MenuRounded />
                </IconButton>
              </Tooltip>
            )}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, ml: "10px" }}
            >
              Code 404
            </Typography>
            {darkModeButton}
            {localStorage.getItem("token") !== null && (
              <>
                <Avatar />
                <IconButton sx={{ ml: "10px" }} onClick={logOut}>
                  <LogoutRounded />
                </IconButton>
              </>
            )}
            {localStorage.getItem("token") === null && (
              <Button component={Link} to="/sign-up" color="inherit">
                Регистрация
              </Button>
            )}
            {localStorage.getItem("token") === null && (
              <Button component={Link} to="/log-in" color="inherit">
                Вход
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default TopBar;
