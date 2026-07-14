import {
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAdminSupporters } from "../hooks/useAdminSupporters";

const style = {
  direction: "ltr",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 2,
  borderRadius: 2,
};

const Supporters = () => {
  const {
    columns,
    email,
    errorMsg,
    handleClose,
    handleExportCsv,
    handleOpenAdd,
    handleSubmit,
    isAddDisabled,
    isSubmitting,
    loading,
    message,
    modalMode,
    open,
    phoneNumbers,
    rows,
    selectedUserId,
    setEmail,
    setMessage,
    setPhoneNumbers,
    setUsername,
    submitErrorMsg,
    username,
  } = useAdminSupporters();

  return (
    <Stack>
      <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}>
        <Typography component="h2" sx={{ fontSize: 22, fontWeight: 700 }}>
          Users
        </Typography>

        <Stack direction="row" sx={{ gap: 1 }}>
          <Button variant="outlined" onClick={handleExportCsv}>
            Export Excel (CSV)
          </Button>
          <Button variant="contained" onClick={handleOpenAdd}>
            Add User
          </Button>
        </Stack>
      </Stack>
      {errorMsg ? (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {errorMsg}
        </Typography>
      ) : null}
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
      />

      <Modal open={open} onClose={handleClose}>
        <Stack sx={style}>
          <Stack sx={{ width: "100%", gap: 2 }}>
            <Typography variant="h6">
              {modalMode === "edit" ? "Edit User" : "Add User"}
            </Typography>

            <TextField
              label="Username"
              variant="standard"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={modalMode === "edit"}
              fullWidth
            />
            <TextField
              label="Email"
              variant="standard"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={modalMode === "edit"}
              fullWidth
            />

            <TextField
              label="Phone Numbers"
              variant="standard"
              type="tel"
              value={phoneNumbers}
              onChange={(event) =>
                setPhoneNumbers(event.target.value.replace(/[^\d,]/g, ""))
              }
              disabled={modalMode === "edit"}
              helperText="Use digits only. For multiple numbers, separate with comma."
              fullWidth
            />
            <TextField
              label="Message"
              multiline
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={modalMode === "edit"}
              fullWidth
            />
            <Stack direction="row" sx={{ gap: 2 }}>
              {modalMode === "add" ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isAddDisabled}
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </Button>
              ) : null}
              <Button variant="outlined" color="primary" onClick={handleClose}>
                {modalMode === "edit" ? "Close" : "Cancel"}
              </Button>
            </Stack>
            {selectedUserId ? (
              <Typography variant="caption" color="text.secondary">
                User ID: {selectedUserId}
              </Typography>
            ) : null}
            {submitErrorMsg ? (
              <Typography color="error" variant="body2">
                {submitErrorMsg}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default Supporters;
