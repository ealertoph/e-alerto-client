import React from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { Circle } from "@mui/icons-material";
import { statusColor } from "./ColumnsReports";

const RowDialogReports = ({ current, open, onClose, imgOpen, setImgOpen }) => {
  if (!current) return null;

  return (
    <>
      {/* Report Details Dialog */}
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Report Details — ID: {current.id}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 1, pb: 2 }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={4}
          >
            <Box flex="1" textAlign="center">
              <Box
                component="img"
                src={`${import.meta.env.VITE_BACKEND_URL}/api/reports/image/${current.image}`}
                alt=""
                sx={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "cover",
                  borderRadius: 2,
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
                onClick={() => setImgOpen(true)}
              />
            </Box>

            <Box flex="2" display="flex" flexDirection="column" gap={2}>
              {[
                ["Classification", current.classification],
                ["Measurement", current.measurement],
                ["Location", current.location],
                ["District", current.district],
                ["Status", current.status],
                ["Description", current.description],
                ["Date & Time", new Date(current.timestamp).toLocaleString()],
              ].map(([label, val]) => (
                <Box key={label}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {label}
                  </Typography>
                  {label === "Status" ? (
                    <Chip
                      label={val}
                      size="small"
                      color={statusColor(val)}
                      sx={{ textTransform: "capitalize", mt: 0.5 }}
                    />
                  ) : (
                    <Typography variant="body1">{val}</Typography>
                  )}
                </Box>
              ))}

              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle2" color="textSecondary">
                  Elapsed Days
                </Typography>
                <Circle
                  sx={{
                    fontSize: 16,
                    color:
                      current.daysSinceReport <= 3
                        ? "green"
                        : current.daysSinceReport <= 7
                          ? "yellow"
                          : current.daysSinceReport <= 10
                            ? "red"
                            : "gray",
                  }}
                />
                <Typography variant="body1">
                  {current.daysSinceReport} Days
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Box component="button" onClick={onClose}>
            Close
          </Box>
        </DialogActions>
      </Dialog>

      {/* Image Zoom Dialog */}
      <Dialog
        open={imgOpen}
        onClose={() => setImgOpen(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: 2, p: 0 } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box
            component="img"
            src={`${import.meta.env.VITE_BACKEND_URL}/api/reports/image/${current.image}`}
            alt="Zoomed report"
            sx={{ width: "100%", height: "auto", display: "block" }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RowDialogReports;
