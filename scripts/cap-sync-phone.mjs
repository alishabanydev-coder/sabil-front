import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// Android resolves "localhost" to IPv6 (::1). adb reverse only forwards
// 127.0.0.1, so "localhost" never reaches the PC and Capacitor shows offline.html.
const serverUrl = "http://127.0.0.1:3000/app";
process.env.CAPACITOR_SERVER_URL = serverUrl;
console.log(`Phone WebView will load ${serverUrl} via USB`);
execSync("npx cap sync android", { stdio: "inherit", env: process.env });

// The offline page's Try again button otherwise opens production, which the
// phone cannot reach over the USB tunnel.
const offlinePath = path.join(
  "android",
  "app",
  "src",
  "main",
  "assets",
  "public",
  "offline.html"
);
const offlineHtml = fs.readFileSync(offlinePath, "utf8");
const patchedOfflineHtml = offlineHtml.replace(
  /var APP_URL = ".*?";/,
  `var APP_URL = "${serverUrl}";`
);
if (patchedOfflineHtml === offlineHtml) {
  throw new Error(
    "Could not point the phone offline page at the USB dev server."
  );
}
fs.writeFileSync(offlinePath, patchedOfflineHtml);
