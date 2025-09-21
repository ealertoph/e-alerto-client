// src/components/EditButton.jsx
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
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";

export default function EditButton({ row, onEdit }) {
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation(); // prevent DataGrid’s onCellClick
    if (row.position === "Super Admin") {
      toast.info("Super Admin account cannot be edited.");
      return;
    }
    setOpen(true);
  };

  const handleConfirm = () => {
    setOpen(false);
    onEdit(row); // parent’s edit callback
  };

  return (
    <>
      <IconButton
        size="small"
        color="primary"
        onClick={handleClick}
        disabled={row.position === "Super Admin"}
      >
        <EditIcon fontSize="small" />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Edit</DialogTitle>
        <DialogContent>
          Are you sure you want to edit{" "}
          <strong>
            {row.firstName} {row.surname}
          </strong>
          ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

EditButton.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
};
