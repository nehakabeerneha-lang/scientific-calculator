"use client";

import * as React from "react";

export type ButtonVariant =
  | "default"
  | "operator"
  | "function"
  | "equals"
  | "clear";

export function Button({
  label,
  onPress,
  variant = "default",
  className = "",
  ariaLabel
}: {
  label: string;
  onPress: (label: string) => void;
  variant?: ButtonVariant;
  className?: string;
  ariaLabel?: string;
}) {
  const base =
    "select-none touch-manipulation rounded-full h-14 sm:h-16 px-4 font-semibold " +
    "transition-transform duration-100 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 " +
    "disabled:opacity-50 disabled:active:scale-100";

  const variants: Record<ButtonVariant, string> = {
    default: "bg-gray-700/80 hover:bg-gray-700 text-gray-50",
    function: "bg-gray-600/80 hover:bg-gray-600 text-gray-50",
    operator: "bg-amber-500 hover:bg-amber-400 text-gray-950",
    equals: "bg-amber-500 hover:bg-amber-400 text-gray-950",
    clear: "bg-red-500/90 hover:bg-red-500 text-gray-950"
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      className={[base, variants[variant], className].join(" ")}
      onClick={() => onPress(label)}
    >
      {label}
    </button>
  );
}

