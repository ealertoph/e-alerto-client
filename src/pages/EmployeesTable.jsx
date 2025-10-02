import React, { useState, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Stack,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { AppContent } from "../context/AppContext";
import ExportCsvEmployees from "../components/ExportCsvEmployees";
import EmployeeDialog from "../components/EmployeeDialog";
import EmployeeColumns from "../components/ColumnsEmployees";

export default function EmployeesTable() {
  const theme = useTheme();

  // Access logged-in user data from context
  const { userData } = useContext(AppContent);

  // table & dialog state
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  // replace your separate `pageSize` state with this
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detailRow, setDetailRow] = React.useState(null);

  //Create / Edit User
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // -- For Archiving -- //
  const [showArchived, setShowArchived] = React.useState(false);

  // helper to disable both Super-Admins (always) and Admins (when you’re Admin)
  const isRowDisabled = (row) =>
    row.position === "Super Admin" ||
    (userData.position === "Admin" && row.position === "Admin");

  // fetch employees
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/list-all?archived=${showArchived}`,
        { credentials: "include" }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setRows(json.users.map((u) => ({ id: u.id, ...u })));
    } catch (e) {
      console.error(e);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [showArchived]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to open the main edit form dialog after confirmation
  const openEdit = (row) => {
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleRowClick = ({ row }) => {
    // This will only open if the click was not on an action button
    // Prevent opening detail for Super Admin
    if (isRowDisabled(row)) {
      // You could show a toast here if desired, but often it's just visually disabled
      // toast.info("Details for Super Admin account are not viewable directly.");
      return;
    }
    setDetailRow(row);
    setDetailOpen(true);
  };

  // ─── Status dropdown logic ───────────────────────────
  const statusOptions = ["Active", "Inactive"];

  const handleStatusChange = async (id, newStatus) => {
    try {
      // fire update to your backend
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, userId: userData.id }),
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      // update local row state
      setRows((rs) =>
        rs.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      toast.success("Status updated");
    } catch (e) {
      toast.error("Failed to update status: " + e.message);
    }
  };

  // --- table columns ---
  const columns = EmployeeColumns({
    showArchived,
    statusOptions,
    handleStatusChange,
    isRowDisabled,
    openEdit,
    //handleDelete, // still optional if not in use
    fetchData,
  });

  // filter & render
  const filtered = rows.filter((r) =>
    Object.values(r).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Employees
      </Typography>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={1}
        flexWrap="wrap"
      >
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={fetchData} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant={showArchived ? "contained" : "outlined"}
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </Button>
          <ExportCsvEmployees rows={rows} disabled={loading} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingRow(null);
              setDialogOpen(true);
            }}
            disabled={loading}
          >
            New Employee
          </Button>
        </Box>
      </Stack>

      <Paper>
        {loading ? (
          <Box p={4} textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Box sx={{ minWidth: 1000 }}>
              <DataGrid
                autoHeight
                rows={filtered}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10, 25, 50, 100]}
                pagination
                onCellClick={(params) => {
                  if (params.field === "status" || params.field === "actions")
                    return;
                  if (isRowDisabled(params.row)) return;
                  handleRowClick(params);
                }}
                sx={{
                  "& .MuiDataGrid-row:nth-of-type(odd)": {
                    backgroundColor: theme.palette.action.hover,
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: theme.palette.action.selected,
                  },
                  // Visually disable the super admin row (optional, but good UX)
                  "& .super-admin-row": {
                    opacity: 0.6,
                    pointerEvents: "none",
                    backgroundColor: theme.palette.action.disabledBackground,
                  },
                }}
                // Add a getRowClassName prop to apply a class to the super admin row
                getRowClassName={(params) =>
                  isRowDisabled(params.row) ? "super-admin-row" : ""
                }
              />
            </Box>
          </Box>
        )}
      </Paper>

      {/* Create/Edit Dialog (Main Form) */}
      <EmployeeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSaved={fetchData}
        initialData={editingRow}
        loading={loading}
      />

      {/* Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Employee Details</DialogTitle>
        <DialogContent dividers sx={{ pt: 2, px: 2, pb: 2 }}>
          <Stack spacing={2}>
            {detailRow &&
              [
                ["Employee No.", detailRow.employeeNumber],
                ["Status", detailRow.status],
                ["Surname", detailRow.surname],
                ["First Name", detailRow.firstName],
                ["Middle Name", detailRow.middleName],
                ["Suffix", detailRow.suffix],
                ["District", detailRow.district],
                ["Position", detailRow.position],
                ["Email", detailRow.email],
                ["Phone", detailRow.phone],
              ].map(([lbl, val]) => (
                <Paper key={lbl} elevation={1} sx={{ p: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {lbl}
                  </Typography>
                  <Box mt={0.5}>{val}</Box>
                </Paper>
              ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

EmployeesTable.propTypes = {
  window: PropTypes.func,
};
