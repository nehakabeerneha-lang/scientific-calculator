"use client";

import * as React from "react";
import { safeEvaluate } from "@/lib/calculator";
import { Button } from "@/components/Button";
import { Display } from "@/components/Display";

const OPERATORS = new Set(["+", "−", "×", "÷", "^", "%"]);

function isDigit(label: string) { return /^[0-9]$/.test(label); }
function isOperator(label: string) { return OPERATORS.has(label); }
function shouldStartFresh(evaluated: boolean, label: string) {
  return evaluated && (isDigit(label) || label === ".");
}
function normalizeKeyToLabel(key: string): string | null {
  if (/^[0-9]$/.test(key)) return key;
  if (key === ".") return ".";
  if (key === "+") return "+";
  if (key === "-") return "−";
  if (key === "*") return "×";
  if (key === "/") return "÷";
  if (key === "^") return "^";
  if (key === "%") return "%";
  if (key === "(") return "(";
  if (key === ")") return ")";
  if (key === "Enter") return "=";
  if (key === "Backspace" || key === "Delete") return "⌫";
  if (key === "Escape") return "AC";
  return null;
}

export function Calculator() {
  const [input, setInput] = React.useState("");
  const [result, setResult] = React.useState("0");
  const [evaluated, setEvaluated] = React.useState(false);
  const [history, setHistory] = React.useState<string[]>([]);
  const [mode, setMode] = React.useState<"basic" | "scientific">("basic");

  const onPress = React.useCallback(
    (label: string) => {
      if (label === "AC") {
        setInput(""); setResult("0");
        setEvaluated(false); setHistory([]);
        return;
      }
      if (label === "⌫") {
        setInput((prev) => prev.slice(0, -1));
        setEvaluated(false);
        return;
      }
      if (label === "=") {
        const expr = input.trim();
        if (!expr) return;
        const out = safeEvaluate(expr);
        setHistory((prev) => [`${expr} = ${out}`, ...prev].slice(0, 20));
        setResult(out);
        setInput(out === "Error" ? "" : out);
        setEvaluated(true);
        return;
      }
      setInput((prev) => {
        const nextBase = shouldStartFresh(evaluated, label) ? "" : prev;
        if (evaluated && isOperator(label) && !prev) return result + label;
        return nextBase + label;
      });
      setEvaluated(false);
    },
    [evaluated, input, result]
  );

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const label = normalizeKeyToLabel(e.key);
      if (!label) return;
      e.preventDefault();
      onPress(label);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onPress]);

  return (
    <section style={{
      width: "100%",
      maxWidth: "420px",
      borderRadius: "2rem",
      background: "linear-gradient(145deg, #831843, #4a0020)",
      boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      padding: "1.25rem",
    }}>

      {/* ── Mode Switcher ── */}
      <div style={{
        display: "flex",
        background: "rgba(0,0,0,0.3)",
        borderRadius: "1rem",
        padding: "4px",
        marginBottom: "12px",
        gap: "4px"
      }}>
        <button
          onClick={() => setMode("basic")}
          style={{
            flex: 1, padding: "10px", borderRadius: "12px", border: "none",
            cursor: "pointer", fontWeight: 600, fontSize: "15px",
            background: mode === "basic"
              ? "linear-gradient(135deg, #f9a8d4, #fbbf24)"
              : "transparent",
            color: mode === "basic" ? "#831843" : "#f9a8d4",
            transition: "all 0.2s"
          }}
        >
          Basic
        </button>
        <button
          onClick={() => setMode("scientific")}
          style={{
            flex: 1, padding: "10px", borderRadius: "12px", border: "none",
            cursor: "pointer", fontWeight: 600, fontSize: "15px",
            background: mode === "scientific"
              ? "linear-gradient(135deg, #f9a8d4, #fbbf24)"
              : "transparent",
            color: mode === "scientific" ? "#831843" : "#f9a8d4",
            transition: "all 0.2s"
          }}
        >
          Scientific
        </button>
      </div>

      <Display expression={input} history={history} result={result} />

      <div style={{
        marginTop: "12px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "8px"
      }}>

        {/* ── Scientific only buttons ── */}
        {mode === "scientific" && (
          <>
            <CalcBtn label="sin(" color="fn" onPress={onPress} />
            <CalcBtn label="cos(" color="fn" onPress={onPress} />
            <CalcBtn label="tan(" color="fn" onPress={onPress} />
            <CalcBtn label="sqrt(" color="fn" onPress={onPress} />

            <CalcBtn label="^" color="op" onPress={onPress} />
            <CalcBtn label="log(" color="fn" onPress={onPress} />
            <CalcBtn label="π" color="fn" onPress={onPress} />
            <CalcBtn label="e" color="fn" onPress={onPress} />

            <CalcBtn label="(" color="fn" onPress={onPress} />
            <CalcBtn label=")" color="fn" onPress={onPress} />
            <CalcBtn label="%" color="op" onPress={onPress} />
            <CalcBtn label="AC" color="clear" onPress={onPress} />
          </>
        )}

        {/* ── Basic only buttons ── */}
        {mode === "basic" && (
          <>
            <CalcBtn label="AC" color="clear" span={3} onPress={onPress} />
            <CalcBtn label="%" color="op" onPress={onPress} />
          </>
        )}

        {/* ── Shared rows ── */}
        <CalcBtn label="7" color="num" onPress={onPress} />
        <CalcBtn label="8" color="num" onPress={onPress} />
        <CalcBtn label="9" color="num" onPress={onPress} />
        <CalcBtn label="÷" color="op" onPress={onPress} />

        <CalcBtn label="4" color="num" onPress={onPress} />
        <CalcBtn label="5" color="num" onPress={onPress} />
        <CalcBtn label="6" color="num" onPress={onPress} />
        <CalcBtn label="×" color="op" onPress={onPress} />

        <CalcBtn label="1" color="num" onPress={onPress} />
        <CalcBtn label="2" color="num" onPress={onPress} />
        <CalcBtn label="3" color="num" onPress={onPress} />
        <CalcBtn label="−" color="op" onPress={onPress} />

        <CalcBtn label="0" color="num" span={2} onPress={onPress} />
        <CalcBtn label="." color="num" onPress={onPress} />
        <CalcBtn label="+" color="op" onPress={onPress} />

        <CalcBtn label="⌫" color="fn" onPress={onPress} />
        <CalcBtn label="=" color="eq" span={3} onPress={onPress} />
      </div>
    </section>
  );
}

function CalcBtn({
  label, color, span = 1, onPress
}: {
  label: string;
  color: "num" | "op" | "fn" | "eq" | "clear";
  span?: number;
  onPress: (l: string) => void;
}) {
  const bg: Record<string, string> = {
    num: "rgba(255,255,255,0.08)",
    op:  "linear-gradient(135deg, #fbbf24, #f59e0b)",
    fn:  "rgba(249,168,212,0.15)",
    eq:  "linear-gradient(135deg, #f9a8d4, #fbbf24)",
    clear: "#be123c",
  };
  const col: Record<string, string> = {
    num: "#fce7f3",
    op:  "#831843",
    fn:  "#f9a8d4",
    eq:  "#831843",
    clear: "#fff",
  };

  return (
    <button
      onClick={() => onPress(label)}
      style={{
        gridColumn: span > 1 ? `span ${span}` : undefined,
        background: bg[color],
        color: col[color],
        border: "none",
        borderRadius: "14px",
        minHeight: "56px",
        fontSize: "1.1rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "opacity 0.15s, transform 0.1s",
      }}
      onMouseDown={e => (e.currentTarget.style.transform = "scale(0.94)")}
      onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
    >
      {label}
    </button>
  );
}