import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "../services/projectsApi";

type ProjectRecord = {
  _id?: string;
  id?: string;
  name?: string;
  thumbnail?: string;
  description?: string;
  characters?: Array<{
    name?: string;
    image?: string;
  }>;
};

type CharacterFormRecord = {
  key: string;
  name: string;
  image: string;
  imageFile: File | null;
};

const createCharacterDraft = (): CharacterFormRecord => ({
  key: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
  name: "",
  image: "",
  imageFile: null,
});

const Projects = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projectImage, setProjectImage] = useState("");
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [characters, setCharacters] = useState<CharacterFormRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const loadProjects = useCallback(async () => {
    setLoadingProjects(true);
    const result = await fetchProjects();
    setLoadingProjects(false);

    if (result.ok) {
      setProjects(result.projects);
      return;
    }

    setFormError(result.message);
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const resetForm = () => {
    setProjectImage("");
    setProjectImageFile(null);
    setProjectName("");
    setProjectDescription("");
    setCharacters([]);
    setEditingProjectId("");
    setFormError("");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setProjectImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setProjectImage(typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    const name = projectName.trim();
    const description = projectDescription.trim();
    const normalizedCharacters = characters
      .map((character) => ({
        name: character.name.trim(),
        image: character.image,
        imageFile: character.imageFile,
      }))
      .filter(
        (character) => character.name || character.image || character.imageFile
      );

    setFormError("");
    setFormSuccess("");

    const isCreate = !editingProjectId;
    if (!name || !description || (isCreate && !projectImageFile)) {
      setFormError("Project name, image, and description are required.");
      return;
    }

    const hasInvalidCharacter = normalizedCharacters.some(
      (character) =>
        !character.name || (!character.image && !character.imageFile)
    );

    if (hasInvalidCharacter) {
      setFormError("Each character must include both name and image.");
      return;
    }

    setSubmitting(true);
    const payload = {
      name,
      description,
      ...(projectImageFile ? { thumbnail: projectImageFile } : {}),
      characters: normalizedCharacters,
    };
    const result = editingProjectId
      ? await updateProject(editingProjectId, payload)
      : await createProject(payload);
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    setFormSuccess(
      editingProjectId
        ? "Project updated successfully."
        : "Project uploaded successfully."
    );
    resetForm();
    await loadProjects();
  };

  const handleEditProject = (project: ProjectRecord) => {
    setFormError("");
    setFormSuccess("");
    setEditingProjectId(project._id || project.id || "");
    setProjectName(project.name || "");
    setProjectImage(project.thumbnail || "");
    setProjectImageFile(null);
    setProjectDescription(project.description || "");
    setCharacters(
      Array.isArray(project.characters)
        ? project.characters.map((character) => ({
            key: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
            name: character.name || "",
            image: character.image || "",
            imageFile: null,
          }))
        : []
    );
  };

  const handleCharacterNameChange = (key: string, value: string) => {
    setCharacters((prevCharacters) =>
      prevCharacters.map((character) =>
        character.key === key ? { ...character, name: value } : character
      )
    );
  };

  const handleCharacterImageChange = (
    key: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCharacters((prevCharacters) =>
        prevCharacters.map((character) =>
          character.key === key
            ? {
                ...character,
                image: typeof reader.result === "string" ? reader.result : "",
                imageFile: file,
              }
            : character
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCharacter = (key: string) => {
    setCharacters((prevCharacters) =>
      prevCharacters.filter((character) => character.key !== key)
    );
  };

  const handleDeleteProject = async (project: ProjectRecord) => {
    const id = project._id || project.id;

    if (!id) {
      setFormError("Project id is missing.");
      return;
    }

    const ok = window.confirm(`Delete project "${project.name || id}"?`);
    if (!ok) {
      return;
    }

    setFormError("");
    setFormSuccess("");
    const result = await deleteProject(id);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    setProjects((prev) => prev.filter((item) => (item._id || item.id) !== id));
    setFormSuccess("Project deleted successfully.");

    if (editingProjectId === id) {
      resetForm();
    }
  };
  //FIXME: fix this Charecter Image in a good way and send it and get it in the main page layout
  return (
    <Stack direction="row" sx={{ gap: 3, height: "100%" }}>
      <Stack sx={{ gap: 0.5, width: "60%", height: "100%" }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography component="h2" sx={{ fontSize: 22, fontWeight: 700 }}>
            Projects
          </Typography>
        </Stack>

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

          <Stack sx={{ width: "100%", gap: 1, overflow: "auto"}}>
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
                  pb: 0
                }}
              >
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                  <Typography component="h3" sx={{ fontWeight: 700 }}>
                    Characters
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      setCharacters((prevCharacters) => [
                        ...prevCharacters,
                        createCharacterDraft(),
                      ])
                    }
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
                          sx={{ gap: 1.5, alignItems: "center", width: "100%" }}
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
                            onClick={() => handleRemoveCharacter(character.key)}
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

            {(formError || formSuccess) && (
              <Typography
                component="p"
                sx={{
                  color: formError ? "error.main" : "success.main",
                  fontSize: 14,
                }}
              >
                {formError || formSuccess}
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
                {submitting
                  ? "Saving..."
                  : editingProjectId
                    ? "Update Project"
                    : "Upload Project"}
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
      <Stack sx={{ gap: 2, width: "40%", height: "100%", overflow: "auto" }}>
        <Typography component="h3" sx={{ fontSize: 18, fontWeight: 700 }}>
          Uploaded Projects
        </Typography>

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

        <Stack sx={{ gap: 3.5, width: "100%" }}>
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
                      {`Characters: ${Array.isArray(project.characters) ? project.characters.length : 0}`}
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
    </Stack>
  );
};

export default Projects;
