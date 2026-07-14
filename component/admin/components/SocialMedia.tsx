import {
  alpha,
  Button,
  CircularProgress,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAdminSocialMedia } from "../hooks/useAdminSocialMedia";

const style = {
  direction: "ltr",
  height: "auto",
  maxHeight: "80vh",
  width: 380,
  position: "absolute",
  flexDirection: "column",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  gap: 2,
};

const SocialMedia = () => {
  const {
    displayedLogoUrl,
    editingSocialMedia,
    errorMsg,
    handleCancel,
    handleClose,
    handleDeleteSocialMedia,
    handleOpen,
    handleSelectForEdit,
    handleSubmit,
    isSubmitDisabled,
    isSubmitting,
    loading,
    name,
    open,
    setLogo,
    setName,
    setUrl,
    socialMedias,
    submitErrorMsg,
    submitLabel,
    url,
  } = useAdminSocialMedia();

  return (
    <Stack
      direction={"row"}
      sx={{ width: "100%", height: "100%", position: "relative", gap: 2 }}
    >
      <Stack
        sx={{
          position: "relative",
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
          borderRadius: 2,
          p: 2,
          mt: 3,
          width: "100%",
          height: "calc(100vh - 60px)",
        }}
      >
        <Stack
          sx={{
            height: "100%",
            position: "absolute",
            top: -20,
            right: 0,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            sx={{
              width: 200,
              boxShadow: (theme) =>
                `0px 2px 12px 1px ${theme.palette.primary.main}`,
              "&:disabled": {
                backgroundColor: "grey.500",
                color: "white",
              },
            }}
          >
            Add Social Media +
          </Button>
        </Stack>

        <Stack sx={{ height: "100%", overflow: "auto" }}>
          {loading ? (
            <Stack
              sx={{
                width: "100%",
                alignItems: "center",
                py: 4,
              }}
            >
              <CircularProgress size={28} />
            </Stack>
          ) : errorMsg ? (
            <Typography color="error" variant="body2">
              {errorMsg}
            </Typography>
          ) : socialMedias.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              No social media links yet.
            </Typography>
          ) : (
            <Stack sx={{ gap: 1.25 }}>
              {socialMedias.map((socialMedia) => {
                const isSelected = editingSocialMedia?._id === socialMedia._id;

                return (
                  <Stack
                    key={socialMedia._id}
                    onClick={() => handleSelectForEdit(socialMedia)}
                    sx={{
                      p: 1.25,
                      borderRadius: 1.5,
                      zIndex: 1000,
                      border: (theme) =>
                        `1px solid ${
                          isSelected
                            ? theme.palette.primary.main
                            : theme.palette.divider
                        }`,
                      bgcolor: (theme) =>
                        isSelected
                          ? alpha(theme.palette.primary.main, 0.08)
                          : "transparent",
                      cursor: "pointer",
                      gap: 0.75,
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.08),
                        border: (theme) =>
                          `1px solid ${theme.palette.primary.main}`,
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{ alignItems: "center", gap: 1.5 }}
                    >
                      <Stack
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1,
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={socialMedia.icon}
                          alt={socialMedia.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Stack>
                      <Stack sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {socialMedia.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {socialMedia.url}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Stack>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack sx={style}>
          <Stack sx={{ gap: 1 }}>
            <Stack
              sx={{
                width: "95%",
                mx: "auto",
                aspectRatio: "16 / 9",
                overflow: "hidden",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                borderRadius: 1,
              }}
            >
              {displayedLogoUrl ? (
                <img
                  src={displayedLogoUrl}
                  alt="logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Typography color="text.secondary" variant="body2">
                  No logo selected
                </Typography>
              )}
            </Stack>
            <Stack>
              <Button
                component="label"
                variant="contained"
                color="primary"
                fullWidth
              >
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(event) => setLogo(event.target.files?.[0] ?? null)}
                />
                {editingSocialMedia ? "Replace Logo" : "Add Logo"}
              </Button>
            </Stack>
          </Stack>
          <Stack sx={{ gap: 2 }}>
            <TextField
              label="Name"
              variant="standard"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
            />
            <TextField
              label="URL"
              variant="standard"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              fullWidth
            />
            <Stack direction={"row"} sx={{ gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                disabled={isSubmitDisabled}
              >
                {submitLabel}
              </Button>
              {editingSocialMedia && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDeleteSocialMedia}
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCancel}
                disabled={isSubmitting}
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
    </Stack>
  );
};

export default SocialMedia;
