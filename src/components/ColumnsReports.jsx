import React from "react";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Circle } from "@mui/icons-material";

// Color logic for status Chip
export const statusColor = (status) => {
  switch (status.toLowerCase()) {
    case "resolved":
    case "completed":
      return "success";
    case "submitted":
      return "info";
    case "in-progress":
    case "in progress":
      return "warning";
    case "rejected":
      return "error";
    case "accepted":
      return "primary";
    default:
      return "default";
  }
};

// Exported function to generate column definitions
const ReportColumns = ({ setTaskOpen, setCurrent }) => [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "image",
    headerName: "Img",
    width: 80,
    renderCell: ({ value }) => (
      <img
        src={`${import.meta.env.VITE_BACKEND_URL}/api/reports/image/${value}`}
        alt=""
        style={{
          width: 40,
          height: 40,
          objectFit: "cover",
          borderRadius: 4,
          cursor: "pointer",
        }}
      />
    ),
  },
  { field: "classification", headerName: "Class.", flex: 1 },
  { field: "measurement", headerName: "Measure", flex: 1 },
  { field: "location", headerName: "Location", flex: 2 },
  { field: "district", headerName: "District", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: ({ row }) => (
      <Chip
        label={row.status}
        size="small"
        color={statusColor(row.status)}
        sx={{ textTransform: "capitalize" }}
      />
    ),
  },
  { field: "description", headerName: "Desc.", flex: 2 },
  {
    field: "timestamp",
    headerName: "Date/Time",
    flex: 1,
    renderCell: ({ value }) => new Date(value).toLocaleString(),
  },
  {
    field: "daysSinceReport",
    headerName: "Time Since Submission",
    flex: 1,
    renderCell: ({ value }) => {
      let dotColor = "gray";
      if (value >= 0 && value <= 3) dotColor = "green";
      else if (value >= 4 && value <= 7) dotColor = "yellow";
      else if (value >= 8 && value <= 10) dotColor = "red";

      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
          sx={{ height: "100%" }}
        >
          <Circle sx={{ fontSize: 16, color: dotColor }} />
          <Typography variant="body2">{value} Days</Typography>
        </Box>
      );
    },
  },
  {
    field: "duplicateCounter",
    headerName: "Priority",
    flex: 1,
    align: "center",
    renderCell: ({ value }) => value,
  },
  {
    field: "taskOverview",
    headerName: "Task Overview",
    flex: 1,
    renderCell: (params) => (
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          setCurrent(params.row);
          setTaskOpen(true);
        }}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
    ),
  },
];

export default ReportColumns;