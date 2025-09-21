import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Tooltip,
} from "@mui/material";

const SatisfactionCard = ({ averageRatings, loading }) => {
  const [progressValue, setProgressValue] = useState(0);

  // Compute overall average
  const computedAverage =
    (averageRatings.avgOverall +
      averageRatings.avgService +
      averageRatings.avgSpeed) /
    3;

  const computedProgress = computedAverage * 20; // convert 5.0 scale to 100

  // Animate progress on load
  useEffect(() => {
    let start = 0;
    const step = () => {
      if (start < computedProgress) {
        start += 1;
        setProgressValue(start);
        requestAnimationFrame(step);
      } else {
        setProgressValue(computedProgress);
      }
    };
    if (!loading) requestAnimationFrame(step);
  }, [computedProgress, loading]);

  // Color logic
  const getColor = (value) => {
    if (value >= 80) return "#4caf50"; // green
    if (value >= 50) return "#ff9800"; // orange
    return "#f44336"; // red
  };

  return (
    <Card
      sx={{
        mb: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <CardContent>
        <Typography variant="subtitle2" color="text.primary" fontWeight={600} gutterBottom>
          Overall Satisfaction Rating
        </Typography>

        {!loading ? (
          <>
            <Tooltip
              title={
                <Box>
                  <Typography variant="body2">
                    Overall: {averageRatings.avgOverall.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    Service: {averageRatings.avgService.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    Speed: {averageRatings.avgSpeed.toFixed(2)}
                  </Typography>
                </Box>
              }
              arrow
              placement="top"
            >
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  mt: 1,
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={progressValue}
                  size={100}
                  thickness={5}
                  sx={{
                    color: getColor(progressValue),
                    "& .MuiCircularProgress-circle": {
                      strokeLinecap: "round", // ✅ rounded ends
                    },
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    {computedAverage.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>

            {/* ✅ Add count display here */}
            <Typography variant="body2" color="text.secondary" mt={1}>
              From {averageRatings.count} completed reports rated by QCitizens
            </Typography>
          </>
        ) : (
          <CircularProgress size={24} />
        )}
      </CardContent>
    </Card>
  );
};

export default SatisfactionCard;
