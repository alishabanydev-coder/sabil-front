import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { useAdminBlog } from "../hooks/useAdminBlog";

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

const Blog = () => {
  const {
    blogs,
    content,
    editingBlog,
    errorMsg,
    handleClose,
    handleDeleteBlog,
    handleDeleteImage,
    handleEdit,
    handleOpenModal,
    handleSelectImages,
    handleSubmit,
    isSubmitDisabled,
    isSubmitting,
    loading,
    modalImageUrls,
    open,
    setActiveSlideIndex,
    setContent,
    setSubHeader,
    setTitle,
    setVideoUrl,
    subHeader,
    submitErrorMsg,
    title,
    videoUrl,
  } = useAdminBlog();

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
            onClick={handleOpenModal}
          >
            Add Blog
          </Button>
        </Stack>

        <Stack
          sx={{
            width: "100%",
            height: "100%",
            pt: 4,
            px: 2,
            pb: 2,
            overflow: "hidden",
            overflowX: "clip",
            overflowY: "auto",
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
            <Stack
              direction="row"
              //  sx={{ gap: 1.5, flexWrap: "wrap" }}
              sx={{
                display: "grid",
                gap: { xs: 2, md: 5 },
                gridTemplateColumns: "repeat(auto-fill, minmax(400px, 400px))",
                justifyContent: "center",
                width: "100%",
                px: 2,
                pb: 2,
              }}
            >
              {blogs.map((blog) => (
                <Stack
                  key={blog._id}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    gap: 0.75,
                    width: 400,
                    height: 250,
                    boxShadow: 3,
                    position: "relative",
                    "&:hover": {
                      boxShadow: 6,
                      cursor: "pointer",
                    },
                  }}
                >
                  <Stack
                    direction={"row"}
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      right: 10,
                      zIndex: 1000,
                    }}
                  >
                    <IconButton
                      aria-label="Edit blog"
                      size="small"
                      onClick={() => handleEdit(blog)}
                    >
                      <ModeEditOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="Delete blog"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteBlog(blog)}
                    >
                      <DeleteOutlineOutlinedIcon
                        fontSize="small"
                        color="error"
                      />
                    </IconButton>
                  </Stack>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    title: {""}
                    {blog.title}
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
                    <b>subHeader:</b> {""}
                    {blog.subHeader}
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
                    <b>link:</b> {""} {blog.videoUrl}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      height: 115,
                      pt: 1,
                      pb: 1,
                      px: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 5,
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {blog.content}
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
            <Typography variant="h6">
              {editingBlog ? "Edit Blog" : "Add Blog"}
            </Typography>
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
                {modalImageUrls.length > 0 ? (
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
                    {modalImageUrls.map((previewUrl, index) => (
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
                            objectFit: "contain",
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
                  onClick={handleDeleteImage}
                  disabled={modalImageUrls.length === 0}
                >
                  Delete Image
                </Button>
              </Stack>
            </Stack>

            <Stack direction="row" sx={{ width: "100%" }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              >
                {isSubmitting
                  ? "Saving..."
                  : editingBlog
                  ? "Save Changes"
                  : "Add Blog"}
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
