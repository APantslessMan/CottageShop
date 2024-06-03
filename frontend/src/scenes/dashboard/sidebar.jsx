import React, { useState } from "react";
import { Sidebar, Menu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import { MenuItem } from "react-pro-sidebar";
import "./sidebar.css";

const Item = ({ value, title, icon, onClick, selected, theme }) => {
  const isSelected = selected === value;

  return (
    <MenuItem active={isSelected} onClick={onClick} icon={icon}>
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const AdminSidebar = ({ handleItemClick, selectedItem }) => {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [setSelected] = useState("Dashboard");

  const menuItems = [
    {
      type: "item",
      title: "Dashboard",
      icon: <HomeOutlinedIcon />,
      value: "dashboard",
      display: "true",
    },
    {
      type: "title",
      title: "Users",
      icon: <ContactsOutlinedIcon />,
      value: "userManagement",
      display: "true",
    },

    {
      type: "item",
      title: "User Editor",
      icon: <PeopleOutlinedIcon />,
      value: "userManagement",
      display: "true",
    },
    {
      type: "item",
      title: "Product Management",
      icon: <ContactsOutlinedIcon />,
      value: "productManagement",
      display: "true",
    },
    {
      type: "item",
      title: "Analytics",
      icon: <BarChartOutlinedIcon />,
      value: "analytics",
    },
  ];

  const handleItemClickInternal = (item) => {
    setSelected(item);
    handleItemClick(item);
  };

  return (
    <Box
      backgroundColor={theme.palette.background.default}
      sx={{ marginTop: "73px" }}
    >
      <Sidebar
        collapsed={isCollapsed}
        style={{ height: "100vh", border: "none !important" }}
        sx={{ "&&": { border: "none" } }}
        backgroundColor={theme.palette.background.default}
        className="custom-sidebar"
      >
        <Menu
          iconShape="round"
          rootStyles={{
            border: "none",
            overflow: "hidden",
            height: "100%",
          }}
          menuItemStyles={{
            root: { border: "none" },
            button: ({ level, active, disabled }) => {
              if (level === 0) {
                return {
                  color: disabled ? "black" : theme.palette.text.main,
                  backgroundColor: active
                    ? theme.palette.background.paper
                    : theme.palette.background.default,
                  "&:hover": {
                    color: theme.palette.text.secondary + "!important",
                    background: theme.palette.background.paper + "!important",
                  },
                  border: "none",
                };
              }
            },
          }}
        >
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={theme.palette.text.main}>
                  Admin Panel
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {menuItems.map(
              (item) =>
                item.display &&
                (item.type === "item" ? (
                  <Item
                    key={item.value}
                    title={item.title}
                    icon={item.icon}
                    onClick={() => handleItemClickInternal(item.value)}
                    selected={selectedItem}
                    setSelected={setSelected}
                    theme={theme}
                    value={item.value}
                  />
                ) : (
                  <Typography
                    key={item.title}
                    variant="h6"
                    color={theme.palette.text.main}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    {item.title}
                  </Typography>
                ))
            )}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
    // </Paper>
  );
};

export default AdminSidebar;
