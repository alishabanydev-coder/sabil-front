import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  ButtonGroup,
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
import type { Dayjs } from "dayjs";
import { fetchProjects } from "../services/projectsApi";
import DonationDateFields from "./DonationDateFields";

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

function getProjectId(project: ProjectRecord) {
  return project._id || project.id || "";
}

function getCurrencyMeta(code: string) {
  return CURRENCIES[code as CurrencyCode] ?? CURRENCIES.USD;
}

// FIXME: list order should't be managed my number, open modal to select list order
// FIXME: create modal for this Updates, FAQs, Sections <Each different modal>
// FIXME: add backend service for this, make it POST / GET / DELETE
// FIXME: add Edit Modal with Different UI and Tabs for Comments 
// FIXME: card or the project have more icon and menu that contain DELETE/EDIT/CHAT
// FIXME: manage the comments for each DonationProject and each BLOG/BREAKDOWN(updates)

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

const Donation = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [raisedAmount, setRaisedAmount] = useState("");
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currencyMeta = getCurrencyMeta(currency);

  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }

    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

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

  const reset = () => {
    setType("ongoing");
    setProjectId("");
    setShowOnDonationPage(true);
    setListOrder("");
    setOpen(false);
    setIsEditing(false);
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setGoalAmount("");
    setRaisedAmount("");
    setCurrency("USD");
    setStartDate(null);
    setEndDate(null);
    setImage(null);
  };

  const handleCancel = () => {
    reset();
  };

  const handleAddDonation = () => {
    setIsEditing(false);
    setOpen(true);
  };

  //FIXME: add tabs instead of long

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
            onClick={handleAddDonation}
          >
            Add Donation
          </Button>
        </Stack>

        <Stack
          sx={{
            width: "100%",
            height: "100%",
            pt: 6,
            px: 2,
            pb: 2,
            overflow: "auto",
          }}
        ></Stack>
      </Stack>

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
                        objectFit: "cover",
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
                      textTransform: "lowercase",
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
              <ButtonGroup
                color="primary"
                aria-label="sections-buttons-options"
                sx={{
                  width: "100%",
                }}
              >
                <Button className="add-button" variant="contained">
                  Add Sections
                </Button>
                <Button className="display-button">Display Sections</Button>
              </ButtonGroup>

              <ButtonGroup
                color="primary"
                aria-label="FAQ-buttons-options"
                sx={{
                  width: "100%",
                }}
              >
                <Button className="add-button" variant="contained">
                  Add FAQs
                </Button>
                <Button className="display-button">Display FAQs</Button>
              </ButtonGroup>

              <ButtonGroup
                color="primary"
                aria-label="Updates-buttons-options"
                sx={{
                  width: "100%",
                }}
              >
                <Button className="add-button" variant="contained">
                  Add Updates
                </Button>
                <Button className="display-button">Display Updates</Button>
              </ButtonGroup>
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
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default Donation;
