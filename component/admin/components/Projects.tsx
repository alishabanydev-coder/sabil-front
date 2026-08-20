import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useAdminProjects } from "../hooks/useAdminProjects";

const style = {
  direction: "ltr",
  height: "auto",
  maxHeight: "80vh",
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

const Projects = () => {
  const {
    characters,
    fileInputRef,
    formMessage,
    formMessageColor,
    handleAddCharacter,
    handleCharacterImageChange,
    handleCharacterNameChange,
    handleClose,
    handleDeleteProject,
    handleEditProject,
    handleImageChange,
    handleOpen,
    handleRemoveCharacter,
    handleSubmit,
    loadingProjects,
    open,
    projectDescription,
    projectImage,
    projectName,
    projects,
    resetForm,
    setProjectDescription,
    setProjectName,
    submitLabel,
    submitting,
  } = useAdminProjects();

  // FIXME: fix character image handling and sync with main page layout.
  return (
    <Stack direction="row" sx={{ gap: 3, height: "100%" }}>
      <Stack
        sx={{
          gap: 2,
          width: "100%",
          height: "calc(100vh - 60px)",
          mt: 3,
          position: "relative",
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
          borderRadius: 2,
          p: 2,
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
            Add Project
          </Button>
        </Stack>

        {loadingProjects && (
          <Typography component="p" sx={{ color: "text.secondary" }}>
            Loading projects...
          </Typography>
        )}

        {!loadingProjects && projects.length === 0 && (
          <Typography component="p" sx={{ color: "text.secondary" }}>
            No projects uploaded yet.
          </Typography>
        )}

        <Stack sx={{ gap: 3.5, width: "100%", overflow: "auto" }}>
          {projects.map((project) => {
            const id = project._id || project.id || project.name || "";

            return (
              <Paper
                key={id}
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 1.5,
                  width: "100%",
                }}
              >
                <Stack
                  direction="row"
                  sx={{ alignItems: "center", gap: 2, width: "100%" }}
                >
                  <Box
                    sx={{
                      width: 84,
                      height: 84,
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: "#bbb",
                      flexShrink: 0,
                    }}
                  >
                    {project.thumbnail && (
                      <img
                        src={project.thumbnail}
                        alt={project.name || "project"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Box>

                  <Stack sx={{ minWidth: 0, flex: 1, width: "100%" }}>
                    <Typography component="h4" sx={{ fontWeight: 700 }}>
                      {project.name}
                    </Typography>
                    <Typography
                      component="p"
                      sx={{
                        color: "text.secondary",
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        textTransform: "none",
                        width: "100%",
                      }}
                    >
                      {project.description}
                    </Typography>
                    <Typography
                      component="p"
                      sx={{ color: "text.secondary", fontSize: 13, mt: 0.5 }}
                    >
                      {`Characters: ${
                        Array.isArray(project.characters)
                          ? project.characters.length
                          : 0
                      }`}
                    </Typography>
                  </Stack>

                  <IconButton
                    aria-label="Edit project"
                    onClick={() => handleEditProject(project)}
                  >
                    <ModeEditOutlineOutlinedIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Delete project"
                    color="error"
                    onClick={() => handleDeleteProject(project)}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Stack>

      <Modal open={open} onClose={handleClose}>
        <Stack sx={style}>
          <Stack
            direction={"row"}
            sx={{
              gap: 2,
              border: (theme) => `1px solid ${theme.palette.primary.dark}`,
              borderRadius: 2,
              p: 1.5,
              height: "100%",
            }}
          >
            <Stack sx={{ alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  bgcolor: "#bbb",
                  borderRadius: 3,
                  overflow: "hidden",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {projectImage ? (
                  <img
                    src={projectImage}
                    alt="project"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <ImageOutlinedIcon sx={{ fontSize: 60, color: "grey.600" }} />
                )}
              </Box>
              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => fileInputRef.current?.click()}
              >
                {projectImage ? "Change Image" : "Upload Image"}
              </Button>
            </Stack>

            <Stack sx={{ width: "100%", gap: 1, overflow: "auto" }}>
              <Stack sx={{ gap: 3, height: "100%" }}>
                <TextField
                  variant="standard"
                  label="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  sx={{ width: 400 }}
                />
                <TextField
                  label="Project Description"
                  multiline
                  rows={4}
                  fullWidth
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />

                <Stack
                  sx={{
                    gap: 1.5,
                    height: "100%",
                    width: "100%",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 1,
                    pb: 0,
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography component="h3" sx={{ fontWeight: 700 }}>
                      Characters
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleAddCharacter}
                    >
                      Add Character
                    </Button>
                  </Stack>
                  {characters.length === 0 ? (
                    <Typography component="p" sx={{ color: "text.secondary" }}>
                      No characters added yet.
                    </Typography>
                  ) : (
                    <Stack
                      sx={{ gap: 1.5, maxHeight: 145, overflow: "auto", pr: 1 }}
                    >
                      {characters.map((character) => (
                        <Paper
                          key={character.key}
                          elevation={0}
                          sx={{
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            p: 1,
                          }}
                        >
                          <Stack
                            direction="row"
                            sx={{
                              gap: 1.5,
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 1.5,
                                overflow: "hidden",
                                bgcolor: "#bbb",
                                display: "grid",
                                placeItems: "center",
                                flexShrink: 0,
                              }}
                            >
                              {character.image ? (
                                <img
                                  src={character.image}
                                  alt={character.name || "character"}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <ImageOutlinedIcon sx={{ color: "grey.600" }} />
                              )}
                            </Box>
                            <Stack sx={{ flex: 1, minWidth: 0, gap: 1 }}>
                              <TextField
                                size="small"
                                label="Character Name"
                                value={character.name}
                                onChange={(event) =>
                                  handleCharacterNameChange(
                                    character.key,
                                    event.target.value
                                  )
                                }
                              />
                              <Button
                                component="label"
                                variant="outlined"
                                size="small"
                              >
                                {character.image
                                  ? "Change Image"
                                  : "Upload Image"}
                                <input
                                  hidden
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) =>
                                    handleCharacterImageChange(
                                      character.key,
                                      event
                                    )
                                  }
                                />
                              </Button>
                            </Stack>
                            <IconButton
                              color="error"
                              aria-label="Remove character"
                              onClick={() =>
                                handleRemoveCharacter(character.key)
                              }
                            >
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Stack>

              {formMessage && (
                <Typography
                  component="p"
                  sx={{
                    color: formMessageColor,
                    fontSize: 14,
                  }}
                >
                  {formMessage}
                </Typography>
              )}

              <Stack
                direction={"row"}
                sx={{
                  width: "100%",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitLabel}
                </Button>
                <Button
                  variant="outlined"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default Projects;
