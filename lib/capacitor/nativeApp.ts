"use client";

import { useSyncExternalStore } from "react";
import { Capacitor } from "@capacitor/core";

function subscribe() {
  return () => {};
}

function getNativeSnapshot() {
  return Capacitor.isNativePlatform();
}

function getServerNativeSnapshot() {
  return false;
}

/** Use in effects/handlers only. For render, use useNativeApp(). */
export function isNativeApp() {
  return Capacitor.isNativePlatform();
}

export function useNativeApp() {
  return useSyncExternalStore(
    subscribe,
    getNativeSnapshot,
    getServerNativeSnapshot
  );
}

export function getNativePlatform() {
  return Capacitor.getPlatform();
}
