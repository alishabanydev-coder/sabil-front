"use client";

import { useCallback, useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Network } from "@capacitor/network";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import NativeConnectionErrorScreen from "./NativeConnectionErrorScreen";

export default function CapacitorShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOffline, setIsOffline] = useState(false);

  const checkConnection = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    try {
      const status = await Network.getStatus();
      setIsOffline(!status.connected);
      return status.connected;
    } catch {
      const browserOnline =
        typeof navigator !== "undefined" ? navigator.onLine : true;
      setIsOffline(!browserOnline);
      return browserOnline;
    }
  }, []);

  const handleRetry = useCallback(async () => {
    const isConnected = await checkConnection();

    if (isConnected) {
      window.location.reload();
      return true;
    }

    return false;
  }, [checkConnection]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    document.documentElement.classList.add("native-app");

    let networkListener: { remove: () => Promise<void> } | undefined;
    let cleanupSystemUi: (() => void) | undefined;

    const onBrowserOnline = () => {
      setIsOffline(false);
    };
    const onBrowserOffline = () => {
      setIsOffline(true);
    };

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

    const setupNetworkWatch = async () => {
      await checkConnection();

      try {
        networkListener = await Network.addListener(
          "networkStatusChange",
          (status) => {
            setIsOffline(!status.connected);
          }
        );
      } catch {
        // Fall back to browser events when the Network plugin is unavailable.
      }

      window.addEventListener("online", onBrowserOnline);
      window.addEventListener("offline", onBrowserOffline);
    };

    const runSetup = async () => {
      cleanupSystemUi = await setupNativeShell();
      await setupNetworkWatch();
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
      void networkListener?.remove();
      window.removeEventListener("online", onBrowserOnline);
      window.removeEventListener("offline", onBrowserOffline);
      document.documentElement.classList.remove("native-app");
    };
  }, [checkConnection]);

  return (
    <>
      {children}
      {isOffline ? (
        <NativeConnectionErrorScreen onRetry={handleRetry} />
      ) : null}
    </>
  );
}
