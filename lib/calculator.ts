import { evaluate } from "mathjs";

export function safeEvaluate(expression: string): string {
  try {
    const sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi')
      .replace(/e/g, 'e')
      .replace(/\^/g, '^')
      .replace(/sin/g, 'sin')
      .replace(/cos/g, 'cos')
      .replace(/tan/g, 'tan')
      .replace(/log/g, 'log10')
      .replace(/ln/g, 'log')
      .replace(/√/g, 'sqrt');

    if (!sanitized.trim()) return '0';

    const result = evaluate(sanitized);

    if (typeof result !== 'number' || !isFinite(result)) return 'Error';

    return parseFloat(result.toPrecision(12)).toString();

  } catch {
    return 'Error';
  }
}