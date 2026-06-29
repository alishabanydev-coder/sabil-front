import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
  Switch,
  SwitchProps,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { fetchProjects } from "../../services/projectsApi";
import {
  createDonationProject,
  fetchDonationProject,
  revalidateDonationProjectsPublicCache,
  updateDonationProject,
} from "../../services/donationApi";
import { fetchBlogs } from "../../services/blogApi";
import { fetchBreakdowns } from "../../services/breakdownApi";
import DonationDateFields from "../DonationDateFields";
import AddSection from "./AddSection";
import AddUpdate from "./AddUpdate";
import AddFAQ from "./AddFAQ";
import {
  hydrateUpdateRefs,
  mapFaqFromApi,
  mapSectionsFromApi,
  mapUpdateRefsToPayload,
  type FaqDraft,
  type SectionDraft,
  type UpdateDraft,
} from "./donationDrafts";

const CURRENCIES = {
  USD: { symbol: "$", label: "USD" },
  INR: { symbol: "₹", label: "INR" },
} as const;

type CurrencyCode = keyof typeof CURRENCIES;

type ProjectRecord = {
  _id?: string;
  id?: string;
  name?: string;
};

type DonationStatus = "ongoing" | "finished" | "paused";

type ExistingDonationProject = {
  _id: string;
  listOrder?: number | null;
};

type DonationModalProps = {
  open: boolean;
  isEditing: boolean;
  editingProjectId: string | null;
  existingProjects?: ExistingDonationProject[];
  onClose: () => void;
  onSaved: () => void;
};

function getProjectId(project: ProjectRecord) {
  return project._id || project.id || "";
}

function getCurrencyMeta(code: string) {
  return CURRENCIES[code as CurrencyCode] ?? CURRENCIES.USD;
}

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: theme.palette.primary.main,
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));

type SecondaryModal = "section" | "update" | "faq" | null;

const DonationModal = ({
  open,
  isEditing,
  editingProjectId,
  existingProjects = [],
  onClose,
  onSaved,
}: DonationModalProps) => {
  const [secondaryModal, setSecondaryModal] = useState<SecondaryModal>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [existingPoster, setExistingPoster] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [raisedAmount, setRaisedAmount] = useState("");
  const [donorCount, setDonorCount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");
  const [type, setType] = useState<DonationStatus>("ongoing");
  const [showOnDonationPage, setShowOnDonationPage] = useState(true);
  const [listOrder, setListOrder] = useState("");
  const [sections, setSections] = useState<SectionDraft[]>([]);
  const [faqs, setFaqs] = useState<FaqDraft[]>([]);
  const [updates, setUpdates] = useState<UpdateDraft[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currencyMeta = getCurrencyMeta(currency);

  const trimmedListOrder = listOrder.trim();
  const isListOrderDuplicate =
    trimmedListOrder !== "" &&
    existingProjects.some(
      (project) =>
        project._id !== editingProjectId &&
        project.listOrder !== null &&
        project.listOrder !== undefined &&
        Number(project.listOrder) === Number(trimmedListOrder)
    );

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }

    setImagePreview(existingPoster);
  }, [image, existingPoster]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const controller = new AbortController();

    const loadProject = async () => {
      if (!isEditing || !editingProjectId) {
        resetForm();
        return;
      }

      setIsLoadingProject(true);
      setSubmitError("");

      try {
        const [projectResult, blogResult, breakdownResult] = await Promise.all([
          fetchDonationProject(editingProjectId, { signal: controller.signal }),
          fetchBlogs({ signal: controller.signal }),
          fetchBreakdowns({ signal: controller.signal }),
        ]);

        if (controller.signal.aborted) {
          return;
        }

        if (!projectResult.ok || !projectResult.donationProject) {
          setSubmitError(
            projectResult.message || "Failed to load donation project."
          );
          return;
        }

        const project = projectResult.donationProject;

        setTitle(project.title ?? "");
        setDescription(project.shortDescription ?? "");
        setExistingPoster(project.poster ?? null);
        setImage(null);
        setVideoUrl(project.videoUrl ?? "");
        setGoalAmount(String(project.goalAmount ?? ""));
        setRaisedAmount(String(project.raisedAmount ?? 0));
        setDonorCount(String(project.donorCount ?? 0));
        setCurrency(project.currency === "INR" ? "INR" : "USD");
        setStartDate(project.startDate ? dayjs(project.startDate) : null);
        setEndDate(project.endDate ? dayjs(project.endDate) : null);
        setProjectId(project.projectId ? String(project.projectId) : "");
        setType(project.status ?? "ongoing");
        setShowOnDonationPage(Boolean(project.showOnDonationPage));
        setListOrder(
          project.listOrder !== null && project.listOrder !== undefined
            ? String(project.listOrder)
            : ""
        );
        setSections(mapSectionsFromApi(project.sections));
        setFaqs(mapFaqFromApi(project.faq));
        setUpdates(
          hydrateUpdateRefs(
            project.updateRefs,
            blogResult.ok ? blogResult.blogs : [],
            breakdownResult.ok ? breakdownResult.breakdowns : []
          )
        );
      } catch (error) {
        if (!controller.signal.aborted) {
          setSubmitError(
            error instanceof Error
              ? error.message
              : "Failed to load donation project."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingProject(false);
        }
      }
    };

    void loadProject();

    return () => controller.abort();
  }, [open, isEditing, editingProjectId]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      setProjectsLoading(true);
      setProjectsError("");

      try {
        const result = await fetchProjects({ signal: controller.signal });

        if (controller.signal.aborted) {
          return;
        }

        if (!result.ok) {
          setProjects([]);
          setProjectsError(result.message);
          return;
        }

        setProjects(result.projects);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setProjects([]);
        setProjectsError(
          error instanceof Error ? error.message : "Failed to load projects."
        );
      } finally {
        if (!controller.signal.aborted) {
          setProjectsLoading(false);
        }
      }
    }

    void loadProjects();

    return () => controller.abort();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImage(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setExistingPoster(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTypeChange = (event: SelectChangeEvent<DonationStatus>) => {
    setType(event.target.value as DonationStatus);
  };

  const handleShowOnDonationPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowOnDonationPage(event.target.checked);
  };

  const handleListOrderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;

    if (value === "") {
      setListOrder("");
      return;
    }

    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 1) {
      setListOrder(String(parsed));
    }
  };

  const handleDonorCountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;

    if (value === "") {
      setDonorCount("");
      return;
    }

    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 0) {
      setDonorCount(String(parsed));
    }
  };

  const resetForm = () => {
    setType("ongoing");
    setProjectId("");
    setShowOnDonationPage(true);
    setListOrder("");
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setGoalAmount("");
    setRaisedAmount("");
    setDonorCount("");
    setCurrency("USD");
    setStartDate(null);
    setEndDate(null);
    setImage(null);
    setExistingPoster(null);
    setSections([]);
    setFaqs([]);
    setUpdates([]);
    setSubmitError("");
    setSecondaryModal(null);
  };

  const closeSecondaryModal = () => setSecondaryModal(null);

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (isSubmitting || isLoadingProject) {
      return;
    }

    if (!title.trim()) {
      setSubmitError("Title is required.");
      return;
    }

    if (!goalAmount.trim() || Number.isNaN(Number(goalAmount))) {
      setSubmitError("Goal amount is required.");
      return;
    }

    if (!startDate) {
      setSubmitError("Start date is required.");
      return;
    }

    if (!image && !existingPoster) {
      setSubmitError("Poster image is required.");
      return;
    }

    if (isListOrderDuplicate) {
      setSubmitError(
        `listOrder ${trimmedListOrder} is already used by another project. Pick a different order.`
      );
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        shortDescription: description.trim(),
        poster: image ?? undefined,
        existingPoster: existingPoster ?? undefined,
        videoUrl: videoUrl.trim(),
        goalAmount: Number(goalAmount),
        raisedAmount: raisedAmount.trim() ? Number(raisedAmount) : 0,
        donorCount: donorCount.trim() ? Number(donorCount) : 0,
        currency,
        status: type,
        startDate: startDate.toISOString(),
        endDate: endDate ? endDate.toISOString() : "",
        projectId,
        showOnDonationPage,
        listOrder: listOrder.trim() ? Number(listOrder) : "",
        sections,
        faq: faqs,
        updateRefs: mapUpdateRefsToPayload(updates),
      };

      const result =
        isEditing && editingProjectId
          ? await updateDonationProject(editingProjectId, payload)
          : await createDonationProject(payload);

      if (!result.ok) {
        setSubmitError(result.message || "Failed to save donation project.");
        return;
      }

      await revalidateDonationProjectsPublicCache();

      resetForm();
      onSaved();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleCancel}>
        <Stack
          sx={{
            direction: "ltr",
            width: 600,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            overflow: "auto",
            maxHeight: "94vh",
            p: 2,
          }}
        >
          <Stack sx={{ gap: 2.5, alignItems: "center", direction: "ltr" }}>
            <Typography variant="h6">
              {isEditing ? "Edit Donation" : "Add Donation"}
            </Typography>
            <TextField
              label="Title"
              variant="standard"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              variant="outlined"
              multiline
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              fullWidth
            />

            <Stack
              sx={{
                width: "100%",
                gap: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                p: 1,
              }}
            >
              <Box
                onClick={() => {
                  if (!imagePreview) {
                    fileInputRef.current?.click();
                  }
                }}
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  borderRadius: 2,
                  border: (theme) => `2px dashed ${theme.palette.primary.main}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  cursor: imagePreview ? "default" : "pointer",
                  bgcolor: "grey.50",
                }}
              >
                {imagePreview ? (
                  <>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Donation poster preview"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveImage();
                      }}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "background.paper",
                        boxShadow: 1,
                        "&:hover": { bgcolor: "grey.200" },
                      }}
                      size="small"
                      aria-label="Remove poster"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "primary.main",
                      textTransform: "uppercase",
                      userSelect: "none",
                      fontSize: 24,
                    }}
                  >
                    add poster
                  </Typography>
                )}
              </Box>
              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <TextField
                label="Video URL"
                variant="standard"
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                fullWidth
              />
            </Stack>

            <Stack
              sx={{
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                gap: 3,
              }}
            >
              <TextField
                label="Goal Amount"
                variant="standard"
                type="number"
                value={goalAmount}
                onChange={(event) => setGoalAmount(event.target.value)}
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "any",
                  },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 18,
                            color: "primary.main",
                            minWidth: 16,
                            textAlign: "center",
                          }}
                        >
                          {currencyMeta.symbol}
                        </Typography>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Raised Amount"
                variant="standard"
                type="number"
                value={raisedAmount}
                onChange={(event) => setRaisedAmount(event.target.value)}
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "any",
                  },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 18,
                            color: "primary.main",
                            minWidth: 16,
                            textAlign: "center",
                          }}
                        >
                          {currencyMeta.symbol}
                        </Typography>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Donors"
                variant="standard"
                type="number"
                value={donorCount}
                onChange={handleDonorCountChange}
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1,
                  },
                }}
              />
              <TextField
                label="Currency"
                variant="standard"
                select
                value={currency}
                onChange={(event) =>
                  setCurrency(event.target.value as CurrencyCode)
                }
                sx={{ minWidth: 110 }}
                slotProps={{
                  select: {
                    renderValue: (selected) => {
                      const meta = getCurrencyMeta(String(selected));
                      return (
                        <Stack
                          sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 0.75,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: 18,
                              color: "primary.main",
                            }}
                          >
                            {meta.symbol}
                          </Typography>
                          <Typography sx={{ fontSize: 14 }}>
                            {meta.label}
                          </Typography>
                        </Stack>
                      );
                    },
                  },
                }}
              >
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <MenuItem key={code} value={code}>
                    <Stack
                      sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: 18,
                          color: "primary.main",
                          minWidth: 16,
                          textAlign: "center",
                        }}
                      >
                        {CURRENCIES[code].symbol}
                      </Typography>
                      <Typography>{CURRENCIES[code].label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <DonationDateFields
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />

            <Stack
              sx={{
                gap: 2,
                width: "100%",
                pt: 2,
                "& .add-button": {
                  fontSize: 14,
                  width: "100%",
                },
                "& .display-button": {
                  fontSize: 12,
                  width: "100%",
                },
              }}
            >
              <Button
                className="add-button"
                variant="contained"
                onClick={() => setSecondaryModal("section")}
              >
                Add Sections
              </Button>

              <Button
                className="add-button"
                variant="contained"
                onClick={() => setSecondaryModal("faq")}
              >
                Add FAQs
              </Button>

              <Button
                className="add-button"
                variant="contained"
                onClick={() => setSecondaryModal("update")}
              >
                Add Updates
              </Button>
            </Stack>

            <Stack
              sx={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 2,
                pt: 1,
              }}
            >
              <FormControl sx={{ width: "100%" }} size="small">
                <InputLabel id="select-status-for-project">Status</InputLabel>
                <Select
                  labelId="select-status-for-project"
                  id="select-status-for-project"
                  value={type}
                  label="Status"
                  onChange={handleTypeChange}
                >
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="finished">Finished</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ width: "100%" }} size="small">
                <InputLabel id="select-project-for-donation">
                  Project
                </InputLabel>
                <Select
                  labelId="select-project-for-donation"
                  id="select-project-for-donation"
                  value={projectId}
                  label="Project"
                  onChange={(event) => setProjectId(event.target.value)}
                  disabled={projectsLoading}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em>None</em>;
                    }

                    return (
                      projects.find(
                        (project) => getProjectId(project) === selected
                      )?.name || "Unknown project"
                    );
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {projectsLoading ? (
                    <MenuItem disabled>Loading projects...</MenuItem>
                  ) : projects.length === 0 ? (
                    <MenuItem disabled>
                      {projectsError || "No projects uploaded yet"}
                    </MenuItem>
                  ) : (
                    projects.map((project) => {
                      const id = getProjectId(project);
                      if (!id) {
                        return null;
                      }

                      return (
                        <MenuItem key={id} value={id}>
                          {project.name || "Untitled project"}
                        </MenuItem>
                      );
                    })
                  )}
                </Select>
              </FormControl>
            </Stack>
            <Stack
              sx={{
                direction: "ltr",
                flexDirection: "row",
                gap: 2,
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <TextField
                label="listOrder"
                type="number"
                value={listOrder}
                onChange={handleListOrderChange}
                error={isListOrderDuplicate}
                helperText={
                  isListOrderDuplicate
                    ? "This order is already used by another project."
                    : " "
                }
                sx={{ width: 250 }}
                slotProps={{
                  htmlInput: {
                    min: 1,
                    step: 1,
                  },
                }}
              />
              
              <FormControlLabel
                control={
                  <IOSSwitch
                    sx={{ m: 1 }}
                    checked={showOnDonationPage}
                    onChange={handleShowOnDonationPageChange}
                  />
                }
                label="showOnDonationPage"
              />
            </Stack>

            {submitError ? (
              <Typography
                variant="body2"
                sx={{ color: "error.main", width: "100%" }}
              >
                {submitError}
              </Typography>
            ) : null}

            {isLoadingProject ? (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", width: "100%" }}
              >
                Loading donation project...
              </Typography>
            ) : null}

            <Divider flexItem sx={{ mt: -3, mb: -2 }} />

            <Stack
              sx={{
                direction: "ltr",
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 1,
                width: "100%",
                pt: 1,
              }}
            >
              <Button variant="outlined" color="primary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting || isLoadingProject || isListOrderDuplicate}
                onClick={() => void handleSubmit()}
              >
                {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Modal>

      <AddSection
        open={secondaryModal === "section"}
        onClose={closeSecondaryModal}
        sections={sections}
        onSectionsChange={setSections}
      />

      <AddUpdate
        open={secondaryModal === "update"}
        onClose={closeSecondaryModal}
        updates={updates}
        onUpdatesChange={setUpdates}
        projectId={projectId}
      />

      <AddFAQ
        open={secondaryModal === "faq"}
        onClose={closeSecondaryModal}
        faqs={faqs}
        onFaqsChange={setFaqs}
      />
    </>
  );
};

export default DonationModal;
