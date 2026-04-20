import { PrimaryButton } from "@/component/ui/PrimaryButton";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import logo from "@/public/icon-192.png";


const Leftside = () => {
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
      <Stack sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Image
          src={logo}
          alt={"logo"}
          width={130}
          style={{
            marginRight: "auto",
            marginLeft: "auto",
            position: "absolute",
            top: "0%",
            left: "16%",
          }}
        />

        <Stack
          sx={{
            position: "absolute",
            top: "25%",
            left: "10%",
            flexDirection: "column",
          }}
        >
          <Typography
            color="primary"
            sx={{
              fontSize: { xs: 12, sm: 14, md: 24, lg: 32, xl: 36 },
              textAlign: "end",
            }}
          >
            A
          </Typography>

          <Typography
            color="primary"
            sx={{
              fontSize: { xs: 12, sm: 14, md: 24, lg: 32, xl: 36 },
              textAlign: "end",
            }}
          >
            GATEWAY
          </Typography>
          <Typography
            color="primary"
            sx={{
              fontSize: { xs: 12, sm: 14, md: 24, lg: 32, xl: 36 },
              textAlign: "end",
            }}
          >
            TO THE
          </Typography>
          <Typography
            color="primary"
            sx={{
              fontSize: { xs: 12, sm: 14, md: 24, lg: 32, xl: 36 },
              textAlign: "end",
            }}
          >
            FUTURE
          </Typography>
        </Stack>

        <PrimaryButton
          sx={{
            fontFamily: "Namecat",
            fontSize: 20,
            letterSpacing: 2,
            position: "absolute",
            bottom: "14%",
            right: "-5%",
          }}
        >
          subscirbe
        </PrimaryButton>
      </Stack>
    </Stack>
  );
};

export default Leftside;
