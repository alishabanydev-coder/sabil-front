import { Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import backgroundImage from "@/public/let-us-call-you-background.png";
import { ScondaryButton } from "@/component/ui/ScondaryButton";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

const LetUsCallYou = () => {
  const whiteTextFieldStyles = {
    "& .MuiInputLabel-root": {
      color: "#fff",
      fontFamily: "Namecat",
      letterSpacing: 1.2,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#fff",
      fontFamily: "Namecat",
    },
    "& .MuiInputBase-input": {
      color: "#fff",
      fontFamily: "Namecat",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "#fff",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: "#fff",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#fff",
    },
    "& .MuiFormHelperText-root": {
      color: "#fff",
      fontFamily: "Namecat",
      fontSize: 11,
      letterSpacing: 1.5,
      fontWeight: "light",
      mt: 1.5,
    },
  };

  return (
    <Stack
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        mt: -20
      }}
    >
      <Stack sx={{ position: "relative", width: "92%", aspectRatio: "16 / 9" }}>
        <Image
          src={backgroundImage}
          alt="logo"
          fill
          style={{ objectFit: "contain" }}
        />
      </Stack>
      <Stack
        direction="row"
        sx={{
          width: "80%",
          mx: "auto",
          position: "absolute",
          top: "39%",
          gap: 2,
        }}
      >
        <Stack
          direction="row"
          sx={{
            width: "55%",
            direction: "ltr",
            alignItems: "end",
            gap: 2,
            pb: 2,
          }}
        >
          <Stack direction="row" sx={{ gap: 2 }}>
            <TextField
              variant="standard"
              label="YOUR NAME AND SURENAME"
              sx={whiteTextFieldStyles}
              helperText="THIS FIELD IS REQUIRED!"
            />
            <TextField
              variant="standard"
              label="YOUR GSM NUMBER"
              sx={whiteTextFieldStyles}
              helperText="THIS FIELD IS REQUIRED!"
            />
          </Stack>

          <ScondaryButton
            sx={{
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 20,
                fontFamily: "Namecat",
                letterSpacing: 2,
                mt: 0.5,
              }}
            >
              SEND
            </Typography>
            <Stack
              sx={{
                bgcolor: "secondary.main",
                borderRadius: "50%",
                p: 0.2,
              }}
            >
              <PlayArrowRoundedIcon sx={{ color: "primary.main" }} />
            </Stack>
          </ScondaryButton>
        </Stack>

        <Stack sx={{ direction: "ltr", width: "45%", gap: 2, pl: 5, pr: 4 }}>
          <Typography sx={{ fontSize: 36, color: "#fff" }}>
            Let Us Call You
          </Typography>
          <Typography
            sx={{
              fontSize: 18,
              color: "secondary.main",
              fontFamily: "Namecat",
            }}
          >
            If you would like to receive information about animation and content
            production and support for Sebeel Kids, please enter your contact
            information.
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LetUsCallYou;
