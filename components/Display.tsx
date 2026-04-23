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
  expression, history, result
}: {
  expression: string;
  history: string[];
  result: string;
}) {
  const lastHistory = history.slice(0, 2).reverse();
  const sizeClass = React.useMemo(() => sizeClassForResult(result), [result]);

  return (
    <div style={{
      borderRadius: "1.25rem",
      background: "rgba(0,0,0,0.3)",
      padding: "12px 16px",
    }}>
      <div style={{
        textAlign: "right", fontSize: "11px",
        color: "rgba(249,168,212,0.6)", minHeight: "16px"
      }}>
        {lastHistory.map((h, i) => (
          <div key={i} style={{overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{h}</div>
        ))}
      </div>

      <div style={{
        textAlign: "right", fontSize: "13px",
        color: "rgba(249,168,212,0.85)", marginTop: "4px",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
      }}>
        {expression || " "}
      </div>

      <div style={{
        textAlign: "right", fontWeight: 700,
        color: "#fbbf24", marginTop: "4px",
        fontSize: sizeClass === "text-5xl" ? "3rem"
               : sizeClass === "text-4xl" ? "2.25rem"
               : sizeClass === "text-3xl" ? "1.875rem" : "1.5rem"
      }}>
        {result}
      </div>
    </div>
  );
}
