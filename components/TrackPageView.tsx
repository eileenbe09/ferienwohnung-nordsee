"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TrackPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    let isVisitor = false;
    try {
      if (!sessionStorage.getItem("tracked")) {
        sessionStorage.setItem("tracked", "1");
        isVisitor = true;
      }
    } catch {
      return;
    }

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, is_visitor: isVisitor }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
