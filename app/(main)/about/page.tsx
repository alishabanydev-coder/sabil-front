import { Box, Stack, Typography } from "@mui/material";
import { fetchPublicAboutUs } from "@/component/admin/services/aboutUsApi";

function getYouTubeEmbedUrl(videoUrl: string) {
  if (!videoUrl) {
    return "";
  }

  try {
    const parsedUrl = new URL(videoUrl);
    const host = parsedUrl.hostname.toLowerCase();

    if (host.includes("youtu.be")) {
      const id = parsedUrl.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (host.includes("youtube.com")) {
      const id = parsedUrl.searchParams.get("v")?.trim();
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
  } catch {
    return "";
  }

  return "";
}

export default async function AboutPage() {
  const aboutUsResult = await fetchPublicAboutUs();
  const aboutUs = aboutUsResult.ok ? aboutUsResult.aboutUs : null;

  const title =
    typeof aboutUs?.title === "string" && aboutUs.title.trim()
      ? aboutUs.title.trim()
      : "About Us";
  const message =
    typeof aboutUs?.message === "string" && aboutUs.message.trim()
      ? aboutUs.message.trim()
      : "Our About Us content will be available soon.";
  const embedUrl = getYouTubeEmbedUrl(
    typeof aboutUs?.videoUrl === "string" ? aboutUs.videoUrl.trim() : ""
  );

  return (
    <Stack
      sx={{
        width: "100%",
        minHeight: "100vh",
        px: { xs: 2, md: 10 },
        pt: { xs: 14, md: 18 },
        pb: { xs: 6, md: 10 },
        gap: 4,
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontSize: { xs: 30, md: 54 },
          color: "primary.main",
          fontFamily: "Bhel Puri",
          textAlign: "center",
        }}
      >
        {title}
      </Typography>

      <Typography
        component="p"
        sx={{
          maxWidth: 980,
          mx: "auto",
          fontSize: { xs: 14, md: 20 },
          lineHeight: 1.8,
          color: "text.secondary",
          textAlign: "center",
          whiteSpace: "pre-line",
        }}
      >
        {message}
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: 1100,
          aspectRatio: "16 / 9",
          mx: "auto",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 4,
          bgcolor: "black",
        }}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="About us video"
            style={{ width: "100%", height: "100%", border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <Stack
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              px: 2,
            }}
          >
            <Typography color="white" sx={{ textAlign: "center" }}>
              No video available for About Us right now.
            </Typography>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
