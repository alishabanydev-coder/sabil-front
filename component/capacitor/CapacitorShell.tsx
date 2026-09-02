"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Network } from "@capacitor/network";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import NativeConnectionErrorScreen from "./NativeConnectionErrorScreen";
import NativeAppBackButton from "./NativeAppBackButton";
import { useAppDisplayMode } from "@/lib/useAppDisplayMode";

export default function CapacitorShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOffline, setIsOffline] = useState(false);
  const displayMode = useAppDisplayMode();
  const splashHiddenRef = useRef(false);

  const isUsbDevServer = useCallback(() => {
    const hostname = window.location.hostname;
    return hostname === "localhost" || hostname === "127.0.0.1";
  }, []);

  const canReachDevServer = useCallback(async () => {
    try {
      const response = await fetch(window.location.href, {
        method: "GET",
        cache: "no-store",
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  const checkConnection = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    try {
      const status = await Network.getStatus();
      if (status.connected) {
        setIsOffline(false);
        return true;
      }
    } catch {
      // Fall through. Production still shows the offline screen below.
    }

    // USB live-reload uses localhost, which Android does not count as "online".
    // Production loads sabeelkids.com, so a real offline user still sees this screen.
    if (isUsbDevServer()) {
      const reachable = await canReachDevServer();
      setIsOffline(!reachable);
      return reachable;
    }

    setIsOffline(true);
    return false;
  }, [canReachDevServer, isUsbDevServer]);

  const handleRetry = useCallback(async () => {
    const isConnected = await checkConnection();

    if (isConnected) {
      window.location.reload();
      return true;
    }

    return false;
  }, [checkConnection]);

  useLayoutEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    if (displayMode === "pending" || splashHiddenRef.current) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        splashHiddenRef.current = true;
        void SplashScreen.hide();
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [displayMode]);

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
      void checkConnection();
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
        console.log('no capcitor')
      }

      const rehideSystemUi = () => {
        if (Capacitor.getPlatform() !== "android") {
          return;
        }
        void StatusBar.hide();
      };

      document.addEventListener("visibilitychange", rehideSystemUi);
      window.addEventListener("focus", rehideSystemUi);

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
            if (status.connected) {
              setIsOffline(false);
              return;
            }
            void checkConnection();
          }
        );
      } catch {
        console.log('error in the Browser to load')
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
      <NativeAppBackButton />
      {isOffline ? (
        <NativeConnectionErrorScreen onRetry={handleRetry} />
      ) : null}
    </>
  );
}
