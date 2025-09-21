import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ActivityLogsTable() {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // CSV export
  const exportCSV = () => {
    const header = [
      "Log Number",
      "Timestamp",
      "Employee ID",
      "Employee Name",
      "Entity Type",
      "Display ID",
      "Action",
      "Old Value",
      "New Value",
      "IP Address",
    ];
    const csvRows = rows.map((r) => [
      r.logNumber,
      new Date(r.timestamp).toLocaleString(),
      r.employeeId,
      r.employeeName,
      r.entityType,
      r.displayId,
      r.action,
      String(JSON.stringify(r.oldValue ?? "")),
      String(JSON.stringify(r.newValue ?? "")),
      r.ipAddress,
    ]);
    const csvContent = [header, ...csvRows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "activity_logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/activitylogs/list-all`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) setRows(data.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRowClick = ({ row }) => {
    setCurrentLog(row);
    setDetailDialogOpen(true);
  };

  const columns = [
    { field: "logNumber", headerName: "Log Number", flex: 1 },
    {
      field: "timestamp",
      headerName: "Timestamp",
      flex: 1,
      renderCell: ({ value }) =>
        value ? new Date(value).toLocaleString() : "-",
    },
    { field: "employeeNumber", headerName: "Employee Number", flex: 1 },
    { field: "employeeName", headerName: "Employee Name", flex: 1 },
    { field: "entityType", headerName: "Entity Type", flex: 1 },
    { field: "displayId", headerName: "Display ID", flex: 1 },
    { field: "action", headerName: "Action", flex: 1 },
  ];

  const filtered = rows.filter((r) =>
    Object.values(r).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Activity Logs
      </Typography>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={1}
        flexWrap="wrap"
      >
        {/* left: search + reload */}
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
          <IconButton onClick={fetchLogs} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* right: export only */}
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportCSV}
            disabled={loading}
          >
            Export CSV
          </Button>
        </Box>
      </Stack>

      <Paper>
        {loading ? (
          <Box p={4} textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            autoHeight
            rows={filtered}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newSize) => setPageSize(newSize)}
            pageSizeOptions={[10, 25, 50, 100]}
            pagination
            onRowClick={handleRowClick}
            sx={{ cursor: "pointer" }}
          />
        )}
      </Paper>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Log Details</DialogTitle>
        <DialogContent dividers sx={{ pt: 2, px: 2, pb: 2 }}>
          <Stack spacing={2}>
            {currentLog &&
              [
                ["Log Number", currentLog.logNumber],
                ["Timestamp", new Date(currentLog.timestamp).toLocaleString()],
                ["Employee Number", currentLog.employeeNumber],
                ["Employee Name", currentLog.employeeName],
                ["Entity Type", currentLog.entityType],
                ["Display ID", currentLog.displayId],
                ["Action", currentLog.action],
                [
                  "Old Value",
                  currentLog.oldValue
                    ? JSON.stringify(currentLog.oldValue)
                    : "",
                ],
                [
                  "New Value",
                  currentLog.newValue
                    ? JSON.stringify(currentLog.newValue)
                    : "",
                ],
                ["IP Address", currentLog.ipAddress],
              ].map(([label, value]) => (
                <Paper key={label} elevation={1} sx={{ p: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {label}
                  </Typography>
                  <Typography variant="body1">{value}</Typography>
                </Paper>
              ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
