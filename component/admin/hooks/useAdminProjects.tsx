import type {
  AdminProjectCharacterFormRecord,
  AdminProjectRecord,
} from "@/types/admin";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "../services/projectsApi";

function createCharacterDraft(): AdminProjectCharacterFormRecord {
  return {
    key: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    name: "",
    image: "",
    imageFile: null,
  };
}

export const useAdminProjects = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [projectImage, setProjectImage] = useState("");
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [characters, setCharacters] = useState<AdminProjectCharacterFormRecord[]>(
    []
  );
  const [projects, setProjects] = useState<AdminProjectRecord[]>([]);
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

  const resetForm = useCallback(() => {
    setOpen(false);
    setProjectImage("");
    setProjectImageFile(null);
    setProjectName("");
    setProjectDescription("");
    setCharacters([]);
    setEditingProjectId("");
    setFormError("");
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

  const handleSubmit = useCallback(async () => {
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
  }, [
    characters,
    editingProjectId,
    loadProjects,
    projectDescription,
    projectImageFile,
    projectName,
    resetForm,
    submitting,
  ]);

  const handleEditProject = useCallback((project: AdminProjectRecord) => {
    setOpen(true);
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
  }, []);

  const handleCharacterNameChange = useCallback((key: string, value: string) => {
    setCharacters((prevCharacters) =>
      prevCharacters.map((character) =>
        character.key === key ? { ...character, name: value } : character
      )
    );
  }, []);

  const handleCharacterImageChange = useCallback(
    (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

  const handleRemoveCharacter = useCallback((key: string) => {
    setCharacters((prevCharacters) =>
      prevCharacters.filter((character) => character.key !== key)
    );
  }, []);

  const handleAddCharacter = useCallback(() => {
    setCharacters((prevCharacters) => [...prevCharacters, createCharacterDraft()]);
  }, []);

  const handleDeleteProject = useCallback(
    async (project: AdminProjectRecord) => {
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
    },
    [editingProjectId, resetForm]
  );

  const submitLabel = useMemo(() => {
    if (submitting) {
      return "Saving...";
    }

    return editingProjectId ? "Update Project" : "Upload Project";
  }, [editingProjectId, submitting]);

  const formMessage = formError || formSuccess;
  const formMessageColor = formError ? "error.main" : "success.main";

  return {
    characters,
    editingProjectId,
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
  };
};
