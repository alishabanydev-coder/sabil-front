import { PrimaryButton } from "@/component/ui/PrimaryButton";
import { WhitePrimaryButton } from "@/component/ui/WhitePrimaryButton";
import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";

const textMd = `A TRUSTED\nGATEWAY TO\\nFUTURE`;
const textXs = `A GATEWAY TO \n THE FUTURE`;

const Leftside = ({
  showAboutUsButton = false,
  onOpenAboutUsModal,
}: {
  showAboutUsButton?: boolean;
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
        top: "5%",
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
            top: { xs: "38%", sm: "20%" },
            left: "5%",
            flexDirection: "column",
            textAlign: "start",
            direction: "ltr",
            "& p": {
              fontSize: { xs: 10, sm: 14, md: 24, lg: 36, xl: 38 },
              fontFamily: "Arco",
              lineHeight: 1.2,
              whiteSpace: "pre-line",
              letterSpacing: 1,
              fontWeight: 100,
            },
            "& span": {
              pt: 2,
              fontSize: { xs: 10, sm: 14, md: 24, lg: 20, xl: 23 },
              fontFamily: "Namecat",
              lineHeight: 1.2,
              whiteSpace: "pre-line",
              letterSpacing: 1,
              fontWeight: 100,
            },
          }}
        >
          <Typography color="primary">{`A TRUSTED\nGATEWAY TO`}</Typography>
          <Typography color={"secondary"}>{`ISLAMIC STORIES`}</Typography>
          <Typography color="primary">{`FOR CHILDREN`}</Typography>

          <Typography
            component={"span"}
            sx={{
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
            gap: { xs: 1, sm: 2 },
            position: "absolute",
            bottom: { xs: "14%", md: "23%" },
            right: { xs: "-20%", md: "-10%" },
            zIndex: 100,
          }}
        >
          <WhitePrimaryButton
            sx={{
              fontFamily: "Namecat",
              height: { xs: 25, sm: 30, md: "auto" },
              px: { xs: 0.7, sm: 1.2, md: 2 },
              py: { xs: 0, sm: 0.3, md: 0.7, lg: 1.2 },
              letterSpacing: 2,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
            href={"/donation"}
          >
            <img
              src="/arrow-right.png"
              alt="arrow-right"
              style={{
                width: 20,
                height: 20,
                objectFit: "contain",
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: 10, sm: 12, md: 14, lg: 15, xl: 15 },
                fontFamily: "Namecat",
                color: "secondary.main",
                letterSpacing: 2,
                fontWeight: 100,
              }}
            >
              Join Our Mission
            </Typography>
          </WhitePrimaryButton>

          {showAboutUsButton ? (
            <PrimaryButton
              sx={{
                fontFamily: "Namecat",
                height: { xs: 25, sm: 30, md: "auto" },
                px: { xs: 0.7, sm: 1.2, md: 2.3 },
                py: { xs: 0, sm: 0.3, md: 0.7, lg: 1.2 },
                letterSpacing: 2,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
              onClick={onOpenAboutUsModal}
            >
              <img
                src="/arrow-right.png"
                alt="arrow-right"
                style={{
                  width: 20,
                  height: 20,
                  objectFit: "contain",
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: 10, sm: 12, md: 14, lg: 15, xl: 15 },
                  fontFamily: "Namecat",
                  color: "#fff",
                  letterSpacing: 2,
                  fontWeight: 100,
                }}
              >
                About Us
              </Typography>
            </PrimaryButton>
          ) : null}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Leftside;
