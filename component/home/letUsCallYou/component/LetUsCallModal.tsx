import { Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { createPublicSupporter } from "../supportersApi";

const style = {
  direction: "ltr",
  height: "auto",
  maxHeight: "80vh",
  width: 350,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  overflowY: "auto",
  p: 3,
};

const FollowUsModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPhoneNumber("");
      setMessage("");
      setIsSubmitting(false);
      setFormError("");
      setFormSuccess("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim();
    const normalizedPhoneNumber = phoneNumber.trim();
    const normalizedMessage = message.trim();

    if (!normalizedName || !normalizedMessage) {
      setFormError("Name and message are required.");
      setFormSuccess("");
      return;
    }

    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    try {
      const result = await createPublicSupporter({
        name: normalizedName,
        email: normalizedEmail,
        message: normalizedMessage,
        phoneNumbers: normalizedPhoneNumber ? [normalizedPhoneNumber] : [],
      });

      if (!result.ok) {
        setFormError(result.message);
        return;
      }

      setFormSuccess("Your request has been sent successfully.");
      setName("");
      setEmail("");
      setPhoneNumber("");
      setMessage("");
      onClose();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to send your request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Stack sx={style}>
        <Stack sx={{ gap: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Namecat", textAlign: "center", fontSize: 20, color: "primary.main" }}
          >
            Let Us Call You
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontFamily: "Namecat", textAlign: "center", fontSize: 12, color: "text.secondary" }}
          >
            If you would like to receive information about animation and content
            production and support for Sebeel Kids, please enter your contact
            information.
          </Typography>
        </Stack>
        <Stack sx={{ gap: 2.3 }}>
          <TextField
            label="Name"
            variant="standard"
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            label="Email"
            variant="standard"
            fullWidth
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Your GSM Number"
            variant="standard"
            fullWidth
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            multiline
            minRows={3}
          />
          {formError ? (
            <Typography sx={{ color: "error.main", fontSize: 12 }}>
              {formError}
            </Typography>
          ) : null}
          {formSuccess ? (
            <Typography sx={{ color: "success.main", fontSize: 12 }}>
              {formSuccess}
            </Typography>
          ) : null}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{ mt: 1 }}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default FollowUsModal;
