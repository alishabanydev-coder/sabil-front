import type { AdminBlogRecord } from "@/types/admin";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import {
  createBlog,
  deleteBlog,
  fetchBlogs,
  updateBlog,
} from "../services/blogApi";
import {
  notifyAdminError,
  notifyAdminSuccess,
} from "../snackbar/notifyAdmin";

export const useAdminBlog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subHeader, setSubHeader] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState<AdminBlogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBlog, setEditingBlog] = useState<AdminBlogRecord | null>(null);

  const modalImageUrls = [...existingImageUrls, ...imagePreviewUrls];

  const handleOpenModal = useCallback(() => {
    setOpen(true);
    setEditingBlog(null);
    setTitle("");
    setSubHeader("");
    setVideoUrl("");
    setContent("");
    setImages([]);
    setExistingImageUrls([]);
    setImagePreviewUrls([]);
    setActiveSlideIndex(0);
    setSubmitErrorMsg("");
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditingBlog(null);
    setSubHeader("");
    setTitle("");
    setVideoUrl("");
    setContent("");
    setImages([]);
    setExistingImageUrls([]);
    setImagePreviewUrls([]);
    setActiveSlideIndex(0);
    setSubmitErrorMsg("");
  }, []);

  const handleSubmit = useCallback(async () => {
    const normalizedTitle = title.trim();
    const normalizedContent = content.trim();
    const normalizedSubHeader = subHeader.trim();
    const normalizedVideoUrl = videoUrl.trim();

    if (!normalizedTitle || !normalizedContent) {
      const message = "Title and content are required.";
      setSubmitErrorMsg(message);
      notifyAdminError(message);
      return;
    }

    setIsSubmitting(true);
    setSubmitErrorMsg("");

    try {
      const result = editingBlog
        ? await updateBlog(editingBlog._id, {
            title: normalizedTitle,
            subHeader: normalizedSubHeader,
            videoUrl: normalizedVideoUrl,
            content: normalizedContent,
            images,
            keepImages: existingImageUrls,
          })
        : await createBlog({
            title: normalizedTitle,
            subHeader: normalizedSubHeader,
            videoUrl: normalizedVideoUrl,
            content: normalizedContent,
            images,
          });

      if (!result.ok) {
        const message =
          result.message ||
          (editingBlog ? "Failed to update blog." : "Failed to create blog.");
        setSubmitErrorMsg(message);
        notifyAdminError(message);
        return;
      }

      if (result.blog) {
        if (editingBlog) {
          setBlogs((currentBlogs) =>
            currentBlogs.map((blogItem) =>
              blogItem._id === editingBlog._id ? result.blog : blogItem
            )
          );
        } else {
          setBlogs((currentBlogs) => [result.blog, ...currentBlogs]);
        }
      }
      notifyAdminSuccess(editingBlog ? "Blog updated." : "Blog created.");
      handleClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : editingBlog
            ? "Failed to update blog."
            : "Failed to create blog.";
      setSubmitErrorMsg(message);
      notifyAdminError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    content,
    editingBlog,
    existingImageUrls,
    handleClose,
    images,
    subHeader,
    title,
    videoUrl,
  ]);

  const handleDeleteImage = useCallback(() => {
    const totalImageUrls = [...existingImageUrls, ...imagePreviewUrls];
    if (totalImageUrls.length === 0) {
      return;
    }

    const indexToRemove = Math.min(activeSlideIndex, totalImageUrls.length - 1);

    if (indexToRemove < existingImageUrls.length) {
      setExistingImageUrls((currentUrls) =>
        currentUrls.filter((_previewUrl, index) => index !== indexToRemove)
      );
    } else {
      const newImageIndex = indexToRemove - existingImageUrls.length;
      setImages((currentImages) =>
        currentImages.filter((_image, index) => index !== newImageIndex)
      );
      setImagePreviewUrls((currentUrls) => {
        const urlToRemove = currentUrls[newImageIndex];
        if (urlToRemove?.startsWith("blob:")) {
          URL.revokeObjectURL(urlToRemove);
        }

        return currentUrls.filter(
          (_previewUrl, index) => index !== newImageIndex
        );
      });
    }

    const nextTotalCount = totalImageUrls.length - 1;
    setActiveSlideIndex(
      nextTotalCount === 0 ? 0 : Math.min(indexToRemove, nextTotalCount - 1)
    );
  }, [activeSlideIndex, existingImageUrls, imagePreviewUrls]);

  const handleDeleteBlog = useCallback(
    async (blog: AdminBlogRecord) => {
      if (isSubmitting) {
        return;
      }

      const shouldDelete = window.confirm(`Delete blog "${blog.title}"?`);
      if (!shouldDelete) {
        return;
      }

      try {
        const result = await deleteBlog(blog._id);

        if (!result.ok) {
          const message = result.message || "Failed to delete blog.";
          setErrorMsg(message);
          notifyAdminError(message);
          return;
        }

        setBlogs((currentBlogs) =>
          currentBlogs.filter((blogItem) => blogItem._id !== blog._id)
        );
        notifyAdminSuccess("Blog deleted.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete blog.";
        setErrorMsg(message);
        notifyAdminError(message);
      }
    },
    [isSubmitting]
  );

  const handleEdit = useCallback((blog: AdminBlogRecord) => {
    setEditingBlog(blog);
    setOpen(true);
    setTitle(blog.title || "");
    setSubHeader(blog.subHeader || "");
    setVideoUrl(blog.videoUrl || "");
    setContent(blog.content || "");
    setImages([]);
    setExistingImageUrls(Array.isArray(blog.image) ? blog.image : []);
    setImagePreviewUrls([]);
    setActiveSlideIndex(0);
    setSubmitErrorMsg("");
  }, []);

  const handleSelectImages = useCallback((event: ChangeEvent<HTMLInputElement>) => {
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
  }, [images]);

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
          notifyAdminError(result.message || "Failed to load blogs.");
          return;
        }

        setBlogs(result.blogs);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        const message =
          error instanceof Error ? error.message : "Failed to load blogs.";
        setErrorMsg(message);
        notifyAdminError(message);
      }
    }

    loadBlogs();

    return () => controller.abort("Blog tab unmounted");
  }, []);

  const isSubmitDisabled = isSubmitting || !title.trim() || !content.trim();

  return {
    activeSlideIndex,
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
  };
};
