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

const adb = path.join(
  androidHome,
  "platform-tools",
  os.platform() === "win32" ? "adb.exe" : "adb"
);

function getPhoneTarget() {
  const output = execSync(`"${adb}" devices`, { encoding: "utf8" });
  const target = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.endsWith("\tdevice") || /\sdevice$/.test(line))
    .map((line) => line.split(/\s+/)[0])
    .find((id) => id && id !== "List" && !id.startsWith("emulator-"));

  return target;
}

execSync("node scripts/cap-sync-phone.mjs", {
  stdio: "inherit",
  env: process.env,
});
execSync("node scripts/adb-reverse.mjs", {
  stdio: "inherit",
  env: process.env,
});

const target = getPhoneTarget();
if (!target) {
  throw new Error(
    "No USB phone found. Plug it in, enable USB debugging, tap Allow, then run this again."
  );
}

console.log(`Installing on ${target}`);
execSync(
  `npx cap run android --no-sync --target ${target} --forwardPorts 3000:3000`,
  {
    stdio: "inherit",
    env: process.env,
  }
);
