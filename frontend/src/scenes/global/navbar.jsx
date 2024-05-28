import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Menu } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import BreakfastDiningIcon from "@mui/icons-material/BreakfastDining";
import { useNavigate } from "react-router-dom";

// Placeholder for menu item
const pages = ["Breads", "About", "Blog"];

const NavBar = ({ isLoggedIn, onLogout, userName }) => {
  const theme = useTheme();
  const { toggleColorMode, mode } = useContext(ColorModeContext);
  const [navAnchor, setNavAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);

  const handleOpenNavMenu = (event) => {
    setNavAnchor(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setUserAnchor(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setNavAnchor(null);
  };

  const handleCloseUserMenu = () => {
    setUserAnchor(null);
  };
  const handleUserMenuClick = (actions) => {
    actions.forEach((action) => {
      if (action === onLogout) {
        setTimeout(action, 500); // delay in milliseconds
      } else {
        action();
      }
    });
  };
  const navigate = useNavigate();

  const userMenuItems = isLoggedIn
    ? [
        {
          label: "Profile",
          action: [
            () => {
              handleCloseUserMenu();
              navigate("/login");
            },
          ],
        },
        {
          label: "Admin",
          action: [
            () => {
              handleCloseUserMenu();
              navigate("/admin");
            },
          ],
        },
        {
          label: "Logout",
          action: [
            () => {
              handleCloseUserMenu();
              onLogout();
              navigate("/");
            },
          ],
        },
      ]
    : [
        { label: "Login", action: [() => navigate("/login")] },
        { label: "Register", action: [() => navigate("/register")] },
      ];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <BreakfastDiningIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            CottageShop
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              slotProps={{
                paper: {
                  sx: {
                    background: mode === "dark" ? "#333" : "#fff",
                  },
                },
              }}
              id="menu-appbar"
              anchorEl={navAnchor}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(navAnchor)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <BreakfastDiningIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            CottageShop
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ display: "flex", alignItems: "center", pr: 1 }}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === "dark" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlinedIcon />
              )}
            </IconButton>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  key={userName}
                  sx={{
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    textTransform: "capitalize",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  {userName && userName.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              slotProps={{
                paper: {
                  sx: {
                    background: mode === "dark" ? "#333" : "#fff",
                  },
                },
              }}
              sx={{
                mt: "45px",
              }}
              id="menu-appbar"
              anchorEl={userAnchor}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(userAnchor)}
              onClose={handleCloseUserMenu}
            >
              {userMenuItems.map((item) => (
                <MenuItem
                  key={item.label}
                  onClick={() => handleUserMenuClick(item.action)}
                >
                  <Typography textAlign="center">{item.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
