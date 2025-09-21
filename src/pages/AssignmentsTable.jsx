// src/pages/AssignmentsTable.jsx
import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Stack,
  Button,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import ExportCsvAssignments from "../components/ExportCsvAssignments";
import DialogAssignment from "../components/DialogAssignment";
import RowDialogAssignments from "../components/RowDialogAssignments";
import { AssignmentColumns } from "../components/ColumnsAssignment";

export default function AssignmentsTable() {
  const [rows, setRows] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const { userData } = useContext(AppContent);
  const currentUserId = userData?.id || userData?._id;
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [statusConfirmDialogOpen, setStatusConfirmDialogOpen] = useState(false);
  const [dialogRow, setDialogRow] = useState(null);
  const [dialogEmpId, setDialogEmpId] = useState("");
  const [dialogDesiredStatus, setDialogDesiredStatus] = useState("");
  const [reportFile, setReportFile] = useState(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMsg, setErrorDialogMsg] = useState("");
  const [rowDialogOpen, setRowDialogOpen] = useState(false);
  const [tab, setTab] = useState("active");
  const activeRows = rows.filter((r) => !r.archive);
  const archivedRows = rows.filter((r) => r.archive);
  const [selectedRow, setSelectedRow] = useState(null);
  const [remarks, setRemarks] = useState("");

  // fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, uRes, aRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reports/list-all`, {
          credentials: "include",
        }),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/list-all`, {
          credentials: "include",
        }),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assignments/list-all`, {
          credentials: "include",
        }),
      ]);
      const [rData, uData, aData] = await Promise.all([
        rRes.json(),
        uRes.json(),
        aRes.json(),
      ]);

      if (uData.success) {
        const filtered = uData.users.filter(
          (u) =>
            u.position?.toLowerCase().includes("district engineer") &&
            u.role?.toLowerCase() !== "admin"
        );
        setEmployees(filtered);
      }

      if (rData.success && aData.success) {
        // Map assignments by reportNumber instead of report ID
        const assignMap = aData.assignments.reduce((m, a) => {
          m[a.reportNumber] = a; // Use reportNumber as key
          return m;
        }, {});

        setRows(
          rData.reports.map((r) => {
            const a = assignMap[r.reportNumber] || {}; // Match by reportNumber
            return {
              id: r.reportNumber, // Use reportNumber as id for the row
              reportNumber: r.reportNumber,
              status: a.status || r.status,
              assignedTo: a.assignedTo || "",
              assignmentId: a._id || "",
              assignmentNumber: a.assignmentNumber || "",
              timestamp: a.createdAt || "",
              siteInspectionReport: a.siteInspectionReport || "",
              originalFileName: a.originalFileName || "",
              accomplishmentDate: a.accomplishmentDate || "",
              archive: a.archive || false,
              remarks: a.remarks || "",
            };
          })
        );
      }
    } catch (err) {
      console.error(err);
      showError("Load failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // API helpers
  const upsertAssignment = async ({ id, reportNumber, status, assignedTo }) => {
    const url = id
      ? `/api/assignments/update/${id}`
      : `/api/assignments/create`;
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ reportNumber, status, assignedTo }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.assignment;
  };

  const deleteAssignment = async (id) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/assignments/delete/${id}`,
      { method: "DELETE", credentials: "include" }
    );
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
  };

  const unarchiveAssignment = async (assignmentId) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/assignments/unarchive/${assignmentId}`,
      { method: "PUT", credentials: "include" }
    );
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.assignment;
  };

  const uploadReport = async (assignmentId, form) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/assignments/upload-report/${assignmentId}`,
      { method: "POST", credentials: "include", body: form }
    );
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.assignment;
  };

  const showError = (msg) => {
    setErrorDialogMsg(msg);
    setErrorDialogOpen(true);
  };

  // handlers
  const handleStatusChange = (rowId, newStatus) => {
    const row = rows.find((r) => r.id === rowId);
    const statusLower = newStatus.toLowerCase();

    // New logic to handle all status changes with a confirmation dialog
    if (
      !row.assignedTo &&
      ["accepted", "in-progress", "completed", "rejected"].includes(statusLower)
    ) {
      return showError("Please assign someone first.");
    }

    setDialogRow(row);
    setDialogDesiredStatus(newStatus);
    setStatusConfirmDialogOpen(true);
  };

  const cancelStatusChange = () => setStatusConfirmDialogOpen(false);

  const confirmStatusChange = () => {
    setStatusConfirmDialogOpen(false);
    const row = dialogRow;
    const newStatus = dialogDesiredStatus;
    const statusLower = newStatus.toLowerCase();

    if (statusLower === "completed" || statusLower === "rejected") {
      setDialogRow(row);
      setDialogDesiredStatus(newStatus); // <--- CHANGE THIS LINE: Use newStatus instead of statusLower
      setCompleteDialogOpen(statusLower === "completed");
      setRejectDialogOpen(statusLower === "rejected");
      return;
    }
    if (statusLower === "submitted" && row.assignmentId) {
      deleteAssignment(row.assignmentId)
        .then(() => {
          toast.success("Status set to Submitted. Assignment cleared.");
          fetchData(); // ← re-fetch entire table
        })
        .catch((e) => {
          toast.error("Delete failed: " + e.message);
          showError("Delete failed: " + e.message);
        });
      return;
    }
    if (!row.assignedTo) {
      return showError("Please assign someone first.");
    }
    upsertAssignment({
      id: row.assignmentId,
      reportNumber: row.reportNumber,
      status: newStatus,
      assignedTo: row.assignedTo,
    })
      .then((assignment) => {
        toast.success("Status updated successfully!");
        fetchData(); // ← re-fetch entire table
      })
      .catch((e) => {
        toast.error("Save failed: " + e.message);
        showError("Save failed: " + e.message);
      });
  };

  // Dialog actions
  const confirmComplete = () => {
    setCompleteDialogOpen(false);
    setUploadDialogOpen(true);
  };
  const cancelComplete = () => setCompleteDialogOpen(false);
  const confirmReject = () => {
    setRejectDialogOpen(false);
    setUploadDialogOpen(true);
  };
  const cancelReject = () => setRejectDialogOpen(false);

  const handleUpload = () => {
    const form = new FormData();
    form.append("report", reportFile);
    form.append("status", dialogDesiredStatus);
    form.append("userId", currentUserId);
    form.append("remarks", remarks);
    uploadReport(dialogRow.assignmentId, form)
      .then((assignment) => {
        toast.success("Report uploaded successfully.");
        setRows((prev) => {
          const updatedRows = prev.map((r) =>
            r.id === dialogRow.id
              ? {
                  ...r,
                  status:
                    dialogDesiredStatus.charAt(0).toUpperCase() +
                    dialogDesiredStatus.slice(1),
                  assignmentId: assignment._id,
                  assignmentNumber: assignment.assignmentNumber,
                  siteInspectionReport: assignment.siteInspectionReport,
                  originalFileName: assignment.originalFileName,
                  accomplishmentDate: assignment.accomplishmentDate,
                  archive: true, // ✅ archive it
                  remarks: assignment.remarks,
                }
              : r
          );
          return updatedRows;
        });
      })
      .catch((e) => {
        toast.error("Upload failed: " + e.message);
        showError("Upload failed: " + e.message);
      })
      .finally(() => {
        setUploadDialogOpen(false);
        setReportFile(null);
        setRemarks("");
      });
  };

  const handleAssignClick = (rowId, newEmpId) => {
    if (newEmpId === "") {
      const row = rows.find((r) => r.id === rowId);
      if (row.assignmentId) {
        deleteAssignment(row.assignmentId)
          .then(() => {
            toast.success("Assignment removed successfully.");
            setRows((prev) =>
              prev.map((r) =>
                r.id === rowId
                  ? {
                      ...r,
                      status: "Submitted",
                      assignedTo: "",
                      assignmentId: "",
                      assignmentNumber: "",
                      timestamp: "",
                      siteInspectionReport: "",
                      accomplishmentDate: "",
                    }
                  : r
              )
            );
          })
          .catch((e) => {
            toast.error("Unassign failed: " + e.message);
            showError("Unassign failed: " + e.message);
          });
      }
      return;
    }
    setDialogRow(rows.find((r) => r.id === rowId));
    setDialogEmpId(newEmpId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAssign = () => {
    setConfirmDialogOpen(false);
    const { id: rowId, reportNumber, status } = dialogRow;
    upsertAssignment({
      id: dialogRow.assignmentId,
      reportNumber,
      status,
      assignedTo: dialogEmpId,
    })
      .then((assignment) => {
        toast.success(
          "Assigned to " + employees.find((u) => u.id === dialogEmpId)?.fullName
        );
        setRows((prev) =>
          prev.map((r) =>
            r.id === rowId
              ? {
                  ...r,
                  assignedTo: assignment.assignedTo,
                  assignmentId: assignment._id,
                  assignmentNumber: assignment.assignmentNumber,
                  timestamp: assignment.createdAt || new Date().toISOString(),
                }
              : r
          )
        );
      })
      .catch((e) => {
        toast.error("Save failed: " + e.message);
        showError("Save failed: " + e.message);
      });
  };

  const handleCancelAssign = () => setConfirmDialogOpen(false);

  const columns = AssignmentColumns({
    employees,
    userData,
    handleStatusChange,
    handleAssignClick,
    tab,
    unarchiveAssignment,
    toast,
    showError,
    setRows,
  });

  const filteredRows = (tab === "active" ? activeRows : archivedRows).filter(
    (r) =>
      Object.values(r).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Job Order
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
          <IconButton onClick={fetchData} disabled={loading}>
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
          <ExportCsvAssignments
            rows={rows}
            employees={employees}
            searchQuery={searchQuery}
          />
        </Box>
      </Stack>
      <Paper>
        {loading ? (
          <Box p={4} textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            {/* adjust minWidth to sum of your column widths or experiment */}
            <Box sx={{ minWidth: 800 }}>
              <DataGrid
                autoHeight
                rows={filteredRows}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newSize) => setPageSize(newSize)}
                pageSizeOptions={[10, 25, 50, 100]}
                pagination
                onCellClick={(params) => {
                  if (
                    params.field === "action" ||
                    params.field === "status" ||
                    params.field === "assignedTo"
                  )
                    return; // ← IGNORE clicks on the unarchive button
                  setSelectedRow(params.row);
                  setRowDialogOpen(true);
                }}
              />
            </Box>
          </Box>
        )}
      </Paper>

      {/* Row Detail Dialog */}
      <RowDialogAssignments
        open={rowDialogOpen}
        onClose={() => setRowDialogOpen(false)}
        selectedRow={selectedRow}
        employees={employees}
      />

      <DialogAssignment
        confirmDialogOpen={confirmDialogOpen}
        handleCancelAssign={handleCancelAssign}
        handleConfirmAssign={handleConfirmAssign}
        dialogRow={dialogRow}
        dialogEmpId={dialogEmpId}
        employees={employees}
        completeDialogOpen={completeDialogOpen}
        cancelComplete={cancelComplete}
        confirmComplete={confirmComplete}
        rejectDialogOpen={rejectDialogOpen}
        cancelReject={cancelReject}
        confirmReject={confirmReject}
        uploadDialogOpen={uploadDialogOpen}
        setUploadDialogOpen={setUploadDialogOpen}
        handleUpload={handleUpload}
        reportFile={reportFile}
        setReportFile={setReportFile}
        remarks={remarks}
        setRemarks={setRemarks}
        errorDialogOpen={errorDialogOpen}
        errorDialogMsg={errorDialogMsg}
        setErrorDialogOpen={setErrorDialogOpen}
        statusConfirmDialogOpen={statusConfirmDialogOpen}
        cancelStatusChange={cancelStatusChange}
        confirmStatusChange={confirmStatusChange}
        dialogDesiredStatus={dialogDesiredStatus}
      />
    </Box>
  );
}
