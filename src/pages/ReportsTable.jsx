// src/pages/ReportsTable.jsx
import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Stack,
  IconButton,
  Button,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import DupaBreakdown from "../components/DupaBreakdown";
import { AppContent } from "../context/AppContext"; // Import the context to get user data
import { Circle } from "@mui/icons-material";
import ReportColumns, { statusColor } from "../components/ColumnsReports";
import ExportCsvReports from "../components/ExportCsvReports";
import RowDialogReports from "../components/RowDialogReports";

// This is for the report cards of the engineers' dashboard view
const statusColors = {
  Submitted: "#0288d1",
  Accepted: "#1976d2",
  "In-progress": "#fbc02d",
  Completed: "#388e3c",
  Rejected: "#d32f2f",
};

export default function ReportsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [tab, setTab] = useState("active"); // "active" or "archive"

  const { userData } = useContext(AppContent); // Access user data from the context

  // Check if the user is a District Engineer
  const isEngineer = userData?.position
    ?.toLowerCase()
    .includes("district engineer");

  // Declare the missing state variables
  const [taskOpen, setTaskOpen] = useState(false); // Added useState for taskOpen
  const [detailOpen, setDetailOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [imgOpen, setImgOpen] = useState(false);

  // Fetch reports from API
  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/reports/list-all`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setRows(
          data.reports.map((r) => ({
            id: r.reportNumber,
            reportNumber: r.reportNumber,
            image: r.image,
            classification: r.classification,
            measurement: r.measurement,
            location: r.location,
            district: r.district,
            status: r.status,
            description: r.description,
            timestamp: r.timestamp,
            daysSinceReport: r.daysSinceReport,
            duplicateCounter: r.duplicateCounter,
          }))
        );

        // Count the number of reports for each status
        const statusCounts = data.reports.reduce((acc, r) => {
          acc[r.status] = (acc[r.status] || 0) + 1;
          return acc;
        }, {});
        setCounts(statusCounts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const columns = ReportColumns({ setTaskOpen, setCurrent });

  const filtered = rows
    .filter((r) => {
      if (tab === "active") {
        return ["Submitted", "Accepted", "In-progress"].includes(r.status);
      } else {
        return ["Completed", "Rejected"].includes(r.status);
      }
    })
    .filter((r) =>
      Object.values(r).some((v) =>
        String(v).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  const handleRowClick = ({ row }) => {
    setCurrent(row);
    setDetailOpen(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Reports
      </Typography>

      {/* Render status cards only for District Engineers */}
      {isEngineer && (
        <Box mb={4} sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {[
            "Submitted",
            "Accepted",
            "In-progress",
            "Completed",
            "Rejected",
          ].map((status) => (
            <Card
              key={status}
              sx={{
                flex: "1 1 calc(20% - 16px)",
                minWidth: 150,
                borderLeft: `5px solid ${statusColors[status]}`,
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {status}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    counts[status] || 0
                  )}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={1}
        flexWrap="wrap" // Add this line
      >
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={fetchReports} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant={tab === "archive" ? "contained" : "outlined"}
            onClick={() => setTab(tab === "archive" ? "active" : "archive")}
          >
            {tab === "archive" ? "Show Active" : "Show Completed"}
          </Button>
          <ExportCsvReports rows={rows} />
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
                rows={filtered}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newSize) => setPageSize(newSize)}
                pageSizeOptions={[10, 25, 50, 100]}
                pagination
                autoHeight
                onRowClick={handleRowClick}
              />
            </Box>
          </Box>
        )}
      </Paper>

      {/* Reports Overview Dialog */}
      <RowDialogReports
        current={current}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        imgOpen={imgOpen}
        setImgOpen={setImgOpen}
      />

      {/* Task Overview Dialog */}
      <Dialog
        open={taskOpen}
        onClose={() => setTaskOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Task Overview — Report ID: {current?.reportNumber}
        </DialogTitle>
        <DialogContent>
          {current ? (
            <DupaBreakdown
              reportId={current.id}
              measurement={current.measurement}
              classification={current.classification}
              userData={userData} // ✨ Add this line
              onMeasurementUpdated={(updatedMeasurement) => {
                fetchReports();
                setCurrent((r) => ({ ...r, measurement: updatedMeasurement }));
              }}
            />
          ) : (
            <Typography>No report selected.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => setTaskOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
