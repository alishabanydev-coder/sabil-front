import { execSync } from "node:child_process";

process.env.CAPACITOR_SERVER_URL = "http://localhost:3000/app";
execSync("npx cap sync android", { stdio: "inherit", env: process.env });
