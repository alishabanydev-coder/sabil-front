import { PrimaryButton } from "@/component/ui/PrimaryButton";
import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";

const textMd = `A\nGATEWAY\nTO THE\nFUTURE`;
const textXs = `A GATEWAY TO \n THE FUTURE`;

const Leftside = ({
  onOpenAboutUsModal,
}: {
  onOpenAboutUsModal: () => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      sx={{
        height: "90%",
        width: "30%",
        position: "absolute",
        top: "8%",
        left: "6%",
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
            width: "30%",
            position: "relative",
            aspectRatio: "1 / 1",
            justifyContent: "center",
            alignItems: "center",
            top: { xs: "-25%", sm: "-35%" },
            left: "-24%",
          }}
        >
          <Image
            src="/icon-192.png"
            alt={"logo"}
            fill
            style={{
              width: "100%",
              height: "100%",
              marginRight: "auto",
              marginLeft: "auto",
            }}
          />
        </Stack>

        <Stack
          sx={{
            position: "absolute",
            top: { xs: "38%", sm: "25%" },
            left: "10%",
            flexDirection: "column",
          }}
        >
          <Typography
            color="primary"
            sx={{
              fontSize: { xs: 10, sm: 14, md: 24, lg: 32, xl: 36 },
              textAlign: "end",
              fontFamily: "Bhel Puri",
              whiteSpace: "pre-line",
            }}
          >
            {isMobile ? textXs : textMd}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            gap: { xs: 1, sm: 2 },
            position: "absolute",
            bottom: { xs: "14%", md: "14%" },
            right: { xs: "-20%", md: "-5%" },
            zIndex: 100,
          }}
        >
          <PrimaryButton
            sx={{
              fontFamily: "Namecat",
              height: { xs: 25, sm: 30, md: "auto" },
              fontSize: { xs: 7, sm: 12, md: 20 },
              px: { xs: 0.7, sm: 1.2, md: 2 },
              py: { xs: 0, sm: 0.3, md: 1 },
              letterSpacing: 2,
            }}
            onClick={onOpenAboutUsModal}
          >
            About Us
          </PrimaryButton>
          <PrimaryButton
            sx={{
              fontFamily: "Namecat",
              height: { xs: 25, sm: 30, md: "auto" },
              fontSize: { xs: 7, sm: 12, md: 20 },
              px: { xs: 0.7, sm: 1.2, md: 2 },
              py: { xs: 0.3, sm: 0.3, md: 1 },
              letterSpacing: 2,
            }}
            href={"/donation"}
          >
            Donate Now
          </PrimaryButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Leftside;
