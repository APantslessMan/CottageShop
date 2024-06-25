import React, { useState } from "react";
import {
  Box,
  List,
  ListItemIcon,
  ListItemButton,
  Typography,
  useTheme,
  Menu,
  Button,
  MenuItem,
} from "@mui/material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";

export const DropCategories = ({
  categories,
  selectedIndex,
  setSelectedIndex,
}) => {
  const categoryNames = Object.keys(categories);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (index) => {
    setAnchorEl(null);
    if (index !== undefined) {
      setSelectedIndex(index);
    }
  };

  return (
    <div>
      <Button
        id="basic-button"
        sx={{ border: "1px, solid", marginBottom: "8px" }}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Categories
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {categoryNames.map((category, index) => (
          <MenuItem key={index} onClick={() => handleClose(index)}>
            {category}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export const Categories = ({ categories, selectedIndex, setSelectedIndex }) => {
  const theme = useTheme();
  const categoryNames = Object.keys(categories);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <List component="nav" aria-label="Categories">
        <Typography variant="h2" sx={{ marginLeft: 2 }}>
          Products
        </Typography>
      </List>
      {categoryNames.map((category, index) => (
        <ListItemButton
          selected={selectedIndex === index}
          onClick={(event) => handleListItemClick(event, index)}
          sx={{
            "&.Mui-selected": {
              backgroundColor: theme.palette.background.default, // Custom selected color
              "&:hover": {
                backgroundColor: theme.palette.background.default, // Hover effect on selected
              },
            },
            "&:hover": {
              backgroundColor: theme.palette.background.default, // Hover effect on non-selected
            },
          }}
        >
          <ListItemIcon>
            <ChevronRightOutlinedIcon />
          </ListItemIcon>
          <Typography variant="h3" ml={-3}>
            {category}
          </Typography>
        </ListItemButton>
      ))}
    </Box>
  );
};
