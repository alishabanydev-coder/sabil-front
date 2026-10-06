import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useAdminDonation } from "../hooks/useAdminDonation";
import CommentSelectModal from "./donation/CommentSelectModal";
import CommentSwiper from "./donation/CommentSwiper";
import DonationModal from "./donation/DonationModal";

const Donation = () => {
  const {
    commentsErrorMsg,
    commentsLoading,
    commentsModalLoading,
    commentsOpen,
    commentsSaveErrorMsg,
    deletingId,
    donationComments,
    donationProjects,
    editingProjectId,
    errorMsg,
    handleAddDonation,
    handleClose,
    handleCloseComments,
    handleDeleteDonation,
    handleEditDonation,
    handleOpenComments,
    handleSaveComments,
    isEditing,
    isSavingComments,
    loadDonationProjects,
    loading,
    open,
    selectedCommentIds,
    selectedDonationComments,
    toggleCommentSelection,
  } = useAdminDonation();

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          height: "calc(100vh - 60px)",
          mt: 3,
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
        }}
      >
        <Stack sx={{ width: "100%", height: "280px", overflow: "auto", pt: 1 }}>
          <CommentSwiper
            comments={selectedDonationComments}
            loading={commentsLoading}
            errorMsg={commentsErrorMsg}
            onAdd={handleOpenComments}
          />
        </Stack>

        <Stack
          sx={{
            width: "100%",
            height: "100%",
            px: 2,
            pb: 2,
            overflow: "auto",
            gap: 1.5,
          }}
        >
          <Divider>
            <Button
              sx={{
                width: 200,
                boxShadow: (theme) =>
                  `0px 2px 12px 1px ${theme.palette.primary.main}`,
              }}
              variant="contained"
              color="primary"
              onClick={handleAddDonation}
            >
              Add Donation
            </Button>
          </Divider>
          {loading ? (
            <Stack sx={{ alignItems: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Stack>
          ) : errorMsg ? (
            <Typography variant="body2" sx={{ color: "error.main" }}>
              {errorMsg}
            </Typography>
          ) : donationProjects.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary", py: 2 }}>
              No donation projects yet.
            </Typography>
          ) : (
            donationProjects.map((project) => (
              <Stack
                key={project._id}
                sx={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <Stack sx={{ gap: 0.5 }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    {project.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {`${project.status ?? "ongoing"} · ${
                      project.currency ?? "USD"
                    } ${project.raisedAmount ?? 0} / ${
                      project.goalAmount ?? 0
                    }`}
                    {project.listOrder ? ` · order ${project.listOrder}` : ""}
                  </Typography>
                </Stack>

                <Stack sx={{ flexDirection: "row", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="Edit donation project"
                    onClick={() => handleEditDonation(project._id)}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    aria-label="Delete donation project"
                    disabled={deletingId === project._id}
                    onClick={() => void handleDeleteDonation(project._id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            ))
          )}
        </Stack>
      </Stack>

      <DonationModal
        open={open}
        isEditing={isEditing}
        editingProjectId={editingProjectId}
        existingProjects={donationProjects}
        onClose={handleClose}
        onSaved={loadDonationProjects}
      />

      <CommentSelectModal
        open={commentsOpen}
        comments={donationComments}
        selectedItemIds={selectedCommentIds}
        loading={commentsModalLoading && donationComments.length === 0}
        errorMsg={commentsErrorMsg}
        isSaving={isSavingComments}
        saveErrorMsg={commentsSaveErrorMsg}
        handleClose={handleCloseComments}
        handleSave={handleSaveComments}
        toggleItemSelection={toggleCommentSelection}
      />
    </Stack>
  );
};

export default Donation;
