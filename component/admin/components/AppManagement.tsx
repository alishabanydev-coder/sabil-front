import { Button, Modal, Stack, Typography } from "@mui/material";

const sections = [
  { name: "navBtn", title: "Navigation Buttons", url: "" },
  { name: "video", title: "Videos", url: "" },
  { name: "banner", title: "Banners", url: "" },
];

const style = {
  direction: "ltr",
  height: "auto",
  maxHeight: "80vh",
  width: "50%",
  position: "absolute",
  flexDirection: "row",
  overflow: "auto",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  gap: 2,
};

import { useState } from "react";

const AppManagement = () => {
  const [open, setOpen] = useState(false);

  const reset = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Stack>
      <Stack
        sx={{
          position: "relative",
          height: "calc(100vh - 60px)",
          width: "100%",
          gap: 1,
          px: 2,
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
          borderRadius: 2,
          p: 2,
          mt: 3,
        }}
      >
        <Stack
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: -20,
            right: 0,
          }}
        >
          <Button
            sx={{
              width: 200,
              boxShadow: (theme) =>
                `0px 2px 12px 1px ${theme.palette.primary.main}`,
            }}
            variant="contained"
            color="primary"
            onClick={handleOpen}
          >
            Add App Management
          </Button>
        </Stack>
      </Stack>

      <Modal open={open} onClose={reset}>
        <Stack sx={style}>
          <Typography variant="h6">Manage {`something`}</Typography>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default AppManagement;
