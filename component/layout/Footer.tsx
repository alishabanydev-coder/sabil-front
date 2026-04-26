import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import footer from "@/public/footer.png";
import Kid from "@/public/kid-with-ball.png";
import Ball from "@/public/ball.png";
import logo from "@/public/logo-skatch.png";

const footerLinks = [
  [
    { label: "Sabeel Toons", href: "/" },
    { label: "Sabeel Kids", href: "/" },
    { label: "Sabeel Story", href: "/" },
    { label: "Yusuf Aur Maryam", href: "/" },
  ],
  [
    { label: "About", href: "/#about" },
    { label: "Ways To Watch", href: "/" },
    { label: "Media Enquiries", href: "/" },
    { label: "Terms Of Use", href: "/" },
    { label: "Privacy Policy", href: "/" },
    { label: "Cookies Policy", href: "/" },
  ],
];

export default function Footer() {
  return (
    <Stack sx={{ position: "relative", width: "100%", aspectRatio: "16 / 5" }}>
      <Image src={footer} alt="some image" fill style={{ objectFit: "fill" }} />

      <Stack sx={{ position: "absolute", top: "-55%", left: "5%" }}>
        <Stack sx={{ position: "relative", width: 260, height: 414 }}>
          <Image
            src={Kid}
            alt="some image"
            fill
            style={{ objectFit: "cover" }}
          />
        </Stack>
      </Stack>
      <Stack sx={{ position: "absolute", top: "-5%", left: "30%" }}>
        <Stack sx={{ position: "relative", width: 100, height: 100 }}>
          <Image
            src={Ball}
            alt="some image"
            fill
            style={{ objectFit: "cover" }}
          />
        </Stack>
      </Stack>

      <Stack
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          ml: 15,
          mt: -3,
        }}
      >
        {footerLinks.map((row, rowIndex) => (
          <Stack
            key={rowIndex}
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: { xs: 1.5, md: 3 },
            }}
          >
            {row.map((item, index) => (
              <Stack
                key={item.label}
                direction="row"
                sx={{ alignItems: "center", gap: { xs: 1.5, md: 3 } }}
              >
                {index > 0 && (
                  <Typography
                    component="span"
                    sx={{
                      color: "#fff",
                      fontSize: 36,
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    &bull;
                  </Typography>
                )}
                <Link href={item.href} style={{ textDecoration: "none" }}>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontFamily: "Namecat",
                      fontSize: { xs: 14, md: 18 },
                      fontWeight: 700,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      textShadow: "0 2px 4px rgba(92, 12, 151, 0.28)",
                      "&:hover": {
                        color: "primary.light",
                      },
                    }}
                  >
                    {item.label}
                  </Typography>
                </Link>
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>

      <Stack
        direction="row"
        sx={{
          position: "absolute",
          bottom: 20,
          left: "40%",
          alignItems: "center",
          gap: 1,
          direction: "ltr",
        }}
      >
        <Stack
          sx={{
            position: "relative",
            width: 111,
            height: 111,
            "&.cursor-pointer": {
              objectFit: "cover",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.05)",
                translateY: "-1px",
                transition: "transform 0.2s ease, translateY 0.2s ease",
              },
            },
          }}
        >
          <Image src={logo} alt="some image" fill className="cursor-pointer" />
        </Stack>
        <Typography
          sx={{
            color: "#fff",
            fontSize: 11,
            fontFamily: "Namecat",
            textTransform: "uppercase",
            letterSpacing: 1.5,
            lineHeight: 1,
            whiteSpace: "pre-line",
            textAlign: "start",
          }}
        >
          {"&copy; 2026 Sabil Group. \n All rights & copyRights reserved."}
        </Typography>
      </Stack>
    </Stack>
  );
}
