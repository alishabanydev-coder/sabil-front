import { Button, Stack } from "@mui/material";
import { useState } from "react";
import DonationModal from "./donation/DonationModal";

// FIXME: list order should't be managed my number, open modal to select list order
// FIXME: create modal for this Updates, FAQs, Sections <Each different modal>
// FIXME: add backend service for this, make it POST / GET / DELETE
// FIXME: add Edit Modal with Different UI and Tabs for Comments
// FIXME: card or the project have more icon and menu that contain DELETE/EDIT/CHAT
// FIXME: manage the comments for each DonationProject and each BLOG/BREAKDOWN(updates)

const Donation = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddDonation = () => {
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
  };

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          height: "calc(100vh - 60px)",
          mt: 3,
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
        }}
      >
        <Stack
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: -20,
            right: 0,
          }}
        >
          <Button
            sx={{
              width: 200,
              boxShadow: (theme) =>
                `0px 2px 12px 1px ${theme.palette.primary.main}`,
            }}
            variant="contained"
            color="primary"
            onClick={handleAddDonation}
          >
            Add Donation
          </Button>
        </Stack>

        <Stack
          sx={{
            width: "100%",
            height: "100%",
            pt: 6,
            px: 2,
            pb: 2,
            overflow: "auto",
          }}
        ></Stack>
      </Stack>

      <DonationModal open={open} isEditing={isEditing} onClose={handleClose} />
    </Stack>
  );
};

export default Donation;
