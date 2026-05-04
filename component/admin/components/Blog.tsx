import {
  Button,
  CircularProgress,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState, type ChangeEvent } from "react";
import { createBlog, fetchBlogs } from "../services/blogApi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const style = {
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
  p: 3,
  gap: 2,
};

type BlogRecord = {
  _id: string;
  title: string;
  subHeader?: string;
  content: string;
  textSections?: string[];
  image?: string[];
  videoUrl?: string;
};

const Blog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subHeader, setSubHeader] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
    setTitle("");
    setSubHeader("");
    setContent("");
    setImages([]);
    setImagePreviewUrls([]);
    setActiveSlideIndex(0);
    setSubmitErrorMsg("");
  };

  const handleClose = () => {
    setOpen(false);
    setSubHeader("");
    setTitle("");
    setContent("");
    setImages([]);
    setImagePreviewUrls([]);
    setActiveSlideIndex(0);
    setSubmitErrorMsg("");
  };

  const handleSubmit = async () => {
    const normalizedTitle = title.trim();
    const normalizedContent = content.trim();
    const normalizedSubHeader = subHeader.trim();
    const normalizedVideoUrl = videoUrl.trim();

    if (!normalizedTitle || !normalizedContent) {
      setSubmitErrorMsg("Title and content are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitErrorMsg("");

    try {
      const result = await createBlog({
        title: normalizedTitle,
        subHeader: normalizedSubHeader,
        videoUrl: normalizedVideoUrl,
        textSections: [normalizedContent],
        images,
      });

      if (!result.ok) {
        setSubmitErrorMsg(result.message);
        return;
      }

      if (result.blog) {
        setBlogs((currentBlogs) => [result.blog, ...currentBlogs]);
      }
      handleClose();
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error ? error.message : "Failed to create blog."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (imagePreviewUrls.length === 0) {
      return;
    }

    const indexToRemove = Math.min(
      activeSlideIndex,
      imagePreviewUrls.length - 1
    );

    setImages((currentImages) =>
      currentImages.filter((_image, index) => index !== indexToRemove)
    );
    setImagePreviewUrls((currentUrls) => {
      const urlToRemove = currentUrls[indexToRemove];
      if (urlToRemove) {
        URL.revokeObjectURL(urlToRemove);
      }

      const nextUrls = currentUrls.filter(
        (_previewUrl, index) => index !== indexToRemove
      );
      setActiveSlideIndex(
        nextUrls.length === 0 ? 0 : Math.min(indexToRemove, nextUrls.length - 1)
      );
      return nextUrls;
    });
  };

  const handleEdit = async () => {};

  const handleSelectImages = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    const existingKeys = new Set(
      images.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
    );
    const newUniqueFiles = selectedFiles.filter((file) => {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      return !existingKeys.has(key);
    });

    if (newUniqueFiles.length === 0) {
      event.target.value = "";
      return;
    }

    setImages((currentImages) => [...currentImages, ...newUniqueFiles]);
    setImagePreviewUrls((currentUrls) => [
      ...currentUrls,
      ...newUniqueFiles.map((file) => URL.createObjectURL(file)),
    ]);

    event.target.value = "";
  };

  useEffect(() => {
    const controller = new AbortController();

    async function loadBlogs() {
      setLoading(true);
      setErrorMsg("");

      try {
        const result = await fetchBlogs({ signal: controller.signal });

        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);

        if (!result.ok) {
          setErrorMsg(result.message);
          return;
        }

        setBlogs(result.blogs);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load blogs."
        );
      }
    }

    loadBlogs();

    return () => controller.abort("Blog tab unmounted");
  }, []);

  return (
    <Stack sx={{ width: "100%", height: "100%", position: "relative" }}>
      <Stack
        sx={{
          width: "100%",
          height: "100%",
          mt: 2,
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
            top: -5,
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
            onClick={handleOpenModal}
          >
            Add Blog
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
        >
          {loading ? (
            <Stack sx={{ width: "100%", alignItems: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Stack>
          ) : errorMsg ? (
            <Typography color="error" variant="body2">
              {errorMsg}
            </Typography>
          ) : blogs.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              No blogs yet.
            </Typography>
          ) : (
            <Stack sx={{ gap: 1.5 }}>
              {blogs.map((blog) => (
                <Stack
                  key={blog._id}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    gap: 0.75,
                    width: 500,
                    height: 250,
                    boxShadow: 3,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    title: {blog.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="secondary"
                    sx={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    subHeader: {blog.subHeader}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="info"
                    sx={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    link: {blog.videoUrl}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      p: 1,
                      borderRadius: 2,
                      whiteSpace: "pre-wrap",
                      width: "100%",
                      height: 115,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    {blog.content} aisdfjlkasjd;fkjas;dlkj;aslkd
                  </Typography>
                  {Array.isArray(blog.image) && blog.image.length > 0 ? (
                    <Typography variant="caption" color="error">
                      {blog.image.length} image(s)
                    </Typography>
                  ) : null}
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>

      <Modal open={open} onClose={handleClose}>
        <Stack sx={style}>
          <Stack sx={{ width: "100%", gap: 2, alignItems: "center" }}>
            <Typography variant="h6">Add Blog</Typography>
            <TextField
              label="Title"
              variant="standard"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
            />
            <TextField
              label="Sub Header"
              value={subHeader}
              multiline
              onChange={(event) => setSubHeader(event.target.value)}
              fullWidth
            />
            <TextField
              label="Content"
              multiline
              value={content}
              onChange={(event) => setContent(event.target.value)}
              fullWidth
            />
            <TextField
              label="Video URL"
              variant="standard"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              fullWidth
            />

            <Stack sx={{ gap: 2, width: "100%" }}>
              <Stack
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  border: (theme) => `1px solid ${theme.palette.primary.main}`,
                  borderRadius: 2,
                  overflow: "hidden",
                  "& .swiper-pagination-bullet": {
                    bgcolor: "grey.800",
                    opacity: 1,
                  },
                  "& .swiper-pagination-bullet-active": {
                    bgcolor: "primary.main",
                    width: "10px",
                    height: "10px",
                  },
                  "& .swiper-button-prev, & .swiper-button-next": {
                    color: "primary.main",
                  },
                  "& .swiper-button-prev::after, & .swiper-button-next::after":
                    {
                      fontSize: "20px",
                      fontWeight: 700,
                    },
                }}
              >
                {imagePreviewUrls.length > 0 ? (
                  <Swiper
                    modules={[Pagination, Navigation]}
                    navigation={true}
                    pagination={{ clickable: true }}
                    onSlideChange={(swiper) =>
                      setActiveSlideIndex(swiper.realIndex)
                    }
                    onSwiper={(swiper) => setActiveSlideIndex(swiper.realIndex)}
                    style={{ width: "100%", height: "100%" }}
                  >
                    {imagePreviewUrls.map((previewUrl, index) => (
                      <SwiperSlide
                        key={`${previewUrl}-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                        }}
                      >
                        <img
                          src={previewUrl}
                          alt={`Image ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <Stack
                    sx={{
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary" variant="body2">
                      No image selected
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Stack direction="row" sx={{ gap: 2, width: "100%" }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  component="label"
                >
                  Add Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleSelectImages}
                  />
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                  disabled={imagePreviewUrls.length === 0}
                >
                  Delete Image
                </Button>
              </Stack>
            </Stack>

            <Stack direction="row">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim() || !content.trim()}
              >
                {isSubmitting ? "Saving..." : "Add Blog"}
              </Button>
              <Button variant="outlined" color="primary" onClick={handleClose}>
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

export default Blog;
