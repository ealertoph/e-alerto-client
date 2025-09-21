// src/components/ArchiveButtonEmployees.jsx
import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";

export default function ArchiveButton({
  row,
  showArchived,
  onSuccess,
}) {
  const [open, setOpen] = useState(false);
  const { backendUrl } = useContext(AppContent);

  const handleClick = () => {
    if (!showArchived && row.status !== "Inactive") {
      toast.error("Only inactive employees can be archived");
      return;
    }
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpen(false);
    try {
      const action = showArchived ? "unarchive" : "archive";
      const res = await fetch(`${backendUrl}/api/user/${action}/${row.id}`, {
        method: "PUT",
        credentials: "include",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      toast.success(showArchived ? "Employee restored" : "Employee archived");
      onSuccess();
    } catch (e) {
      toast.error(
        `${showArchived ? "Restore" : "Archive"} failed: ${e.message}`
      );
    }
  };

  return (
    <>
      <IconButton
        size="small"
        color={showArchived ? "success" : "warning"}
        onClick={handleClick}
        aria-label={showArchived ? "restore employee" : "archive employee"}
      >
        {showArchived ? (
          <UnarchiveIcon fontSize="small" />
        ) : (
          <ArchiveIcon fontSize="small" />
        )}
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {showArchived ? "Confirm Restore" : "Confirm Archive"}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to {showArchived ? "restore" : "archive"}{" "}
          employee{" "}
          <strong>
            {row.firstName} {row.surname}
          </strong>
          ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained">
            {showArchived ? "Restore" : "Archive"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

ArchiveButton.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    firstName: PropTypes.string,
    surname: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  showArchived: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
