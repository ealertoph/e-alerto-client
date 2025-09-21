// src/components/FeedbackColumns.jsx
import React from "react";
import { Rating, Tooltip, Typography } from "@mui/material";

const FeedbackColumns = () => [
  {
    field: "reportId",
    headerName: "Report ID",
    flex: 1,
  },
  {
    field: "overall",
    headerName: "Overall",
    flex: 0.6,
    renderCell: ({ value }) => <Rating value={value} readOnly size="small" />,
  },
  {
    field: "service",
    headerName: "Service",
    flex: 0.6,
    renderCell: ({ value }) => <Rating value={value} readOnly size="small" />,
  },
  {
    field: "speed",
    headerName: "Speed",
    flex: 0.6,
    renderCell: ({ value }) => <Rating value={value} readOnly size="small" />,
  },
  {
    field: "feedback",
    headerName: "Feedback",
    flex: 2,
    renderCell: ({ row }) => (
      <Tooltip title={row.fullFeedback} arrow>
        <Typography variant="body2" noWrap sx={{ cursor: "pointer" }}>
          {row.feedback}
        </Typography>
      </Tooltip>
    ),
  },
  {
    field: "timestamp",
    headerName: "Submitted At",
    flex: 1.2,
  },
];

export default FeedbackColumns;
