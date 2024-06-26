import React, { useState } from "react";
import {
  TableCell,
  IconButton,
  Tooltip,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PasswordIcon from "@mui/icons-material/Password";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const UserEditCell = ({
  userid,
  userrole,
  onDelete,
  onUpdate,
  onResetPassword,
  onUpgradeRole,
  onDowngradeRole,
}) => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleClickOpen = (userId) => {
    setSelectedUser(userId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    if (selectedUser !== null) {
      onDelete(selectedUser);
      handleClose();
    }
  };

  return (
    <section>
      <Tooltip title="Delete User">
        <IconButton onClick={() => handleClickOpen(userid)} aria-label="delete">
          <DeleteIcon style={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Update User">
        <IconButton onClick={onUpdate} aria-label="edit">
          <EditIcon style={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Reset Password">
        <IconButton onClick={onResetPassword} aria-label="reset password">
          <PasswordIcon style={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Tooltip>
      {userrole === "admin" ? (
        <IconButton aria-label="upgrade role" disabled>
          <ArrowUpwardIcon style={{ color: theme.palette.text.disabled }} />
        </IconButton>
      ) : (
        <Tooltip title="Upgrade User Role">
          <IconButton aria-label="upgrade role" onClick={onUpgradeRole}>
            <ArrowUpwardIcon style={{ color: theme.palette.text.primary }} />
          </IconButton>
        </Tooltip>
      )}
      {userrole !== "admin" ? (
        <IconButton aria-label="downgrade role" disabled>
          <ArrowDownwardIcon style={{ color: theme.palette.text.disabled }} />
        </IconButton>
      ) : (
        <Tooltip title="Downgrade User Role">
          <IconButton aria-label="downgrade role" onClick={onDowngradeRole}>
            <ArrowDownwardIcon style={{ color: theme.palette.text.primary }} />
          </IconButton>
        </Tooltip>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default UserEditCell;
