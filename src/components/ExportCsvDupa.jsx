// src/components/ExportCsvDupa.jsx
import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export default function ExportCsvDupa({ reportId, classification, measurement, breakdown, filename }) {
  const handleExport = () => {
    const header = [
      "Report ID",
      "Classification",
      "Measurement (m²)",
      "Estimated Time (h)",
      "Category",
      "Item",
      "Detail",
      "Cost",
    ];

    const rows = [];
    const { estTime, labourRows, equipmentRows, materialRows, labourTotal, equipmentTotal, materialTotal, vat, grandTotal, minorToolsCost } = breakdown;

    // Labour
    labourRows.forEach(r => {
      rows.push([reportId, classification, measurement, estTime, "Labour", r.label, r.detail, r.cost]);
    });
    rows.push([reportId, classification, measurement, estTime, "Subtotal", "Labour", "", labourTotal]);

    // Equipment
    equipmentRows.forEach(r => {
      rows.push([reportId, classification, measurement, estTime, "Equipment", r.label, r.detail, r.cost]);
    });
    rows.push([reportId, classification, measurement, estTime, "Equipment", "Minor Tools", "", minorToolsCost]);
    rows.push([reportId, classification, measurement, estTime, "Subtotal", "Equipment", "", equipmentTotal]);

    // Materials
    materialRows.forEach(r => {
      rows.push([reportId, classification, measurement, estTime, "Materials", r.label, r.detail, r.cost]);
    });
    rows.push([reportId, classification, measurement, estTime, "Subtotal", "Materials", "", materialTotal]);

    // Totals
    rows.push([reportId, classification, measurement, estTime, "Total", "VAT (5%)", "", vat]);
    rows.push([reportId, classification, measurement, estTime, "Total", "Grand Total", "", grandTotal]);

    const csvContent = [header, ...rows]
      .map(row =>
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
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
    <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExport}>
      Export DUPA CSV
    </Button>
  );
}

ExportCsvDupa.propTypes = {
  reportId: PropTypes.string.isRequired,
  classification: PropTypes.string.isRequired,
  measurement: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  breakdown: PropTypes.object.isRequired,
  filename: PropTypes.string,
};

ExportCsvDupa.defaultProps = {
  filename: "dupa_breakdown.csv",
};
