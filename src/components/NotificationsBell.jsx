// src/components/NotificationsBell.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  IconButton,
  Badge,
  Typography,
  Divider,
  Popper,
  Paper,
  Card,
  CardContent,
  ButtonBase,
  Stack,
  Button,
  Grow,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useTheme } from "@mui/material/styles";
import io from "socket.io-client";
import { AppContent } from "../context/AppContext";
import axios from "axios";

let socket;

export default function NotificationsBell({ navigate }) {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { userData, backendUrl } = useContext(AppContent);

  const open = Boolean(anchorEl);

  // Fetch initial notifications
  const fetchInitialNotifications = async () => {
    if (!userData?._id) return;
    try {
      const response = await axios.get(`${backendUrl}/api/notifications/`, {
        withCredentials: true,
      });

      if (response.data.success && Array.isArray(response.data.notifications)) {
        const fetched = response.data.notifications;
        setNotifications(fetched);
        setUnreadCount(
          fetched.filter(
            (n) => !n.isReadBy?.some((r) => r.userId === userData._id)
          ).length
        );
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark a single notification as read
  const markNotificationAsRead = async (notifId) => {
    try {
      await axios.put(
        `${backendUrl}/api/notifications/mark-one/${notifId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Socket + initial fetch
  useEffect(() => {
    if (userData?._id) {
      fetchInitialNotifications();

      if (!socket) {
        socket = io(backendUrl, {
          withCredentials: true,
          transports: ["websocket", "polling"],
        });

        socket.emit("join", userData._id);

        socket.on("newNotification", (notification) => {
          setNotifications((prev) => [
            { ...notification, isReadBy: [] },
            ...prev,
          ]);
          setUnreadCount((prev) => prev + 1);
        });

        return () => {
          socket.disconnect();
          socket = null;
        };
      }
    }
  }, [userData, backendUrl]);

  // Toggle panel
  const handleNotifClick = (event) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Card click
  const handleCardClick = async (notif) => {
    const alreadyRead = notif.isReadBy?.some((r) => r.userId === userData._id);

    if (!alreadyRead) {
      await markNotificationAsRead(notif._id);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notif._id
            ? {
                ...n,
                isReadBy: [
                  ...(n.isReadBy || []),
                  { userId: userData._id, readAt: new Date() },
                ],
              }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    }

    navigate(`/report-management/assignments?id=${notif.entityId}`);
    handleClose();
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: (theme) => theme.spacing(1.5), // 1.5 * 8px = 12px
          right: (theme) => theme.spacing(10), // 10 * 8px = 80px
          zIndex: (theme) => theme.zIndex.modal,
        }}
      >
        <IconButton onClick={handleNotifClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon
              sx={{ color: (theme) => theme.palette.primary.main }}
            />
          </Badge>
        </IconButton>
      </Box>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        transition
        sx={{ zIndex: theme.zIndex.modal, mt: 2 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: "top right" }}>
            <Paper
              elevation={8}
              sx={{
                width: 300,
                maxHeight: 400,
                borderRadius: 2,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                bgcolor: "background.paper",
                color: "text.primary",
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ p: 2, pb: 1 }}>
                Notifications
              </Typography>
              <Divider />
              <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
                <Stack spacing={1} sx={{ p: 1 }}>
                  {notifications.length > 0 ? (
                    notifications.map((notif, index) => {
                      const isRead = notif.isReadBy?.some(
                        (r) => r.userId === userData._id
                      );
                      return (
                        <ButtonBase
                          key={notif._id || index}
                          onClick={() => handleCardClick(notif)}
                          sx={{
                            textAlign: "left",
                            borderRadius: 1,
                            bgcolor: isRead
                              ? "action.selected"
                              : "background.default",
                            "&:hover": {
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          <Card
                            elevation={0}
                            sx={{
                              width: "100%",
                              bgcolor: "transparent",
                            }}
                          >
                            <CardContent sx={{ py: 1, px: 1.5 }}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {notif.message}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(
                                  notif.createdAt || notif.date
                                ).toLocaleString()}
                              </Typography>
                            </CardContent>
                          </Card>
                        </ButtonBase>
                      );
                    })
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ p: 2, textAlign: "center" }}
                    >
                      No new notifications
                    </Typography>
                  )}
                </Stack>
              </Box>
              <Divider />
              <Box textAlign="center" p={1}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    navigate("/report-management/assignments");
                    handleClose();
                  }}
                >
                  See All Assignments
                </Button>
              </Box>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
