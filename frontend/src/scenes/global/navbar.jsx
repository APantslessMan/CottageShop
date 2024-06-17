import { Box, Icon, IconButton, useTheme, Badge } from "@mui/material";
import { useContext, useState, useEffect, setState } from "react";
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
import { useNavigate } from "react-router-dom";
import "../../css/navbar.css";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { useCart } from "../../components/utils/CartWrapper";
import CartModal from "./cartModal";
import { DataContext } from "../../components/utils/DataContext";
import { useAuth } from "../../components/utils/AuthContext";

//Load pages here
const pages = [];

const CartButton = ({ onClick }) => {
  const { cartItemCount } = useCart();

  return (
    <Tooltip title="View Cart" placement="left">
      <IconButton color="primary" size="large" onClick={onClick}>
        <Badge badgeContent={cartItemCount} color="error">
          <ShoppingCartOutlined style={{ fontSize: 36, color: "ivory" }} />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

const NavBar = () => {
  const theme = useTheme();
  const { toggleColorMode, mode } = useContext(ColorModeContext);
  const [navAnchor, setNavAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openCartModal, setOpenCartModal] = useState(false);
  const { siteData } = useContext(DataContext);
  const { isLoggedIn, handleLogout, role, userName } = useAuth();
  const handleOpenCartModal = () => {
    setOpenCartModal(true);
  };

  const handleCloseCartModal = () => {
    setOpenCartModal(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  useEffect(() => {}, [userName]);

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
      if (action === handleLogout) {
        setTimeout(action, 500);
      } else {
        action();
      }
    });
  };

  const navigate = useNavigate();

  const userMenuItems = isLoggedIn
    ? [
        // {
        //   label: "Profile",
        //   action: [
        //     () => {
        //       handleCloseUserMenu();
        //       navigate("/login");
        //     },
        //   ],
        // },
        ...(role === "admin"
          ? [
              {
                label: "Admin",
                action: [
                  () => {
                    handleCloseUserMenu();
                    navigate("/admin");
                  },
                ],
              },
            ]
          : []),
        {
          label: "Logout",
          action: [
            () => {
              handleCloseUserMenu();
              handleLogout().then(() => localStorage.removeItem("cartItems"));
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
    <AppBar
      color="transparent"
      elevation={0}
      sx={{
        background: isScrolled ? "rgba(0, 0, 0, .2)" : "rgba(0, 0, 0, 1)",
        backdropFilter: "blur(10px)",
        boxShadow: "none",
        transition: "background-color 1s ease",
        zIndex: 1000,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Source Sans Pro",
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: ".2rem",
              color: theme.palette.navbar.main,
              textDecoration: "none",
            }}
          >
            {siteData.home_hero?.title || "Loading..."}
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
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "Source Sans Pro",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: theme.palette.navbar.main,
              textDecoration: "none",
            }}
          >
            {siteData.home_hero?.title || "Loading..."}
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: "none",
                md: "flex",
                textAlign: "right",
              },
            }}
          >
            <Box sx={{ flexGrow: 1 }}></Box>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "text.secondary",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  display: "block",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", pr: 1 }}>
            <IconButton onClick={toggleColorMode} color="primary">
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
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.text.secondary,
                    textTransform: "capitalize",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  {userName && userName.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>

            <CartButton onClick={handleOpenCartModal} />

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
          <CartModal open={openCartModal} onClose={handleCloseCartModal} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
