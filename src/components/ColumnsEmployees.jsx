// src/components/EmployeeColumns.jsx
import React from "react";
import {
  TextField,
  MenuItem,
  Stack,
  Typography,
  IconButton,
  Select,
  Box,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import ArchiveButton from "../components/ArchiveButtonEmployees";
import EditButton from "../components/EditButtonEmployees";

const EmployeeColumns = ({
  showArchived,
  statusOptions,
  handleStatusChange,
  isRowDisabled,
  openEdit,
  handleDelete,
  fetchData,
}) => [
  { field: "employeeNumber", headerName: "Employee No.", flex: 1 },

  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: ({ row }) => {
      if (showArchived) {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              pl: 1,
              height: "100%",
            }}
          >
            <CircleIcon
              sx={{
                fontSize: 12,
                color: row.status === "Active" ? "green" : "red",
              }}
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {row.status}
            </Typography>
          </Box>
        );
      }

      const disabled = isRowDisabled(row);
      return (
        <TextField
          select
          size="small"
          variant="outlined" // 🔑 switch from "standard"
          value={row.status}
          disabled={disabled}
          onChange={
            disabled
              ? undefined
              : (e) => handleStatusChange(row.id, e.target.value)
          }
          sx={{
            height: "100%", // 🔑 match DataGrid cell height
            display: "flex",
            alignItems: "center",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center", // 🔑 vertical centering
              py: 0,
            },
            "& .MuiInputBase-root": {
              height: "100%",
              display: "flex",
              alignItems: "center",
            },
          }}
          SelectProps={{
            renderValue: (v) => (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircleIcon
                  sx={{
                    fontSize: 12,
                    color: v === "Active" ? "green" : "red",
                  }}
                />
                <Typography variant="body2">{v}</Typography>
              </Stack>
            ),
          }}
        >
          {statusOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
      );
    },
  },

  { field: "surname", headerName: "Surname", flex: 1 },
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "middleName", headerName: "Middle Name", flex: 1 },
  { field: "suffix", headerName: "Suffix", flex: 1 },
  { field: "district", headerName: "District", flex: 1 },
  { field: "position", headerName: "Position", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phone", headerName: "Phone", flex: 1 },

  {
    field: "actions",
    headerName: "Actions",
    width: 120,
    align: "center",
    headerAlign: "center",
    sortable: false,
    renderCell: ({ row }) => {
      const disabled = isRowDisabled(row);
      return (
        <Stack direction="row" spacing={1}>
          <EditButton
            row={row}
            onEdit={() => openEdit(row)}
            disabled={disabled}
          />
          {/* <DeleteButton row={row} onDelete={handleDelete} /> */}
          <ArchiveButton
            row={row}
            showArchived={showArchived}
            onSuccess={fetchData}
          />
        </Stack>
      );
    },
  },
];

export default EmployeeColumns; // ✅
