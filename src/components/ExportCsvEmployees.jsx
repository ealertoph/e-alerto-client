import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

/**
 * Exports the given employee rows to CSV, including status column.
 */
export default function ExportCsvEmployees({ rows, filename = "employees.csv", disabled }) {
  const handleExport = () => {
    // Build CSV header and rows
    const header = [
      "Employee No.",
      "Status",
      "Surname",
      "First Name",
      "Middle Name",
      "Suffix",
      "District",
      "Position",
      "Email",
      "Phone",
    ];

    const csvRows = rows.map((u) => [
      u.employeeNumber,
      u.status,
      u.surname,
      u.firstName,
      u.middleName,
      u.suffix,
      u.district,
      u.position,
      u.email,
      u.phone,
    ]);

    // Serialize to CSV string
    const csvContent = [header, ...csvRows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
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
      startIcon={<DownloadIcon />}
      onClick={handleExport}
      disabled={disabled}
    >
      Export CSV
    </Button>
  );
}

ExportCsvEmployees.propTypes = {
  /** Array of employee objects to export */
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      employeeNumber: PropTypes.string,
      status: PropTypes.string,
      surname: PropTypes.string,
      firstName: PropTypes.string,
      middleName: PropTypes.string,
      suffix: PropTypes.string,
      district: PropTypes.string,
      position: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
    })
  ).isRequired,
  /** File name for the downloaded CSV */
  filename: PropTypes.string,
  /** Disable the button when data is loading */
  disabled: PropTypes.bool,
};

ExportCsvEmployees.defaultProps = {
  filename: "employees.csv",
  disabled: false,
};
