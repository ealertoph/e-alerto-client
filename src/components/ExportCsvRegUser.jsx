// src/components/ExportCsvRegUser.jsx
import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

/**
 * Exports registered user data to CSV format.
 */
const ExportCsvRegUser = ({ rows }) => {
  const exportToCSV = () => {
    const csvContent = [
      ["ID", "Username", "Email", "Phone"],
      ...rows.map((u) => [u.id, u.username, u.email, u.phone]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={exportToCSV}
      startIcon={<DownloadIcon />}
      variant="contained"
    >
      Export CSV
    </Button>
  );
};

ExportCsvRegUser.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      username: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
    })
  ).isRequired,
};

export default ExportCsvRegUser;
