import {
  Button,
  ButtonGroup,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DonationSource, useAdminUsers } from "../hooks/useAdminUsers";

const modalStyle = {
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
  p: 2,
  gap: 2,
};

const addDonationModalStyle = {
  ...modalStyle,
  width: "28rem",
};

export type { UserRecord } from "../hooks/useAdminUsers";

const Users = () => {
  const {
    addConfirmPassword,
    addDonationErrorMsg,
    addDonationOpen,
    addEmail,
    addPassword,
    addShowAsAnonymousInDonations,
    addUserErrorMsg,
    addUserOpen,
    addUsername,
    amount,
    columns,
    currency,
    donationProjectOptions,
    donationsErrorMsg,
    editDonationErrorMsg,
    editDonationOpen,
    editDonationProjectTitle,
    editOpen,
    editPanel,
    email,
    errorMsg,
    filteredRows,
    filterTargetType,
    filterUsername,
    handleAddDonation,
    handleCloseAddDonation,
    handleCloseAddUser,
    handleCloseEdit,
    handleCloseEditDonation,
    handleCreateUser,
    handleDeleteDonation,
    handleOpenAddDonation,
    handleOpenAddUser,
    handleOpenEditDonation,
    handleSaveProfile,
    handleShowDonations,
    handleUpdateDonation,
    isAddingDonation,
    isAddDonationDisabled,
    isCreateUserDisabled,
    isCreatingUser,
    isDeletingDonationId,
    isEditDonationDisabled,
    isFetchingDonationProjects,
    isLoadingDonations,
    isProfileSaveDisabled,
    isSubmitting,
    isUpdatingDonation,
    loading,
    selectedDonationProjectId,
    setAddConfirmPassword,
    setAddEmail,
    setAddPassword,
    setAddShowAsAnonymousInDonations,
    setAddUsername,
    setAmount,
    setCurrency,
    setFilterTargetType,
    setFilterUsername,
    setSelectedDonationProjectId,
    setShowAsAnonymousInDonations,
    setSource,
    setUsername,
    showAsAnonymousInDonations,
    source,
    submitErrorMsg,
    userDonations,
    username,
  } = useAdminUsers();

  return (
    <Stack>
      <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}>
        <Typography component="h2" sx={{ fontSize: 22, fontWeight: 700 }}>
          Users
        </Typography>

        <Stack direction="row" sx={{ gap: 1 }}>
          <TextField
            size="small"
            label="Filter Username"
            value={filterUsername}
            onChange={(event) => setFilterUsername(event.target.value)}
          />

          <TextField
            size="small"
            label="Filter Target Type"
            select
            value={filterTargetType}
            onChange={(event) => setFilterTargetType(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="blog">user name</MenuItem>
          </TextField>

          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddUser}
          >
            Add User
          </Button>
        </Stack>
      </Stack>

      {errorMsg ? (
        <Typography color="error" sx={{ mb: 1 }}>
          {errorMsg}
        </Typography>
      ) : null}

      <DataGrid
        rows={filteredRows}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      />

      <Modal open={addUserOpen} onClose={handleCloseAddUser}>
        <Stack sx={addDonationModalStyle}>
          <Stack sx={{ width: "100%", gap: 2 }}>
            <Typography variant="h6">Add User</Typography>

            <TextField
              label="Username"
              variant="standard"
              value={addUsername}
              onChange={(event) => setAddUsername(event.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              variant="standard"
              value={addEmail}
              onChange={(event) => setAddEmail(event.target.value)}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              variant="standard"
              value={addPassword}
              onChange={(event) => setAddPassword(event.target.value)}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="standard"
              value={addConfirmPassword}
              onChange={(event) => setAddConfirmPassword(event.target.value)}
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={addShowAsAnonymousInDonations}
                  onChange={(event) =>
                    setAddShowAsAnonymousInDonations(event.target.checked)
                  }
                />
              }
              label="Show as anonymous in donations"
            />

            <Stack direction="row" sx={{ gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCloseAddUser}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                disabled={isCreateUserDisabled}
                variant="contained"
                color="primary"
                onClick={() => void handleCreateUser()}
              >
                {isCreatingUser ? "Creating..." : "Create User"}
              </Button>
            </Stack>
            {addUserErrorMsg ? (
              <Typography color="error" variant="body2">
                {addUserErrorMsg}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Modal>

      <Modal open={editOpen} onClose={handleCloseEdit}>
        <Stack sx={modalStyle}>
          <Stack sx={{ width: "100%", gap: 1 }}>
            <Typography variant="h6">Edit User</Typography>

            <TextField
              label="Username"
              variant="standard"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              variant="standard"
              value={email}
              fullWidth
              disabled
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={showAsAnonymousInDonations}
                  onChange={(event) =>
                    setShowAsAnonymousInDonations(event.target.checked)
                  }
                />
              }
              label="Show as anonymous in donations"
            />

            <ButtonGroup fullWidth>
              <Button
                variant={editPanel === "donations" ? "contained" : "outlined"}
                onClick={handleShowDonations}
              >
                Donations
              </Button>
              <Button variant="outlined" onClick={handleOpenAddDonation}>
                Add Donation
              </Button>
            </ButtonGroup>

            {editPanel === "donations" ? (
              <Stack
                sx={{
                  gap: 1,
                  maxHeight: 260,
                  border: "1px solid",
                  borderColor: "primary.main",
                  p: 1,
                  borderRadius: 1,
                  overflow: "auto",
                }}
              >
                {isLoadingDonations ? (
                  <Stack sx={{ py: 2, alignItems: "center" }}>
                    <CircularProgress size={24} />
                  </Stack>
                ) : donationsErrorMsg ? (
                  <Typography color="error" variant="body2">
                    {donationsErrorMsg}
                  </Typography>
                ) : userDonations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No donations yet.
                  </Typography>
                ) : (
                  userDonations.map((donation) => (
                    <Stack
                      key={donation.id}
                      direction="row"
                      sx={{
                        p: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        boxShadow: 2,
                        gap: 1,
                      }}
                    >
                      <Stack sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {donation.projectTitle}
                        </Typography>
                        <Typography variant="body2">
                          {donation.amount} {donation.currency}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {donation.source} ·{" "}
                          {donation.createdAt
                            ? new Date(donation.createdAt).toLocaleString()
                            : "—"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" sx={{ gap: 0.5, flexShrink: 0 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: 11, minWidth: 0, px: 1 }}
                          onClick={() => handleOpenEditDonation(donation)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{ fontSize: 11, minWidth: 0, px: 1 }}
                          disabled={isDeletingDonationId === donation.id}
                          onClick={() => void handleDeleteDonation(donation)}
                        >
                          {isDeletingDonationId === donation.id
                            ? "..."
                            : "Delete"}
                        </Button>
                      </Stack>
                    </Stack>
                  ))
                )}
              </Stack>
            ) : null}

            <Stack direction="row" sx={{ gap: 2 }}>
              <Button
                fullWidth
                disabled={isProfileSaveDisabled}
                variant="contained"
                color="primary"
                onClick={() => void handleSaveProfile()}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCloseEdit}
              >
                Cancel
              </Button>
            </Stack>
            {submitErrorMsg ? (
              <Typography color="error" variant="body2">
                {submitErrorMsg}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Modal>

      <Modal open={addDonationOpen} onClose={handleCloseAddDonation}>
        <Stack sx={addDonationModalStyle}>
          <Stack sx={{ width: "100%", gap: 2 }}>
            <Typography variant="h6">Add Donation</Typography>

            <TextField
              label="Donation Project"
              select
              variant="standard"
              value={selectedDonationProjectId}
              onChange={(event) =>
                setSelectedDonationProjectId(event.target.value)
              }
              fullWidth
              disabled={
                isFetchingDonationProjects ||
                donationProjectOptions.length === 0
              }
              helperText={
                isFetchingDonationProjects
                  ? "Loading donation projects..."
                  : donationProjectOptions.length === 0
                  ? "No donation projects available."
                  : ""
              }
            >
              <MenuItem value="">Select donation project</MenuItem>
              {donationProjectOptions.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Amount"
              type="number"
              variant="standard"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              fullWidth
              slotProps={{
                htmlInput: { min: 0, step: "any" },
              }}
            />

            <TextField
              label="Currency"
              select
              variant="standard"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              fullWidth
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="INR">INR</MenuItem>
            </TextField>

            <Stack direction="row" sx={{ gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCloseAddDonation}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                disabled={isAddDonationDisabled}
                variant="contained"
                color="primary"
                onClick={() => void handleAddDonation()}
              >
                {isAddingDonation ? "Adding..." : "Add Donation"}
              </Button>
            </Stack>
            {addDonationErrorMsg ? (
              <Typography color="error" variant="body2">
                {addDonationErrorMsg}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Modal>

      <Modal open={editDonationOpen} onClose={handleCloseEditDonation}>
        <Stack sx={addDonationModalStyle}>
          <Stack sx={{ width: "100%", gap: 2 }}>
            <Typography variant="h6">Edit Donation</Typography>

            <TextField
              label="Donation Project"
              variant="standard"
              value={editDonationProjectTitle}
              fullWidth
              disabled
            />

            <TextField
              label="Amount"
              type="number"
              variant="standard"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              fullWidth
              slotProps={{
                htmlInput: { min: 0, step: "any" },
              }}
            />

            <TextField
              label="Currency"
              select
              variant="standard"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              fullWidth
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="INR">INR</MenuItem>
            </TextField>

            <TextField
              label="Source"
              select
              variant="standard"
              value={source}
              onChange={(event) =>
                setSource(event.target.value as DonationSource)
              }
              fullWidth
            >
              <MenuItem value="manual">manual</MenuItem>
              <MenuItem value="patreon">patreon</MenuItem>
              <MenuItem value="whatsapp">whatsapp</MenuItem>
            </TextField>

            <Stack direction="row" sx={{ gap: 2 }}>
              <Button
                fullWidth
                disabled={isEditDonationDisabled}
                variant="contained"
                color="primary"
                onClick={() => void handleUpdateDonation()}
              >
                {isUpdatingDonation ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCloseEditDonation}
              >
                Cancel
              </Button>
            </Stack>
            {editDonationErrorMsg ? (
              <Typography color="error" variant="body2">
                {editDonationErrorMsg}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default Users;
