import { execSync } from "node:child_process";

process.env.CAPACITOR_SERVER_URL = "http://10.0.2.2:3000/app";
execSync("npx cap sync android", { stdio: "inherit", env: process.env });
