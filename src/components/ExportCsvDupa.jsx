// src/components/ExportCsvDupa.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Menu, MenuItem } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import qcLogo from "../assets/qc-logo.png";
import qcdeLogo from "../assets/qcde-logo.png";

export default function ExportCsvDupa({
  reportId,
  classification,
  measurement,
  breakdown,
  filename,
  preparedBy = "",
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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

  const buildRows = () => {
    const {
      estTime,
      labourRows,
      equipmentRows,
      materialRows,
      labourTotal,
      equipmentTotal,
      materialTotal,
      vat,
      grandTotal,
      minorToolsCost,
    } = breakdown;

    const rows = [];

    labourRows.forEach((r) => {
      rows.push([
        reportId,
        classification,
        measurement,
        estTime,
        "Labour",
        r.label,
        r.detail,
        r.cost,
      ]);
    });
    rows.push([
      reportId,
      classification,
      measurement,
      estTime,
      "Subtotal",
      "Labour",
      "",
      labourTotal,
    ]);

    equipmentRows.forEach((r) => {
      rows.push([
        reportId,
        classification,
        measurement,
        estTime,
        "Equipment",
        r.label,
        r.detail,
        r.cost,
      ]);
    });
    rows.push([
      reportId,
      classification,
      measurement,
      estTime,
      "Equipment",
      "Minor Tools",
      "",
      minorToolsCost,
    ]);
    rows.push([
      reportId,
      classification,
      measurement,
      estTime,
      "Subtotal",
      "Equipment",
      "",
      equipmentTotal,
    ]);

    materialRows.forEach((r) => {
      rows.push([
        reportId,
        classification,
        measurement,
        estTime,
        "Materials",
        r.label,
        r.detail,
        r.cost,
      ]);
    });
    rows.push([
      reportId,
      classification,
      measurement,
      estTime,
      "Subtotal",
      "Materials",
      "",
      materialTotal,
    ]);

    rows.push([
      reportId,
      classification,
      measurement,
      estTime,
      "Total",
      "VAT (5%)",
      "",
      vat,
    ]);
    rows.push([
      reportId,
      classification,
      measurement,
      estTime,
      "Total",
      "Grand Total",
      "",
      grandTotal,
    ]);

    return rows;
  };

  const formatCurrency = (value) => {
    const num = Number(value);
    return Number.isFinite(num)
      ? `PHP ${num.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : value || "";
  };

  const handleExportCSV = () => {
    const rows = buildRows();

    const csvContent = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
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
    const rows = buildRows();

    const body = rows.map((row) =>
      row.map((cell, index) => (index === 7 ? formatCurrency(cell) : cell)),
    );

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
        fillColor: [38, 48, 146],
        textColor: [255, 255, 255],
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
        doc.text("DETAILED UNIT PRICE ANALYSIS REPORT", pageWidth / 2, 36, {
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

    doc.save(`${reportId}_dupa-report.pdf`);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Export DUPA Report
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleExportCSV();
          }}
        >
          CSV
        </MenuItem>

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleExportPDF();
          }}
        >
          PDF
        </MenuItem>
      </Menu>
    </>
  );
}

ExportCsvDupa.propTypes = {
  reportId: PropTypes.string.isRequired,
  classification: PropTypes.string.isRequired,
  measurement: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  breakdown: PropTypes.object.isRequired,
  filename: PropTypes.string,
  preparedBy: PropTypes.string,
};

ExportCsvDupa.defaultProps = {
  filename: "dupa_breakdown.csv",
  preparedBy: "",
};