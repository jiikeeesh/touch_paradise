"use client";

import { useEffect } from "react";
import { logout } from "@/app/actions/auth";

export default function SessionManager() {
  useEffect(() => {
    // Check if the page was reloaded
    const entries = window.performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    
    if (entries.length > 0 && entries[0].type === "reload") {
      console.log("Page refresh detected, logging out...");
      logout();
    }
  }, []);

  return null;
}
