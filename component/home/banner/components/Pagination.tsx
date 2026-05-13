import { Box, IconButton, Stack } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

type PaginationProps = {
  onNext?: () => void;
  onPrev?: () => void;
};

const Pagination = ({ onNext, onPrev }: PaginationProps) => {
  return (
    <Stack direction="row" sx={{ gap: { xs: 0.5, md: 1 } }}>
      <IconButton
        onClick={onNext}
        sx={{
          width: { xs: 50, sm: 72 },
          height: { xs: 28, sm: 40 },
          borderRadius: 5,
          bgcolor: "secondary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          "@keyframes nextArrowSlideOutAndBack": {
            "0%": { transform: "translateX(0)", opacity: 1 },
            "45%": { transform: "translateX(28px)", opacity: 0 },
            "46%": { transform: "translateX(-28px)", opacity: 0 },
            "100%": { transform: "translateX(0)", opacity: 1 },
          },
          "&:hover": {
            bgcolor: "secondary.light",
          },
          "&:hover .next-arrow-content": {
            animation: "nextArrowSlideOutAndBack 700ms ease-in-out 1",
          },
        }}
      >
        <Box
          className="next-arrow-content"
          sx={{
            position: "absolute",
            inset: 0,
          }}
        >
          <NavigateNextIcon
            sx={{
              fontSize: { xs: 24, sm: 40 },
              color: "warning.main",
              position: "absolute",
              right: { xs: "5px", sm: -2.5 },
              top: { xs: "7%", sm: "0%" },
            }}
          />
          <Box
            sx={{
              width: { xs: 20, sm: 32 },
              height: { xs: 2, sm: 4 },
              borderRadius: 999,
              bgcolor: "warning.main",
              position: "absolute",
              right: 15.5,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <Box
            sx={{
              width: { xs: 4, sm: 5 },
              height: { xs: 2, sm: 4 },
              borderRadius: 999,
              bgcolor: "warning.main",
              position: "absolute",
              right: { xs: 38, sm: 52 },
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </Box>
      </IconButton>
      <IconButton
        onClick={onPrev}
        sx={{
          width: { xs: 28, sm: 40 },
          height: { xs: 28, sm: 40 },
          borderRadius: "50%",
          bgcolor: "secondary.main",
          position: "relative",
          overflow: "hidden",
          "@keyframes prevArrowSlideOutAndBack": {
            "0%": { transform: "translateX(0)", opacity: 1 },
            "45%": { transform: "translateX(-22px)", opacity: 0 },
            "46%": { transform: "translateX(22px)", opacity: 0 },
            "100%": { transform: "translateX(0)", opacity: 1 },
          },
          "&:hover": {
            bgcolor: "secondary.light",
          },
          "&:hover .prev-arrow-content": {
            animation: "prevArrowSlideOutAndBack 700ms ease-in-out 1",
          },
        }}
      >
        <Box
          className="prev-arrow-content"
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NavigateBeforeIcon
            sx={{
              color: "warning.main",
              fontSize: { xs: 24, sm: 40 },
              pr: 0.4,
            }}
          />
        </Box>
      </IconButton>
    </Stack>
  );
};

export default Pagination;
