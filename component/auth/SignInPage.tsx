"use client";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  buildAuthPayload,
  getSafeReturnUrl,
  validateAuthForm,
  type AuthMode,
} from "./authFormValidation";
import AuthWaveBackground from "./AuthWaveBackground";
import {
  fetchCurrentUser,
  getStoredUserToken,
  loginUser,
  logoutUser,
  registerUser,
  saveUserSession,
  USER_SESSION_DAYS,
} from "./services/userAuthApi";
import AltchaWidget, { type AltchaWidgetHandle } from "./AltchaWidget";

type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  avatar?: string | null;
};

const EMPTY_FORM = {
  email: "",
  password: "",
  displayName: "",
  confirmPassword: "",
};

function parseAuthMode(value: string | null): AuthMode {
  return value === "register" ? "register" : "login";
}

export default function SignInPage() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMode = parseAuthMode(searchParams.get("mode"));
  const returnUrl = getSafeReturnUrl(searchParams.get("returnUrl"));

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [altchaVerified, setAltchaVerified] = useState(false);
  const altchaRef = useRef<AltchaWidgetHandle>(null);

  const formIsValid = validateAuthForm(mode, form) === null;
  const canSubmit = formIsValid && altchaVerified && !loading;

  useEffect(() => {
    setMode(parseAuthMode(searchParams.get("mode")));
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      if (!getStoredUserToken()) {
        if (!cancelled) {
          setCurrentUser(null);
          setCheckingSession(false);
        }
        return;
      }

      const result = await fetchCurrentUser();
      if (cancelled) {
        return;
      }

      setCurrentUser(result.ok ? result.user : null);
      setCheckingSession(false);
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = useCallback(
    (field: keyof typeof EMPTY_FORM, value: string) => {
      setForm((current) => ({ ...current, [field]: value }));
    },
    []
  );

  const switchMode = useCallback(
    (nextMode: AuthMode) => {
      setMode(nextMode);
      setErrorMsg("");
      setShowPassword(false);
      setShowConfirmPassword(false);
      setAltchaVerified(false);
      altchaRef.current?.reset();

      const params = new URLSearchParams(searchParams.toString());
      if (nextMode === "register") {
        params.set("mode", "register");
      } else {
        params.delete("mode");
      }

      const query = params.toString();
      router.replace(query ? `/sign-in?${query}` : "/sign-in", {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");

    const validationError = validateAuthForm(mode, form);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    const payload = buildAuthPayload(mode, form);

    setLoading(true);
    try {
      const altcha = await altchaRef.current?.getPayload();
      if (!altcha) {
        setErrorMsg("Security verification failed. Please try again.");
        setAltchaVerified(false);
        altchaRef.current?.reset();
        return;
      }

      const result =
        mode === "login"
          ? await loginUser({ ...payload, altcha })
          : await registerUser({ ...payload, altcha });

      if (!result.ok || !result.token) {
        setErrorMsg(result.message);
        setAltchaVerified(false);
        altchaRef.current?.reset();
        return;
      }

      saveUserSession(result.token);
      setCurrentUser(result.user);
      setForm(EMPTY_FORM);
      router.replace(returnUrl);
    } catch {
      setAltchaVerified(false);
      altchaRef.current?.reset();
      setErrorMsg(
        mode === "login"
          ? "Sign in failed. Please try again."
          : "Could not create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setForm(EMPTY_FORM);
    setErrorMsg("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setAltchaVerified(false);
    altchaRef.current?.reset();
  };

  const isRegister = mode === "register";
  const title = isRegister ? "Create account" : "Sign in";
  const submitLabel = isRegister ? "Create account" : "Sign in";

  if (checkingSession) {
    return (
      <Stack
        sx={{
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  const isLoggedIn = Boolean(currentUser);

  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        px: 2,
      }}
    >
      <AuthWaveBackground />

      <Box
        component="div"
        sx={{
          zIndex: 1,
          bgcolor: theme.palette.background.paper,
          boxShadow: 6,
          borderRadius: 4,
          px: { xs: 3, sm: 6 },
          py: 2,
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          component="h1"
          sx={{
            textAlign: "center",
            fontSize: 22,
            fontWeight: 700,
            color: theme.palette.primary.main,
            fontFamily: "Namecat",
            letterSpacing: 1.2,
          }}
        >
          {isLoggedIn ? "Your account" : title}
        </Typography>

        {isLoggedIn && currentUser ? (
          <Stack sx={{ gap: 2, alignItems: "center", direction: "ltr" }}>
            <Avatar
              src={currentUser.avatar || undefined}
              alt={currentUser.displayName}
              sx={{ width: 64, height: 64, fontSize: 24 }}
            >
              {currentUser.displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Stack sx={{ textAlign: "center", gap: 0.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {currentUser.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {currentUser.email}
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", textAlign: "center" }}
            >
              You are signed in. Sessions last {USER_SESSION_DAYS} days, then you
              will need to sign in again.
            </Typography>
            <Button
              component={Link}
              href={returnUrl}
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                height: 45,
                fontFamily: "Namecat",
                fontSize: 16,
                letterSpacing: 1.4,
              }}
            >
              Continue
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleLogout}
              sx={{
                height: 45,
                fontFamily: "Namecat",
                fontSize: 16,
                letterSpacing: 1.4,
              }}
            >
              Log out
            </Button>
          </Stack>
        ) : (
          <>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "text.secondary",
                direction: "ltr",
              }}
            >
              {isRegister
                ? "Join Sabeel Kids to comment and support projects."
                : "Welcome back to Sabeel Kids."}
            </Typography>

            <Stack direction="row" sx={{ gap: 1 }}>
              <Button
                fullWidth
                size="small"
                variant={mode === "login" ? "contained" : "outlined"}
                onClick={() => switchMode("login")}
                sx={{ fontFamily: "Namecat", letterSpacing: 1 }}
              >
                Sign in
              </Button>
              <Button
                fullWidth
                size="small"
                variant={mode === "register" ? "contained" : "outlined"}
                onClick={() => switchMode("register")}
                sx={{ fontFamily: "Namecat", letterSpacing: 1 }}
              >
                Create account
              </Button>
            </Stack>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
          {isRegister ? (
            <TextField
              label="Display name"
              variant="outlined"
              fullWidth
              value={form.displayName}
              onChange={(event) =>
                updateField("displayName", event.target.value)
              }
              helperText="Shown when you comment"
              sx={{ direction: "ltr" }}
              slotProps={{
                htmlInput: {
                  autoComplete: "name",
                  spellCheck: false,
                },
              }}
            />
          ) : null}

          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            sx={{ direction: "ltr" }}
            slotProps={{
              htmlInput: {
                autoCapitalize: "off",
                autoComplete: "email",
                spellCheck: false,
              },
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            helperText={isRegister ? "At least 6 characters" : undefined}
            sx={{ direction: "ltr" }}
            slotProps={{
              htmlInput: {
                autoCapitalize: "off",
                autoComplete: isRegister ? "new-password" : "current-password",
                spellCheck: false,
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((current) => !current)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {isRegister ? (
            <TextField
              label="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={form.confirmPassword}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
              sx={{ direction: "ltr" }}
              slotProps={{
                htmlInput: {
                  autoCapitalize: "off",
                  autoComplete: "new-password",
                  spellCheck: false,
                },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        onClick={() =>
                          setShowConfirmPassword((current) => !current)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          ) : null}

          <AltchaWidget
            ref={altchaRef}
            onVerifiedChange={setAltchaVerified}
          />

          {errorMsg ? (
            <Typography
              component="p"
              sx={{
                direction: "ltr",
                fontSize: 14,
                color: "error.main",
                textAlign: "center",
              }}
            >
              {errorMsg}
            </Typography>
          ) : null}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={!canSubmit}
            startIcon={
              loading ? <CircularProgress size={22} color="inherit" /> : null
            }
            sx={{
              mt: 0.5,
              height: 45,
              fontFamily: "Namecat",
              fontSize: 16,
              letterSpacing: 1.4,
            }}
          >
            {loading ? "Please wait..." : submitLabel}
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            direction: "ltr",
          }}
        >
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <Typography
            component="button"
            type="button"
            onClick={() => switchMode(isRegister ? "login" : "register")}
            sx={{
              border: "none",
              bgcolor: "transparent",
              p: 0,
              cursor: "pointer",
              color: "primary.main",
              fontWeight: 600,
              textDecoration: "underline",
              fontSize: "inherit",
              fontFamily: "inherit",
            }}
          >
            {isRegister ? "Sign in" : "Create account"}
          </Typography>
        </Typography>
          </>
        )}

        <Button
          component={Link}
          href="/"
          variant="text"
          color="primary"
          sx={{
            mx: "auto",
            fontFamily: "Namecat",
            letterSpacing: 1,
            direction: "ltr",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <KeyboardBackspaceIcon sx={{ fontSize: 22 }} /> Back to home
        </Button>
      </Box>
    </Stack>
  );
}
