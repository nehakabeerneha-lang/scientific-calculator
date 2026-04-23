"use client";

import * as React from "react";

function sizeClassForResult(result: string) {
  const len = result.length;
  if (len <= 10) return "text-5xl";
  if (len <= 14) return "text-4xl";
  if (len <= 18) return "text-3xl";
  return "text-2xl";
}

export function Display({
  expression,
  history,
  result
}: {
  expression: string;
  history: string[];
  result: string;
}) {
  const lastHistory = history.slice(0, 2).reverse();
  const sizeClass = React.useMemo(() => sizeClassForResult(result), [result]);

  return (
    <div className="rounded-3xl bg-black/20 px-4 py-4 sm:px-5 sm:py-5">
      <div className="min-h-[1.25rem] text-right text-xs text-gray-300/80 space-y-1">
        {lastHistory.length > 0 ? (
          lastHistory.map((h, i) => (
            <div key={i} className="truncate">
              {h}
            </div>
          ))
        ) : (
          <div className="opacity-0">.</div>
        )}
      </div>

      <div className="mt-2 min-h-[1.75rem] text-right text-sm text-gray-200/90 truncate">
        {expression || " "}
      </div>

      <div
        className={[
          "mt-2 text-right font-semibold leading-none tabular-nums",
          sizeClass,
          "transition-all duration-200"
        ].join(" ")}
      >
        {result}
      </div>
    </div>
  );
}

