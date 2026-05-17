"use client";

import { useEffect, useState } from "react";

export function useIsMobile(breakpoint: number = 640): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

export function abbreviateName(name: string, maxLen: number = 8): string {
  if (name.length <= maxLen) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return `${parts[0]} ${parts[1][0]}.`;
  }
  return `${name.slice(0, maxLen - 1)}…`;
}
