import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import {
  deleteBannerById,
  fetchBanners,
  uploadBanner,
} from "../services/bannerApi";

const style = {
  direction: "ltr",
  height: "auto",
  maxHeight: "80vh",
  width: 380,
  position: "absolute",
  flexDirection: "row",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  gap: 2,
};

const Banner = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState("");
  const [banners, setBanners] = useState<
    {
      _id: string;
      title: string;
      poster: string;
    }[]
  >([]);
  const [selectedBanner, setSelectedBanner] = useState<{
    _id?: string;
    title: string;
    poster: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePreview = posterPreviewUrl || selectedBanner?.poster || "";

  console.log(banners);

  const handleOpen = () => {
    setOpen(true);
    setTitle("");
    setPoster(null);
    setSelectedBanner(null);
    setSubmitErrorMsg("");
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setPoster(null);
    setSelectedBanner(null);
    setSubmitErrorMsg("");
  };

  const handleSubmit = async () => {
    if (!poster) {
      setSubmitErrorMsg("Please select a poster image.");
      return;
    }

    setIsSubmitting(true);
    setSubmitErrorMsg("");

    try {
      const result = await uploadBanner({
        title: title.trim(),
        poster,
      });

      if (!result.ok) {
        setSubmitErrorMsg(result.message);
        return;
      }

      if (result.banner) {
        setBanners((currentBanners) => [result.banner, ...currentBanners]);
      }
      handleClose();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to upload banner."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (bannerId: string) => {
    setIsSubmitting(true);
    setSubmitErrorMsg("");

    try {
      const result = await deleteBannerById(bannerId);

      if (!result.ok) {
        setSubmitErrorMsg(result.message);
        return;
      }

      setBanners((currentBanners) =>
        currentBanners.filter((bannerItem) => bannerItem._id !== bannerId)
      );
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to delete banner."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    async function loadBanners() {
      setLoading(true);
      setErrorMsg("");

      try {
        const result = await fetchBanners({ signal: controller.signal });

        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);

        if (!result.ok) {
          setErrorMsg(result.message);
          return;
        }

        setBanners(result.banners);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load banner."
        );
      }
    }

    loadBanners();

    return () => controller.abort("Banner tab unmounted");
  }, []);

  useEffect(() => {
    if (!poster) {
      setPosterPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(poster);
    setPosterPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [poster]);

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <Stack
        sx={{
          position: "relative",
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
          borderRadius: 2,
          mt: 3,
          p: 2,
          height: "100%",
        }}
      >
        <Stack
          sx={{
            width: "100%",
            position: "absolute",
            top: -20,
            left: 0,
            justifyContent: "center",
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
            }}
          >
            Add Banner
          </Button>
        </Stack>

        <Stack
          sx={{
            width: "100%",
            height: "100%",
            pt: 4,
            alignItems: "center",
            //   justifyContent: "center",
          }}
        >
          {loading ? (
            <CircularProgress size={28} />
          ) : errorMsg ? (
            <Typography color="error" variant="body2">
              {errorMsg}
            </Typography>
          ) : banners.length > 0 ? (
            <Stack
              direction="row"
              sx={{ gap: 2, flexWrap: "wrap", justifyContent: "center" }}
            >
              {banners.map((bannerItem) => (
                <Stack
                  key={bannerItem._id}
                  sx={{
                    gap: 1.5,
                    alignItems: "center",
                    boxShadow: 3,
                    width: 250,
                    p: 1,
                    borderRadius: 2,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Stack
                    sx={{
                      gap: 1,
                      alignItems: "center",
                      width: "100%",
                      overflow: "hidden",
                      aspectRatio: "16 / 9",
                    }}
                  >
                    <img
                      src={bannerItem.poster}
                      alt={bannerItem.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 12,
                      }}
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{
                      gap: 1,
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        fontSize: 16,
                      }}
                    >
                      {bannerItem.title}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(bannerItem._id)}
                      disabled={isSubmitting}
                    >
                      <DeleteForeverOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary" variant="body2">
              No banner image uploaded yet.
            </Typography>
          )}
        </Stack>

        <Modal open={open} onClose={handleClose}>
          <Stack sx={style}>
            <Stack sx={{ width: "100%", gap: 2 }}>
              <Typography variant="h6">Add Banner</Typography>
              <TextField
                label="Title"
                variant="standard"
                fullWidth
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <Button
                component="label"
                variant={poster ? "contained" : "outlined"}
                color="primary"
                fullWidth
              >
                {poster ? poster.name : "Upload Poster"}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setPoster(event.target.files?.[0] ?? null);
                  }}
                />
              </Button>
              {activePreview ? (
                <img
                  src={activePreview}
                  alt="Banner poster preview"
                  style={{
                    width: "100%",
                    maxHeight: "180px",
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              ) : null}
              <Stack direction="row" sx={{ gap: 2, width: "100%" }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={isSubmitting || !title.trim() || !poster}
                >
                  {isSubmitting ? "Uploading..." : "Save Banner"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClose}
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
    </Stack>
  );
};

export default Banner;
