// src/components/DialogAssignment.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import TextField from "@mui/material/TextField";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const DialogAssignment = ({
  confirmDialogOpen,
  handleCancelAssign,
  handleConfirmAssign,
  dialogRow,
  dialogEmpId,
  employees,
  completeDialogOpen,
  cancelComplete,
  confirmComplete,
  rejectDialogOpen,
  cancelReject,
  confirmReject,
  uploadDialogOpen,
  setUploadDialogOpen,
  handleUpload,
  reportFile,
  setReportFile,
  remarks,
  setRemarks,
  errorDialogOpen,
  errorDialogMsg,
  setErrorDialogOpen,
  statusConfirmDialogOpen,
  cancelStatusChange,
  confirmStatusChange,
  dialogDesiredStatus,
}) => {
  return (
    <>
      {/* Confirm Assignment */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelAssign}>
        <DialogTitle>
          <Stack
            direction="column" // Changed to column
            alignItems="center"
            justifyContent="center"
          >
            <AssignmentIcon color="primary" sx={{ fontSize: "2.5rem" }} />
            <Typography variant="h6" fontWeight={600} align="center">
              Confirm Assignment
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Typography align="center">
            Assign report <strong>{dialogRow?.reportNumber}</strong> to{" "}
            <strong>
              {employees.find((u) => u.id === dialogEmpId)?.fullName || ""}
            </strong>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAssign}>Cancel</Button>
          <Button onClick={handleConfirmAssign} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Status Change */}
      <Dialog open={statusConfirmDialogOpen} onClose={cancelStatusChange}>
        <DialogTitle>
          <Stack
            direction="column" // Changed to column
            alignItems="center"
            justifyContent="center"
          >
            <WarningAmberIcon color="warning" sx={{ fontSize: "2.5rem" }} />
            <Typography variant="h6" fontWeight={600} align="center">
              Confirm Status Change
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            You are about to change the status of report{" "}
            <strong>{dialogRow?.reportNumber}</strong> to{" "}
            <strong>{dialogDesiredStatus}</strong>.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Once you change the assignment status, this will reflect and
            <Box component="span" fontWeight="bold">
              {" cannot be reverted back "}
            </Box>
            to its previous progress stage. Do you want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelStatusChange}>Cancel</Button>
          <Button onClick={confirmStatusChange} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Completion */}
      <Dialog open={completeDialogOpen} onClose={cancelComplete}>
        <DialogTitle>
          <Stack
            direction="column" // Changed to column
            alignItems="center"
            justifyContent="center"
          >
            <CheckCircleOutlineIcon
              color="success"
              sx={{ fontSize: "2.5rem" }}
            />
            <Typography variant="h6" fontWeight={600} align="center">
              Mark as Completed
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to mark report{" "}
            <strong>{dialogRow?.reportNumber}</strong> as completed?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelComplete}>Cancel</Button>
          <Button onClick={confirmComplete} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Rejection */}
      <Dialog open={rejectDialogOpen} onClose={cancelReject}>
        <DialogTitle>
          <Stack
            direction="column" // Changed to column
            alignItems="center"
            justifyContent="center"
          >
            <HighlightOffIcon color="error" sx={{ fontSize: "2.5rem" }} />
            <Typography variant="h6" fontWeight={600} align="center">
              Mark as Rejected
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to mark report{" "}
            <strong>{dialogRow?.reportNumber}</strong> as rejected?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelReject}>Cancel</Button>
          <Button onClick={confirmReject} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Site Inspection Report */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          <Stack
            direction="column" // Changed to column
            alignItems="center"
            justifyContent="center"
          >
            <FileUploadIcon color="primary" sx={{ fontSize: "2.5rem" }} />
            <Typography variant="h6" fontWeight={600} align="center">
              Upload Site Inspection Report
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2, px: 2, pb: 1 }}>
          <Box
            sx={{
              border: "2px dashed",
              borderColor: reportFile ? "primary.main" : "text.secondary",
              borderRadius: 1,
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { backgroundColor: "action.hover" },
            }}
            onClick={() => document.getElementById("file-input").click()}
          >
            {reportFile ? (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <AttachFileIcon color="primary" />
                <Typography>{reportFile.name}</Typography>
              </Stack>
            ) : (
              <Stack direction="column" alignItems="center" spacing={1}>
                <UploadFileIcon fontSize="large" color="disabled" />
                <Typography variant="body2" color="textSecondary">
                  Click to select PDF
                </Typography>
              </Stack>
            )}
            <input
              id="file-input"
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={(e) => setReportFile(e.target.files[0])}
            />
          </Box>
          <TextField
            label="Remarks"
            fullWidth
            multiline
            minRows={2}
            variant="outlined"
            margin="normal"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!reportFile}
            startIcon={<UploadFileIcon />}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <DialogTitle>
          <Stack
            direction="column" // Changed to column
            alignItems="center"
            justifyContent="center"
          >
            <ErrorOutlineIcon color="error" sx={{ fontSize: "2.5rem" }} />
            <Typography variant="h6" fontWeight={600} align="center">
              Error
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>{errorDialogMsg}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogAssignment;
