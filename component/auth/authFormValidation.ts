export type AuthMode = "login" | "register";

export type AuthFormValues = {
  email: string;
  password: string;
  displayName: string;
  confirmPassword: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export function validateAuthForm(
  mode: AuthMode,
  values: AuthFormValues
): string | null {
  const email = values.email.trim();
  const password = values.password;
  const displayName = values.displayName.trim();
  const confirmPassword = values.confirmPassword;

  if (mode === "register" && !displayName) {
    return "Display name is required.";
  }

  if (!email) {
    return "Email is required.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "Please enter a valid email address.";
  }

  if (!password) {
    return "Password is required.";
  }

  if (mode === "register" && password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (mode === "register" && password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
}

export function buildAuthPayload(mode: AuthMode, values: AuthFormValues) {
  const email = values.email.trim().toLowerCase();
  const password = values.password;
  const displayName = values.displayName.trim();

  if (mode === "login") {
    return { email, password };
  }

  return { email, password, displayName };
}

export function getSafeReturnUrl(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}
