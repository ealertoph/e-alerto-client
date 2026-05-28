// src/components/ExportCsvAssignments.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Menu, MenuItem } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import qcLogo from "../assets/qc-logo.png";
import qcdeLogo from "../assets/qcde-logo.png";

/**
 * Exports the given assignment rows to CSV.
 */
export default function ExportCsvAssignments({
  getRowsToExport,
  rows,
  employees,
  searchQuery = "",
  filename = "assignments.csv",
  disabled,
  preparedBy = "",
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = () => {
    // Filter rows based on search query
    const filtered = getRowsToExport ? getRowsToExport() : rows;

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
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
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

  const loadImageAsDataURL = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
    });

  const handleExportPDF = async () => {
    const filtered = getRowsToExport ? getRowsToExport() : rows;

    const header = [
      "Report ID",
      "Status",
      "Assigned To",
      "Job Order No.",
      "Assigned At",
      "Site Inspection Report",
      "Completion Date",
      "Remarks",
    ];

    const body = filtered.map((r) => [
      r.reportNumber || "",
      r.status || "",
      r.assignedTo
        ? employees.find((u) => u.id === r.assignedTo)?.fullName || ""
        : "",
      r.assignmentNumber || "",
      r.timestamp || "",
      r.originalFileName || r.siteInspectionReport || "",
      r.accomplishmentDate || "",
      r.remarks || "",
    ]);

    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let leftLogo = null;
    let rightLogo = null;

    try {
      leftLogo = await loadImageAsDataURL(qcLogo);
    } catch (error) {
      console.error("Left logo failed to load:", error);
    }

    try {
      rightLogo = await loadImageAsDataURL(qcdeLogo);
    } catch (error) {
      console.error("Right logo failed to load:", error);
    }

    autoTable(doc, {
      head: [header],
      body,
      startY: 50,
      theme: "grid",
      margin: { top: 50, left: 10, right: 10, bottom: 15 },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
        valign: "middle",
      },
      headStyles: {
        fillColor: [38, 48, 146], // dark blue
        textColor: [255, 255, 255], // white text
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
      },
      didDrawPage: () => {
        if (leftLogo) {
          doc.addImage(leftLogo, "PNG", 10, 8, 22, 22);
        }

        if (rightLogo) {
          doc.addImage(rightLogo, "PNG", pageWidth - 28, 8, 22, 22);
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("QUEZON CITY DEPARTMENT OF ENGINEERING", pageWidth / 2, 12, {
          align: "center",
        });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(
          "5th, 6th, 7th, and 8th Floors, Civic Center Bldg. B, Quezon City Hall Compound, Barangay Central, Diliman, Quezon City",
          pageWidth / 2,
          18,
          { align: "center" },
        );
        doc.text("8988-4242 locals 8658, 8659, 8538", pageWidth / 2, 23, {
          align: "center",
        });
        doc.text("engineering@quezoncity.gov.ph", pageWidth / 2, 28, {
          align: "center",
        });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("LIST OF JOB ORDERS", pageWidth / 2, 36, {
          align: "center",
        });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(`Prepared by: ${preparedBy || "N/A"}`, 10, 42);
        doc.text(
          `Generated on: ${new Date().toLocaleString()}`,
          pageWidth - 10,
          42,
          { align: "right" },
        );

        doc.line(10, 45, pageWidth - 10, 45);

        const pageNumber = doc.getCurrentPageInfo().pageNumber;
        doc.setFontSize(8);
        doc.text(`Page ${pageNumber}`, pageWidth - 10, pageHeight - 6, {
          align: "right",
        });
      },
    });

    doc.save("list-of-job-order-report.pdf");
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleMenuOpen}
        startIcon={<DownloadIcon />}
        disabled={disabled}
      >
        Export Report
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleExport();
          }}
        >
          CSV
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleExportPDF();
          }}
        >
          PDF
        </MenuItem>
      </Menu>
    </>
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
    }),
  ).isRequired,
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      fullName: PropTypes.string,
    }),
  ).isRequired,
  getRowsToExport: PropTypes.func,
  searchQuery: PropTypes.string,
  filename: PropTypes.string,
  disabled: PropTypes.bool,
  preparedBy: PropTypes.string,
};

ExportCsvAssignments.defaultProps = {
  searchQuery: "",
  filename: "assignments.csv",
  disabled: false,
  preparedBy: "",
  getRowsToExport: null,
};
