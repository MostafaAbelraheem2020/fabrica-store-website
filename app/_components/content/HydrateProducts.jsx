"use client";
import { HydrationBoundary } from "@tanstack/react-query";

export default function HydrateProducts({ state, children }) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
