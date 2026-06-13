"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";

export default function CapacitorShell({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    document.documentElement.classList.add("native-app");

    const setupNativeShell = async () => {
      try {
        if (Capacitor.getPlatform() === "android") {
          await StatusBar.setOverlaysWebView({ overlay: true });
          await StatusBar.hide();
        } else {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: "#12041f" });
        }
      } catch {
        // Native plugins are unavailable outside the Capacitor shell.
      }

      const rehideSystemUi = () => {
        if (Capacitor.getPlatform() !== "android") {
          return;
        }
        void StatusBar.hide();
      };

      document.addEventListener("visibilitychange", rehideSystemUi);
      window.addEventListener("focus", rehideSystemUi);

      try {
        await SplashScreen.hide();
      } catch {
        // Keep the app usable if splash dismissal fails.
      }

      return () => {
        document.removeEventListener("visibilitychange", rehideSystemUi);
        window.removeEventListener("focus", rehideSystemUi);
      };
    };

    let cleanupSystemUi: (() => void) | undefined;

    const runSetup = async () => {
      cleanupSystemUi = await setupNativeShell();
    };

    if (document.readyState === "complete") {
      void runSetup();
    } else {
      window.addEventListener("load", () => void runSetup(), {
        once: true,
      });
    }

    return () => {
      cleanupSystemUi?.();
      document.documentElement.classList.remove("native-app");
    };
  }, []);

  return <>{children}</>;
}
