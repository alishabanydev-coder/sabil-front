import { execSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

const adb =
  process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT
    ? path.join(
        process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT,
        "platform-tools",
        os.platform() === "win32" ? "adb.exe" : "adb"
      )
    : path.join(
        os.homedir(),
        "AppData",
        "Local",
        "Android",
        "Sdk",
        "platform-tools",
        "adb.exe"
      );

function run(command) {
  execSync(`"${adb}" ${command}`, { stdio: "inherit" });
}

console.log("Checking phone connection...");
run("devices");

console.log("Forwarding ports through USB...");
run("reverse tcp:3000 tcp:3000");
run("reverse tcp:5000 tcp:5000");

console.log("Done. Phone localhost:3000 -> PC:3000, localhost:5000 -> PC:5000");
