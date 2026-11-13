"use client";

import { useContext } from "react";
import {
  ConsentContext,
  type ConsentContextValue,
} from "@/components/shared/(CookieConsent)/ConsentProvider";

/** Read and change the visitor's cookie choice. Must be used inside <ConsentProvider>. */
export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within <ConsentProvider>.");
  }
  return context;
}
