import { execSync } from "node:child_process";

// Android resolves "localhost" to IPv6 (::1). adb reverse only forwards
// 127.0.0.1, so "localhost" never reaches the PC and Capacitor shows offline.html.
process.env.CAPACITOR_SERVER_URL = "http://127.0.0.1:3000/app";
console.log(`Phone WebView will load ${process.env.CAPACITOR_SERVER_URL} via USB`);
execSync("npx cap sync android", { stdio: "inherit", env: process.env });
