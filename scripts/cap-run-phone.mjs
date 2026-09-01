import { execSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

const javaHome =
  process.env.JAVA_HOME ||
  "C:\\Program Files\\Android\\Android Studio\\jbr";
const androidHome =
  process.env.ANDROID_HOME ||
  path.join(os.homedir(), "AppData", "Local", "Android", "Sdk");

process.env.JAVA_HOME = javaHome;
process.env.ANDROID_HOME = androidHome;
process.env.Path = [
  path.join(javaHome, "bin"),
  path.join(androidHome, "platform-tools"),
  process.env.Path || "",
].join(path.delimiter);

execSync("node scripts/cap-sync-phone.mjs", {
  stdio: "inherit",
  env: process.env,
});
execSync("node scripts/adb-reverse.mjs", {
  stdio: "inherit",
  env: process.env,
});
execSync("npx cap run android --no-sync --forwardPorts 3000:3000", {
  stdio: "inherit",
  env: process.env,
});
