import React, { useState } from "react";
import { Sidebar, Menu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Paper } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import { MenuItem } from "react-pro-sidebar";
import styled from "@emotion/styled";
import "./sidebar.css";

// const MenuItem = styled(({ isSelected, ...props }) => {
//   console.log("isSelected:", isSelected); // Log the value of isSelected
//   console.log("props:", props); // Log all props passed to the styled component

//   return <ProSidebarMenuItem {...props} />;
// };
// })`
//   &.ps-menuitem-root.ps-active .ps-menu-button {
//     background: ${(props) =>
//       props.isSelected ? props.theme.palette.secondary.main : "transparent"};
//     color: ${(props) =>
//       props.isSelected
//         ? props.theme.palette.text.secondary
//         : props.theme.palette.text.main};

// `;

const Item = ({ value, title, icon, onClick, selected, theme }) => {
  const isSelected = selected === value;

  return (
    console.log(`${title} isSelected:`, isSelected),
    (
      <MenuItem
        active={isSelected}
        onClick={onClick}
        icon={icon}
        isSelected={isSelected}
      >
        <Typography>{title}</Typography>
      </MenuItem>
    )
  );
};

const AdminSidebar = ({ handleItemClick, selectedItem }) => {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

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
    // <Box
    //   className="sideBar"
    //   sx={{
    //     "& .ps-menu-button:hover": {
    //       color: theme.palette.text.secondary + "!important",
    //       background: theme.palette.background.default + "!important",
    //     },
    //     //   "& .ps-menu-button": {
    //     //     color: theme.palette.text.main + "!important",
    //     //     background: theme.palette.background.paper + "!important",
    //     //   },
    //   }}
    // >
    <Paper elevation={10} sx={{ "&&": { border: 0 } }}>
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
            // color: sideBarThemes[sideBarMode].sidebar.color,
            border: "none",
            overflow: "hidden",
            height: "100%",
          }}
          menuItemStyles={{
            root: { border: "none" },
            button: ({ level, active, disabled }) => {
              // only apply styles on first level elements of the tree
              if (level === 0) {
                return {
                  color: disabled ? "black" : theme.palette.text.main,
                  backgroundColor: active
                    ? theme.palette.background.paper
                    : theme.palette.background.default,
                  "&:hover": {
                    // Add your hover styles here
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
    </Paper>
  );
};

export default AdminSidebar;
