// src/components/RowDialogAssignments.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  Paper,
} from "@mui/material";

const statusColor = (status) => {
  switch (status.toLowerCase()) {
    case "submitted":
      return "info";
    case "accepted":
      return "primary";
    case "in-progress":
      return "warning";
    case "completed":
      return "success";
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

const RowDialogAssignments = ({ open, onClose, selectedRow, employees }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Assignment Details — Report ID: {selectedRow?.reportNumber}
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2, px: 2, pb: 2 }}>
        <Stack spacing={2}>
          {selectedRow &&
            [
              [
                "Status",
                <Chip
                  key="status"
                  label={selectedRow.status}
                  size="small"
                  color={statusColor(selectedRow.status)}
                  sx={{ textTransform: "capitalize" }}
                />,
              ],
              [
                "Assigned To",
                selectedRow.assignedTo
                  ? employees.find((u) => u.id === selectedRow.assignedTo)
                      ?.fullName
                  : "Unassigned",
              ],
              ["Job Order No.", selectedRow.assignmentNumber || "-"],
              [
                "Assigned At",
                selectedRow.timestamp
                  ? new Date(selectedRow.timestamp).toLocaleString()
                  : "-",
              ],
              [
                "Site Inspection Report",
                selectedRow.siteInspectionReport ? (
                  <a
                    key="report"
                    href={`${import.meta.env.VITE_BACKEND_URL}/api/assignments/download-report/${selectedRow.siteInspectionReport}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", marginTop: 4 }}
                  >
                    {selectedRow.originalFileName ||
                      selectedRow.siteInspectionReport}
                  </a>
                ) : (
                  "None"
                ),
              ],
              [
                "Completion Date",
                selectedRow.accomplishmentDate
                  ? new Date(selectedRow.accomplishmentDate).toLocaleString()
                  : "-",
              ],
              ["Remarks", selectedRow.remarks || "—"],
            ].map(([label, value]) => (
              <Paper key={label} elevation={1} sx={{ p: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  {label}
                </Typography>
                <Box mt={0.5}>{value}</Box>
              </Paper>
            ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RowDialogAssignments;
