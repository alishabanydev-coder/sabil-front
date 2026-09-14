import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl =
  process.env.CAPACITOR_SERVER_URL || "https://sabeelkids.sabeelgroup.org/app";

const config: CapacitorConfig = {
  appId: "com.sabeelkids.app",
  appName: "Sabeel Kids",
  webDir: "capacitor-www",
  server: {
    url: serverUrl,
    cleartext: serverUrl.startsWith("http://"),
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: "#12041f",
      showSpinner: false,
    },
    StatusBar: {
      backgroundColor: "#12041f",
      style: "DARK",
      overlaysWebView: true,
    },
  },
};

export default config;
