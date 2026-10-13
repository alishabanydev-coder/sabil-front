import { AppButton } from "@/component/ui/AppButton";
import { Stack, Typography } from "@mui/material";

const Leftside = ({
  showAboutUsButton = false,
  onOpenAboutUsModal,
}: {
  showAboutUsButton?: boolean;
  onOpenAboutUsModal: () => void;
}) => {
  return (
    <Stack
      sx={{
        height: "90%",
        width: { xs: "32%", sm: "30%" },
        position: "absolute",
        top: "10%",
        left: "5%",
      }}
    >
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            position: "absolute",
            top: { xs: "20%", sm: "15%", md: "16%", lg: "13%", xl: "12%" },
            left: { xs: "1%", md: "5%" },
            flexDirection: "column",
            textAlign: "start",
            direction: "ltr",
            "& p": {
              fontSize: { xs: 14, sm: 16, md: 24, lg: 38, xl: 54 },
              lineHeight: { xs: 1.3, sm: 1 },
              whiteSpace: "pre-line",
              fontWeight: 800,
              color: "primary.main",
            },
            "& span": {
              pt: { xs: 1, lg: 2 },
              fontSize: { xs: 9, sm: 10, md: 14, lg: 19, xl: 22 },
              lineHeight: 1,
              whiteSpace: "pre-line",
              letterSpacing: 1,
              fontWeight: 500,
            },
          }}
        >
          <Typography>
            A TRUSTED GATEWAY TO ISLAMIC STORIES FOR CHILDREN
          </Typography>

          <Typography
            component={"span"}
            sx={{
              display: { xs: "none", sm: "block" },
              unicodeBidi: "isolate",
            }}
          >
            values-based We create sofe, joyful and animated content that
            inspires faith, builds character and brings families closer.
          </Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            display: { xs: "none", sm: "flex" },
            gap: { xs: 1, lg: 2 },
            position: "absolute",
            bottom: { xs: "28%", sm: "34%", md: "30%", lg: "27%", xl: "28%" },
            right: { xs: "0%", sm: "0%", md: "-18%", lg: "0%" },
            zIndex: 100,
            justifyContent: "end",
          }}
        >
          <AppButton
            tone="white"
            shadow="soft"
            sx={{
              height: { xs: 22, sm: 30, md: "auto" },
              px: { xs: 0.7, sm: 1.2, md: 1.6, lg: 2 },
              py: { xs: 0, sm: 0.3, md: 1, lg: 1.5 },
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 0.5, md: 1 },
              "& img": {
                width: { xs: 10, sm: 12, md: 14, lg: 16, xl: 21 },
                height: { xs: 10, sm: 12, md: 14, lg: 16, xl: 21 },
                objectFit: "contain",
              },
              "& p": {
                fontSize: { xs: 8, sm: 10, md: 16, lg: 18, xl: 18 },
                color: "secondary.main",
                fontWeight: 600,
                lineHeight: 1,
              },
            }}
            onClick={() => {
              const section = document.getElementById("blog");
              if (!section) return;
              const top = section.getBoundingClientRect().top + window.scrollY;
              const offset =
                top - (window.innerHeight - section.offsetHeight) / 2;
              window.scrollTo({
                top: Math.max(0, offset),
                behavior: "smooth",
              });
            }}
          >
            <img src="/arrow-right.png" alt="arrow-right" />
            <Typography>Join Our Mission</Typography>
          </AppButton>

          {showAboutUsButton ? (
            <AppButton
              tone="primary"
              shadow="soft"
              sx={{
                height: { xs: 25, sm: 30, md: "auto" },
                px: { xs: 0.7, sm: 1.2, md: 1.6, lg: 2 },
                py: { xs: 0, sm: 0.3, md: 1, lg: 1.2 },
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 0.5, md: 1 },
                "& img": {
                  width: { xs: 10, sm: 12, md: 14, lg: 16, xl: 21 },
                  height: { xs: 10, sm: 12, md: 14, lg: 16, xl: 21 },
                  objectFit: "contain",
                },
                "& p": {
                  fontSize: { xs: 8, sm: 10, md: 16, lg: 18, xl: 18 },
                  color: "#fff",
                  fontWeight: 500,
                  lineHeight: 1,
                },
              }}
              onClick={onOpenAboutUsModal}
            >
              <img src="/arrow-right.png" alt="arrow-right" />
              <Typography>About Us</Typography>
            </AppButton>
          ) : null}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Leftside;
