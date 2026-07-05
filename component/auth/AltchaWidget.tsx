"use client";

import { useTheme } from "@mui/material/styles";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import "altcha";
import type { CSSVariables } from "altcha/types";
import type {} from "altcha/types/react";
import { getAltchaChallengeUrl } from "./altchaClient";

type AltchaWidgetElement = HTMLElement & {
  verify: () => Promise<{ payload: string } | null>;
  reset: (newState?: string, err?: string | null) => void;
};

export type AltchaWidgetHandle = {
  getPayload: () => Promise<string | null>;
  reset: () => void;
};

type AltchaWidgetProps = {
  onVerifiedChange?: (verified: boolean) => void;
  style?: CSSProperties;
};

const AltchaWidget = forwardRef<AltchaWidgetHandle, AltchaWidgetProps>(
  function AltchaWidget({ onVerifiedChange, style }, ref) {
    const theme = useTheme();
    const [widgetElement, setWidgetElement] =
      useState<AltchaWidgetElement | null>(null);
    const storedPayloadRef = useRef<string | null>(null);
    const onVerifiedChangeRef = useRef(onVerifiedChange);

    onVerifiedChangeRef.current = onVerifiedChange;

    const widgetStyle = useMemo(
      (): CSSProperties & Partial<CSSVariables> => ({
        display: "block",
        width: "100%",
        "--altcha-color-primary": theme.palette.primary.main,
        "--altcha-color-success": theme.palette.primary.main,
        "--altcha-color-success-content": theme.palette.primary.contrastText,
        "--altcha-spinner-color": theme.palette.primary.main,
        ...style,
      }),
      [style, theme.palette.primary.contrastText, theme.palette.primary.main]
    );

    const setVerified = useCallback((verified: boolean, payload?: string) => {
      storedPayloadRef.current = verified
        ? payload ?? storedPayloadRef.current
        : null;
      onVerifiedChangeRef.current?.(verified);
    }, []);

    useEffect(() => {
      if (!widgetElement) {
        return undefined;
      }

      const handleVerified = (event: Event) => {
        const payload = (event as CustomEvent<{ payload: string }>).detail
          ?.payload;
        if (payload) {
          setVerified(true, payload);
        }
      };

      const handleStateChange = (event: Event) => {
        const detail = (
          event as CustomEvent<{ state: string; payload?: string }>
        ).detail;

        if (detail.state === "verified" && detail.payload) {
          setVerified(true, detail.payload);
          return;
        }

        if (
          detail.state === "expired" ||
          detail.state === "error" ||
          detail.state === "unverified"
        ) {
          setVerified(false);
        }
      };

      widgetElement.addEventListener("verified", handleVerified);
      widgetElement.addEventListener("statechange", handleStateChange);

      return () => {
        widgetElement.removeEventListener("verified", handleVerified);
        widgetElement.removeEventListener("statechange", handleStateChange);
      };
    }, [setVerified, widgetElement]);

    useImperativeHandle(ref, () => ({
      async getPayload() {
        if (storedPayloadRef.current) {
          return storedPayloadRef.current;
        }

        const widget = widgetElement;
        if (!widget) {
          return null;
        }

        try {
          const result = await widget.verify();
          if (result?.payload) {
            storedPayloadRef.current = result.payload;
            onVerifiedChangeRef.current?.(true);
          }
          return result?.payload ?? null;
        } catch {
          return null;
        }
      },
      reset() {
        storedPayloadRef.current = null;
        onVerifiedChangeRef.current?.(false);
        widgetElement?.reset();
      },
    }));

    return (
      <altcha-widget
        ref={(element) => {
          setWidgetElement(element as AltchaWidgetElement | null);
        }}
        challenge={getAltchaChallengeUrl()}
        auto="off"
        name="altcha"
        style={widgetStyle}
      />
    );
  }
);

export default AltchaWidget;
