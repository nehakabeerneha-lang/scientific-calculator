"use client";

import * as React from "react";
import { safeEvaluate } from "@/lib/calculator";
import { Button } from "@/components/Button";
import { Display } from "@/components/Display";

const OPERATORS = new Set(["+", "−", "×", "÷", "^", "%"]);

function isDigit(label: string) {
  return /^[0-9]$/.test(label);
}

function isOperator(label: string) {
  return OPERATORS.has(label);
}

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

  const onPress = React.useCallback(
    (label: string) => {
      if (label === "AC") {
        setInput("");
        setResult("0");
        setEvaluated(false);
        setHistory([]);
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
        const next = nextBase + label;

        // If we were evaluated and user presses an operator, continue from result.
        if (evaluated && isOperator(label) && !prev) {
          return result + label;
        }

        return next;
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

  const body =
    "w-full max-w-sm sm:max-w-md rounded-[2rem] bg-gray-800 shadow-2xl shadow-black/40 p-4 sm:p-5";

  return (
    <section className={body}>
      <Display expression={input} history={history} result={result} />

      <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
        {/* Row 1 */}
        <Button label="sin(" variant="function" onPress={onPress} />
        <Button label="cos(" variant="function" onPress={onPress} />
        <Button label="tan(" variant="function" onPress={onPress} />
        <Button label="sqrt(" variant="function" onPress={onPress} />

        {/* Row 2 */}
        <Button label="^" variant="operator" onPress={onPress} />
        <Button label="log(" variant="function" onPress={onPress} />
        <Button label="π" variant="function" onPress={onPress} />
        <Button label="e" variant="function" onPress={onPress} />

        {/* Row 3 */}
        <Button label="(" variant="function" onPress={onPress} />
        <Button label=")" variant="function" onPress={onPress} />
        <Button label="%" variant="operator" onPress={onPress} />
        <Button label="AC" variant="clear" onPress={onPress} />

        {/* Row 4 */}
        <Button label="7" onPress={onPress} />
        <Button label="8" onPress={onPress} />
        <Button label="9" onPress={onPress} />
        <Button label="÷" variant="operator" onPress={onPress} />

        {/* Row 5 */}
        <Button label="4" onPress={onPress} />
        <Button label="5" onPress={onPress} />
        <Button label="6" onPress={onPress} />
        <Button label="×" variant="operator" onPress={onPress} />

        {/* Row 6 */}
        <Button label="1" onPress={onPress} />
        <Button label="2" onPress={onPress} />
        <Button label="3" onPress={onPress} />
        <Button label="−" variant="operator" onPress={onPress} />

        {/* Row 7 */}
        <Button label="0" className="col-span-2" onPress={onPress} />
        <Button label="." onPress={onPress} />
        <Button label="+" variant="operator" onPress={onPress} />

        {/* Row 8 */}
        <Button label="⌫" variant="function" onPress={onPress} ariaLabel="Backspace" />
        <Button label="=" variant="equals" className="col-span-3" onPress={onPress} />
      </div>
    </section>
  );
}

