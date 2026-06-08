"use client";

import { Avatar, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import avatar1 from "@/public/avatar1.png";
import avatar2 from "@/public/avatar2.png";
import avatar3 from "@/public/avatar3.png";
import virgol from "@/public/virgol.png";
import SeactionHeader from "@/component/ui/SectionHeader";

const slides = [
  {
    id: 1,
    name: "Dr. Amita bachan",
    occupation: "Doctor",
    avatar: avatar1,
    description:
      "i can't believe how much my child has improved in just a few months. The teachers are amazing and the curriculum is perfect for my child.",
  },
  {
    id: 2,
    name: "Salman Khan",
    occupation: "Actor",
    avatar: avatar2,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. some more text so this looks better",
  },
  {
    id: 3,
    name: "Anjali Kumari",
    occupation: "Teacher",
    avatar: avatar3,
    description:
      "i can't believe how much my child has improved in just a few months. The teachers are amazing and the curriculum is perfect for my child.",
  },
  {
    id: 4,
    name: "Aamir Khan",
    occupation: "Actor",
    avatar: avatar1,
    description:
      "this is the best service i've ever had. The staff is friendly and the results are amazing.",
  },
  {
    id: 5,
    name: "Akshay Kumar",
    occupation: "Actor",
    avatar: avatar3,
    description:
      "it was a great experience. The staff is friendly and the results are amazing. why this is too short i wanted a longer text!",
  },
  {
    id: 6,
    name: "John Doe",
    occupation: "Teacher",
    avatar: avatar1,
    description:
      "The best service I've ever had. The staff is friendly and the results are amazing.",
  },
  {
    id: 7,
    name: "Monika Sharma",
    occupation: "Doctor",
    avatar: avatar2,
    description:
      "i can't believe how much my child has improved in just a few months. The teachers are amazing and the curriculum is perfect for my child.",
  },
  {
    id: 8,
    name: "Rajesh Kumar",
    occupation: "Teacher",
    avatar: avatar1,
    description: "how great the service is! i'm so happy with the results.",
  },
];

type CommentData = {
  _id: string;
  text: string;
  username: string;
  targetType: string;
  targetId: string | null;
};

const shouldShowTargetSubtitle = (targetType: string) =>
  !["general", "project"].includes(targetType);

const PeopleOpinion = ({ commentData }: { commentData: CommentData[] }) => {
  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        pt: 5,
      }}
    >
      <SeactionHeader text="People Opinions" />

      <Typography
        sx={{
          fontSize: { xs: 9, sm: 14 },
          color: "secondary.main",
          fontFamily: "Namecat",
          textDecoration: "uppercase",
          letterSpacing: 1.2,
        }}
      >
        {`Sabeel kids from the prespective of those know us well`}
      </Typography>

      <Stack
        sx={{
          flexDirection: "row",
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          perspective: "1200px",
          ".people-opinion-card": {
            transition: "transform 300ms ease, box-shadow 300ms ease",
            transform: "perspective(800px) rotateY(0deg)",
            transformOrigin: "center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              borderRadius: "inherit",
              transition: "background 300ms ease",
            },
          },
          ".swiper-slide": {
            display: "flex",
            alignItems: "center",
            perspective: "1500px",
            transformStyle: "preserve-3d",
          },
          ".swiper-slide-prev .people-opinion-card": {
            transform: "perspective(800px) rotateY(10deg)",
            boxShadow: "18px 8px 24px rgba(0, 0, 0, 0.18)",
            opacity: 0.8,
            scale: 0.9,
            transition: "all .3s ease-in",
            "&::after": {
              background:
                "linear-gradient(90deg, rgba(0, 0, 0, 0.20), transparent 45%, rgba(255, 255, 255, 0.25))",
            },
          },
          ".swiper-slide-next .people-opinion-card": {
            transform: "perspective(800px) rotateY(-10deg)",
            boxShadow: "-18px 8px 24px rgba(0, 0, 0, 0.18)",
            opacity: 0.8,
            scale: 0.9,
            transition: "all .3s ease-in",
            "&::after": {
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0.20), transparent 75%, rgba(0, 0, 0, 0.25))",
            },
          },
          ".swiper-slide-active": {
            zIndex: 2,
          },
          ".swiper-slide-active .people-opinion-card": {
            transform: "perspective(800px) rotateY(0deg)",
            boxShadow: "none",
            "&::after": {
              background: "transparent",
            },
          },
        }}
      >
        <Swiper
          modules={[Autoplay]}
          slidesPerView={3}
          loop
          centeredSlides
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            320: {
              slidesPerView: 1.2,
              spaceBetween: 20,
            },
            610: {
              slidesPerView: 3,
              spaceBetween: 70,
            },
          }}
          style={{
            width: "100%",
            paddingTop: 36,
            paddingBottom: 36,
          }}
        >
          {commentData.map((comment) => (
            <SwiperSlide key={comment._id}>
              <Stack
                className="people-opinion-card"
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  bgcolor: "secondary.main",
                  minHeight: { xs: 100, sm: 140 },
                  p: 3,
                  borderRadius: "38px",
                }}
              >
                <Stack
                  direction="row"
                  sx={{ justifyContent: "end", alignItems: "center", gap: 2 }}
                >
                  <Stack sx={{ alignItems: "end", gap: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: 10, sm: 14 },
                        color: "#000",
                        fontFamily: "Bhel Puri",
                        letterSpacing: 1,
                      }}
                    >
                      {comment.username}
                    </Typography>
                    {shouldShowTargetSubtitle(comment.targetType) ? (
                      <Typography
                        sx={{
                          fontSize: { xs: 9, sm: 12 },
                          color: "#fff",
                          fontFamily: "Namecat",
                          letterSpacing: 2,
                        }}
                      >
                        {comment.targetType}
                      </Typography>
                    ) : null}
                  </Stack>
                  <Avatar
                    alt={comment.username}
                    sx={{
                      objectFit: "cover",
                      bgcolor: "secondary.light",
                      borderRadius: "50%",
                      width: { xs: 42, sm: 55 },
                      height: { xs: 42, sm: 55 },
                    }}
                  />
                </Stack>
                <Stack
                  sx={{
                    position: "relative",
                    px: 6,
                    pt: 2,
                    "& img": {
                      width: { xs: 22, sm: 32 },
                      height: { xs: 22, sm: 32 },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      width: "100%",
                      direction: "ltr",
                      textAlign: "justify",
                      textAlignLast: "left",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: { xs: 6, sm: 5 },
                      whiteSpace: "normal",
                      fontSize: { xs: 9, sm: 14 },
                      color: "#fff",
                      fontFamily: "Namecat",
                      letterSpacing: 1,
                    }}
                  >
                    {comment.text}
                  </Typography>

                  <Image
                    src={virgol}
                    alt="virgol"
                    width={32}
                    height={32}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 20,
                      zIndex: 0,
                      transform: "rotate(180deg)",
                      transformOrigin: "center",
                    }}
                  />

                  <Image
                    src={virgol}
                    alt="virgol"
                    width={32}
                    height={32}
                    style={{
                      position: "absolute",
                      right: 0,
                      bottom: 0,
                      zIndex: 0,
                      transformOrigin: "center",
                    }}
                  />
                </Stack>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
      </Stack>
    </Stack>
  );
};

export default PeopleOpinion;
