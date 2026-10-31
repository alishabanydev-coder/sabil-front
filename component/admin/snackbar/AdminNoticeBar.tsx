"use client";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import {
  subscribeAdminNotices,
  type AdminNotice,
} from "./notifyAdmin";

const AdminNoticeBar = () => {
  const [notice, setNotice] = useState<AdminNotice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeAdminNotices((nextNotice) => {
    setNotice(nextNotice);
    setOpen(true);
  }), []);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      key={notice?.id}
      open={open && Boolean(notice)}
      autoHideDuration={notice?.severity === "error" ? 7000 : 4500}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 2 }}
    >
      <Alert
        severity={notice?.severity ?? "info"}
        variant="filled"
        onClose={handleClose}
        sx={{
          width: "100%",
          minWidth: { xs: 280, sm: 420 },
          maxWidth: 640,
          alignItems: "center",
          fontWeight: 700,
        }}
      >
        {notice?.message}
      </Alert>
    </Snackbar>
  );
};

export default AdminNoticeBar;
