import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

const Item = ({ title, icon, onClick, selected }) => {
  const theme = useTheme();
  const isSelected = selected === title;

  return (
    console.log("color:", theme.palette.primary),
    (
      <MenuItem
        active={isSelected}
        onClick={onClick}
        icon={icon}
        style={{
          color: isSelected
            ? theme.palette.primary.contrastText
            : theme.palette.text.primary,
          backgroundColor: isSelected
            ? theme.palette.primary.secondary
            : "transparent",
          "&:hover": {
            color: theme.palette.secondary,
            backgroundColor: theme.palette.primary.light,
          },
        }}
      >
        <Typography>{title}</Typography>
      </MenuItem>
    )
  );
};

const AdminSidebar = ({ handleItemClick }) => {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const menuItems = [
    { title: "Dashboard", icon: <HomeOutlinedIcon />, value: "dashboard" },
    {
      title: "User Management",
      icon: <PeopleOutlinedIcon />,
      value: "userManagement",
    },
    {
      title: "Product Management",
      icon: <ContactsOutlinedIcon />,
      value: "productManagement",
    },
    { title: "Analytics", icon: <BarChartOutlinedIcon />, value: "analytics" },
  ];

  const handleItemClickInternal = (item) => {
    setSelected(item);
    handleItemClick(item);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: theme.palette.background.paper,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: theme.palette.secondary + " !important",
          backgroundColor: theme.palette.secondary + " !important",
        },
        "& .pro-menu-item.active": {
          color: theme.palette.secondary + " !important",
          backgroundColor: theme.palette.secondary + " !important",
        },
      }}
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: theme.palette.text.primary,
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={theme.palette.text.primary}>
                  Admin Panel
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {menuItems.map((item) => (
              <Item
                key={item.value}
                title={item.title}
                icon={item.icon}
                onClick={() => handleItemClickInternal(item.value)}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default AdminSidebar;
