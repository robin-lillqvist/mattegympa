"use client";

import { useEffect } from "react";
import type { Stage } from "@/lib/types";

/** Sets data-stage on <body> so global CSS can theme by stage. */
export function StageBody({ stage }: { stage: Stage | null }) {
  useEffect(() => {
    if (stage) document.body.setAttribute("data-stage", stage);
    else document.body.removeAttribute("data-stage");
    return () => {
      document.body.removeAttribute("data-stage");
    };
  }, [stage]);
  return null;
}
