// src/components/AssignmentColumns.js
import React from "react";
import { TextField, MenuItem, Chip, Stack } from "@mui/material";

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

export const AssignmentColumns = ({
  employees,
  userData,
  handleStatusChange,
  handleAssignClick,
  tab, // still kept in case it's used by parent
}) => [
  {
    field: "reportNumber",
    headerName: "Report ID",
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: ({ row }) => (
      <TextField
        disabled={row.archive}
        select
        size="small"
        variant="outlined"
        value={row.status}
        onChange={(e) => handleStatusChange(row.id, e.target.value)}
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            py: 0,
          },
          "& .MuiInputBase-root": {
            height: "100%",
            display: "flex",
            alignItems: "center",
          },
        }}
        SelectProps={{
          displayEmpty: true,
          renderValue: (v) => (
            <Stack direction="row" alignItems="center">
              <Chip label={v} size="small" color={statusColor(v)} />
            </Stack>
          ),
        }}
      >
        {["Submitted", "Accepted", "In-progress", "Completed", "Rejected"].map(
          (opt) => {
            const current = row.status?.toLowerCase();
            const disabled =
              (current === "accepted" && opt === "Submitted") ||
              (current === "in-progress" &&
                ["Submitted", "Accepted"].includes(opt)) ||
              (["completed", "rejected"].includes(current) &&
                opt !== row.status);

            return (
              <MenuItem key={opt} value={opt} disabled={disabled}>
                {opt}
              </MenuItem>
            );
          }
        )}
      </TextField>
    ),
  },
  {
    field: "assignedTo",
    headerName: "Assigned To",
    flex: 1,
    renderCell: ({ row }) => (
      <TextField
        disabled={
          row.archive ||
          userData?.position?.toLowerCase().includes("district engineer")
        }
        select
        size="small"
        variant="outlined"
        value={row.assignedTo}
        onChange={(e) => handleAssignClick(row.id, e.target.value)}
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            py: 0,
          },
          "& .MuiInputBase-root": {
            height: "100%",
            display: "flex",
            alignItems: "center",
          },
        }}
        SelectProps={{
          displayEmpty: true,
          renderValue: (v) =>
            v ? (
              <Stack direction="row" alignItems="center">
                <Chip
                  label={employees.find((u) => u.id === v)?.fullName || ""}
                  size="small"
                />
              </Stack>
            ) : (
              <em>Unassigned</em>
            ),
        }}
      >
        {[
          { value: "", label: <em>Unassigned</em> },
          ...employees.map((u) => ({
            value: u.id,
            label: u.fullName,
          })),
        ].map((opt) => {
          const disabled = row.assignedTo && opt.value === ""; // disable Unassigned if already assigned

          return (
            <MenuItem key={opt.value} value={opt.value} disabled={disabled}>
              {opt.label}
            </MenuItem>
          );
        })}
      </TextField>
    ),
  },
  {
    field: "assignmentNumber",
    headerName: "Job Order No.",
    flex: 1,
  },
  {
    field: "timestamp",
    headerName: "Assigned At",
    flex: 1,
    renderCell: ({ value }) => (value ? new Date(value).toLocaleString() : "-"),
  },
  {
    field: "siteInspectionReport",
    headerName: "Site Inspection Report",
    flex: 1,
    renderCell: ({ value, row }) =>
      value ? (
        <a
          href={`${import.meta.env.VITE_BACKEND_URL}/api/assignments/download-report/${value}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {row.originalFileName || value}
        </a>
      ) : (
        "-"
      ),
  },
  {
    field: "accomplishmentDate",
    headerName: "Completion Date",
    flex: 1,
    renderCell: ({ value }) => (value ? new Date(value).toLocaleString() : "-"),
  },
  {
    field: "remarks",
    headerName: "Remarks",
    flex: 1,
    renderCell: ({ value }) => value || "—",
  },
];
