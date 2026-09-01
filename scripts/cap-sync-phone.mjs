import { execSync } from "node:child_process";
import os from "node:os";

function getLanIp() {
  const nets = os.networkInterfaces();

  for (const [name, addresses] of Object.entries(nets)) {
    if (/hotspot|vpn|tun|tap|virtual|vmware|vbox|loopback/i.test(name)) {
      continue;
    }

    for (const net of addresses ?? []) {
      const family = net.family === "IPv4" || net.family === 4;
      if (!family || net.internal) continue;
      if (
        net.address.startsWith("192.168.") ||
        net.address.startsWith("10.")
      ) {
        return net.address;
      }
    }
  }

  return "127.0.0.1";
}

const lanIp = getLanIp();
process.env.CAPACITOR_SERVER_URL = `http://${lanIp}:3000/app`;
console.log(`Phone WebView will load ${process.env.CAPACITOR_SERVER_URL}`);
execSync("npx cap sync android", { stdio: "inherit", env: process.env });
