import { PrimaryButton } from "@/component/ui/PrimaryButton";
import { WhitePrimaryButton } from "@/component/ui/WhitePrimaryButton";
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
        width: { xs: "30%", sm: "35%", md: "35%", lg: "32%", xl: "30%" },
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
            top: { xs: "20%", sm: "15%", md: "16%", lg: "15%", xl: "18%" },
            left: "5%",
            flexDirection: "column",
            textAlign: "start",
            direction: "ltr",
            "& p": {
              fontSize: { xs: 11, sm: 14, md: 24, lg: 34, xl: 38 },
              fontFamily: "Arco",
              lineHeight: 1.2,
              whiteSpace: "pre-line",
              letterSpacing: 1,
              fontWeight: 100,
            },
            "& span": {
              pt: { xs: 1, lg: 2 },
              fontSize: { xs: 9, sm: 10, md: 16, lg: 19, xl: 23 },
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
              display: { xs: "none", sm: "block" },
              unicodeBidi: "isolate",
            }}
          >
            values-based We create sofe, joyful and animated content that
            inspires faith, builds character and brings families closer.
          </Typography>
        </Stack>

        {/* <Stack
          direction="row"
          sx={{
            gap: { xs: 1, lg: 2 },
            position: "absolute",
            bottom: { xs: "24%", sm: "27%", md: "23%", lg: "23%", xl: "25%" },
            right: { xs: "-20%", sm: "-5%", md: "-10%" },
            zIndex: 100,
          }}
        >
          <WhitePrimaryButton
            sx={{
              fontFamily: "Namecat",
              height: { xs: 25, sm: 30, md: "auto" },
              px: { xs: 0.7, sm: 1.2, md: 1.5 },
              py: { xs: 0, sm: 0.3, md: 1, lg: 1.2 },
              letterSpacing: 2,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 0.5, md: 1 },
              "& img": {
                width: { xs: 10, sm: 12, md: 18, lg: 18, xl: 35 },
                height: { xs: 10, sm: 12, md: 18, lg: 18, xl: 35 },
                objectFit: "contain",
              },
              "& p": {
                fontSize: { xs: 8, sm: 10, md: 16, lg: 20, xl: 24 },
                fontFamily: "Namecat",
                color: "secondary.main",
                letterSpacing: 1,
                lineHeight: 1.2,

                fontWeight: 100,
              },
            }}
            href={"/donation"}
          >
            <img src="/arrow-right.png" alt="arrow-right" />
            <Typography>Join Our Mission</Typography>
          </WhitePrimaryButton>

          {showAboutUsButton ? (
            <PrimaryButton
              sx={{
                fontFamily: "Namecat",
                height: { xs: 25, sm: 30, md: "auto" },
                px: { xs: 0.7, sm: 1.2, md: 1.5 },
                py: { xs: 0, sm: 0.3, md: 1, lg: 1.2 },
                letterSpacing: 2,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 0.5, md: 1 },
                "& img": {
                  width: { xs: 10, sm: 12, md: 18, lg: 18, xl: 35 },
                  height: { xs: 10, sm: 12, md: 18, lg: 18, xl: 35 },
                  objectFit: "contain",
                },
                "& p": {
                  fontSize: { xs: 8, sm: 10, md: 16, lg: 20, xl: 24 },
                  fontFamily: "Namecat",
                  color: "secondary.main",
                  letterSpacing: 1,
                  lineHeight: 1.2,
                  fontWeight: 100,
                },
              }}
              onClick={onOpenAboutUsModal}
            >
              <img src="/arrow-right.png" alt="arrow-right" />
              <Typography>About Us</Typography>
            </PrimaryButton>
          ) : null}
        </Stack> */}
      </Stack>
    </Stack>
  );
};

export default Leftside;
