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

const ProductEditCell = ({ productId, onDelete, onUpdate }) => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleClickOpen = (userId) => {
    setSelectedProduct(productId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct !== null) {
      onDelete(selectedProduct);
      handleClose();
    }
  };

  return (
    <section>
      <Tooltip title="Delete Product">
        <IconButton
          onClick={() => handleClickOpen(productId)}
          aria-label="delete"
        >
          <DeleteIcon style={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Update Product">
        <IconButton onClick={onUpdate} aria-label="edit">
          <EditIcon style={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product?
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

export default ProductEditCell;
