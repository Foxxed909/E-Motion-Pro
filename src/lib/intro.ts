"use client";
import { useSyncExternalStore } from "react";

// Tiny global store: has the landing intro (preloader) finished?
let done = false;
const subs = new Set<() => void>();
export const setIntroDone = () => {
  if (done) return;
  done = true;
  subs.forEach((f) => f());
};
const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};
export const useIntroDone = () => useSyncExternalStore(subscribe, () => done, () => false);
