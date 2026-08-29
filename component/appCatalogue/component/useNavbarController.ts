import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { isNativeApp } from "@/lib/capacitor/nativeApp";

export function useNavbarController() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => setIsReady(true), 40);
      });
    });

    return () => cancelAnimationFrame(id);
  }, []);

  const handleLogout = () => {
    if (isNativeApp()) {
      void App.exitApp();
      return;
    }

    router.push("/");
  };

  return { router, isReady, handleLogout };
}
