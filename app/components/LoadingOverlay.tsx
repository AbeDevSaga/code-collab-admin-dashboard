"use client";

import { useLoading } from "@/app/context/LoadingContext";
import Loading from "./Loading";

export default function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return <Loading />;
}