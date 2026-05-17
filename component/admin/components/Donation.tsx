import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchDonation, updateDonation } from "../services/donationApi";

const Donation = () => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDonation() {
      setLoading(true);
      setErrorMsg("");

      try {
        const result = await fetchDonation({ signal: controller.signal });

        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        if (!result.ok) {
          setErrorMsg(result.message);
          return;
        }

        const payload = result.donation;
        setName(typeof payload?.name === "string" ? payload.name : "");
        setLink(typeof payload?.link === "string" ? payload.link : "");
        setLastUpdatedAt(
          typeof payload?.updatedAt === "string" ? payload.updatedAt : null
        );
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoading(false);
        setErrorMsg(
          error instanceof Error
            ? error.message
            : "Failed to load donation settings."
        );
      }
    }

    loadDonation();

    return () => controller.abort("Donation tab unmounted");
  }, []);

  const handleSave = async () => {
    const normalizedName = name.trim();
    const normalizedLink = link.trim();

    if (!normalizedName || !normalizedLink) {
      setSubmitErrorMsg("Donation name and link are required.");
      return;
    }

    setSubmitErrorMsg("");
    setIsSubmitting(true);

    try {
      const result = await updateDonation({
        name: normalizedName,
        link: normalizedLink,
      });

      if (!result.ok) {
        setSubmitErrorMsg(result.message);
        return;
      }

      const payload = result.donation;
      setName(
        typeof payload?.name === "string" ? payload.name : normalizedName
      );
      setLink(
        typeof payload?.link === "string" ? payload.link : normalizedLink
      );
      setLastUpdatedAt(
        typeof payload?.updatedAt === "string" ? payload.updatedAt : null
      );
    } catch (error) {
      setSubmitErrorMsg(
        error instanceof Error
          ? error.message
          : "Failed to save donation settings."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        border: (theme) => `1px solid ${theme.palette.primary.main}`,
        borderRadius: 2,
        overflow: "auto",
        p: 2,
        gap: 2,
      }}
    >
      <Typography component="h2" sx={{ fontSize: 22, fontWeight: 700 }}>
        Donation
      </Typography>
      <Typography component="p" sx={{ color: "text.secondary" }}>
        Manage one global donation button label and link for the whole site.
      </Typography>

      {loading ? (
        <Stack sx={{ width: "100%", alignItems: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Stack>
      ) : errorMsg ? (
        <Typography color="error" variant="body2">
          {errorMsg}
        </Typography>
      ) : (
        <Stack sx={{ gap: 2 }}>
          <TextField
            label="Donation Button Name"
            placeholder="Donate Here"
            value={name}
            onChange={(event) => setName(event.target.value)}
            fullWidth
          />
          <TextField
            label="Donation Link"
            placeholder="https://example.com/donate"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            fullWidth
          />
          <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isSubmitting || !name.trim() || !link.trim()}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            {lastUpdatedAt ? (
              <Typography variant="body2" color="text.secondary">
                Last updated: {new Date(lastUpdatedAt).toLocaleString()}
              </Typography>
            ) : null}
          </Stack>
          {submitErrorMsg ? (
            <Typography color="error" variant="body2">
              {submitErrorMsg}
            </Typography>
          ) : null}
        </Stack>
      )}
    </Stack>
  );
};

export default Donation;
