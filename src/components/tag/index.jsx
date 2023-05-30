import React from "react";

export function Tag({ label, className }) {
  return (
    <span
      className={`px-4 py-1 rounded-full bg-gray-200 text-gray-800 font-bold ${className}`}
    >
      {label}
    </span>
  );
}
