import { getApiBase } from "@/lib/apiBase";

export function getAltchaChallengeUrl() {
  return `${getApiBase()}/api/auth/altcha/challenge`;
}
