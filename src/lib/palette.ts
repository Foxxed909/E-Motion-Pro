"use client";
import { useSyncExternalStore } from "react";

// Global open/close state for the command palette.
let open = false;
const subs = new Set<() => void>();
export const setPaletteOpen = (v: boolean) => {
  open = v;
  subs.forEach((f) => f());
};
export const usePaletteOpen = () =>
  useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => open,
    () => false,
  );
