// src/components/ExportCsvReports.jsx
import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

/**
 * Exports the given reports data to CSV.
 */
const ExportCsvReports = ({ rows }) => {
  const exportCSV = () => {
    const csv = [
      [
        "ID",
        "Classification",
        "Measurement",
        "Location",
        "District",
        "Status",
        "Description",
        "Timestamp",
        "Priority",
      ],
      ...rows.map((r) => [
        r.id,
        r.classification,
        r.measurement,
        `"${r.location.replace(/"/g, '""')}"`, // Escape inner quotes
        r.district,
        r.status,
        r.description,
        `"${new Date(r.timestamp).toLocaleString().replace(/"/g, '""')}"`, // Format and escape timestamp
        r.duplicateCounter,
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reports.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="contained"
      startIcon={<DownloadIcon />}
      onClick={exportCSV}
    >
      Export CSV
    </Button>
  );
};

ExportCsvReports.propTypes = {
  /** Array of report objects to export */
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      classification: PropTypes.string,
      measurement: PropTypes.string,
      location: PropTypes.string,
      district: PropTypes.string,
      status: PropTypes.string,
      description: PropTypes.string,
      timestamp: PropTypes.string,
      duplicateCounter: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    })
  ).isRequired,
};

export default ExportCsvReports;
