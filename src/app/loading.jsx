import React from "react";
import { CgSpinner } from "react-icons/cg";

export default function Loading() {
  return (
    <main className="flex items-center justify-center h-screen bg-white min-w-screen">
      <CgSpinner className="animate-spin text-6xl text-blue-500" />
    </main>
  );
}
