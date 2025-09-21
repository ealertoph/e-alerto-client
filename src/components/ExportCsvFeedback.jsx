import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

/**
 * Exports the given feedback rows to CSV.
 */
export default function ExportCsvFeedback({
  rows,
  filename = "feedback.csv",
  disabled,
}) {
  const handleExport = () => {
    const header = [
      "Feedback ID",
      "Report ID",
      "Overall",
      "Service",
      "Speed",
      "Feedback",
      "Timestamp",
    ];

    const csvRows = rows.map((f) => [
      f.id,
      f.reportId,
      f.overall,
      f.service,
      f.speed,
      f.fullFeedback,
      f.timestamp,
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
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="contained"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
      disabled={disabled}
    >
      Export CSV
    </Button>
  );
}

ExportCsvFeedback.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      reportId: PropTypes.string,
      overall: PropTypes.number,
      service: PropTypes.number,
      speed: PropTypes.number,
      fullFeedback: PropTypes.string,
      timestamp: PropTypes.string,
    })
  ).isRequired,
  filename: PropTypes.string,
  disabled: PropTypes.bool,
};

ExportCsvFeedback.defaultProps = {
  filename: "feedback.csv",
  disabled: false,
};
