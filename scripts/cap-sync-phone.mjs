import { execSync } from "node:child_process";

process.env.CAPACITOR_SERVER_URL = "http://localhost:3000/app";
console.log(`Phone WebView will load ${process.env.CAPACITOR_SERVER_URL} via USB`);
execSync("npx cap sync android", { stdio: "inherit", env: process.env });
