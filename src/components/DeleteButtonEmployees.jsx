// src/components/DeleteButton.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

export default function DeleteButton({ row, onDelete }) {
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation(); // prevent DataGrid’s onCellClick
    if (row.position === "Super Admin") {
      toast.info("Super Admin account cannot be deleted.");
      return;
    }
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpen(false);
    try {
      await onDelete(row.id);
      toast.success(`Deleted ${row.firstName} ${row.surname}`);
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  return (
    <>
      <IconButton
        size="small"
        color="error"
        onClick={handleClick}
        disabled={row.position === "Super Admin"}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>
            {row.firstName} {row.surname}
          </strong>
          ? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

DeleteButton.propTypes = {
  row: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};
