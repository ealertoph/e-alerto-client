// src/components/ExportCsvAssignments.jsx
import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

/**
 * Exports the given assignment rows to CSV.
 */
export default function ExportCsvAssignments({
  rows,
  employees,
  searchQuery = "",
  filename = "assignments.csv",
  disabled,
}) {
  const handleExport = () => {
    // Filter rows based on search query
    const filtered = rows.filter((r) =>
      Object.values(r).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    // CSV header
    const header = [
      "Report ID",
      "Status",
      "Assigned To",
      "Job Order No.",
      "Assigned At",
      "Site Inspection Report",
      "Completion Date",
      "Remarks", // added
    ];

    // CSV rows
    const csvRows = filtered.map((r) => [
      r.reportNumber,
      r.status,
      r.assignedTo
        ? employees.find((u) => u.id === r.assignedTo)?.fullName || ""
        : "",
      r.assignmentNumber,
      r.timestamp,
      r.originalFileName || r.siteInspectionReport || "",
      r.accomplishmentDate || "",
      r.remarks || "", // added
    ]);

    // Serialize to CSV
    const csvContent = [header, ...csvRows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outlined"
      onClick={handleExport}
      startIcon={<DownloadIcon />}
      disabled={disabled}
    >
      Export CSV
    </Button>
  );
}

ExportCsvAssignments.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      reportNumber: PropTypes.string,
      status: PropTypes.string,
      assignedTo: PropTypes.string,
      assignmentNumber: PropTypes.string,
      timestamp: PropTypes.string,
      originalFileName: PropTypes.string,
      siteInspectionReport: PropTypes.string,
      accomplishmentDate: PropTypes.string,
      remarks: PropTypes.string, // added
    })
  ).isRequired,
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      fullName: PropTypes.string,
    })
  ).isRequired,
  searchQuery: PropTypes.string,
  filename: PropTypes.string,
  disabled: PropTypes.bool,
};

ExportCsvAssignments.defaultProps = {
  searchQuery: "",
  filename: "assignments.csv",
  disabled: false,
};
