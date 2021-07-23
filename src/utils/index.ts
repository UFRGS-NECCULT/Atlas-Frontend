import * as d3 from "d3";

// Local pt-BR
const locale = d3.formatLocale({
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["R$", ""]
});

// Uma formatação básica de números
const standard = locale.format(".2~f"); // No máximo 2 casas decimais

const formatters = {
  none: standard,
  si: locale.format(".2~s"),
  real: locale.format("$,.2f"), // Prefixo de dinheiro, separador de milhar, 2 casas decimais
  percent: locale.format(".2%"), // 2 casas decimais, multiplicar por 100
  kilograms: (n) => standard(n) + "kg" // Número normal + kg
};

export function formatter(type: string): (n: number) => string {
  const formatter = formatters[type];

  if (!formatter) {
    throw new Error(`Formatter para "${type}" não encontrado!`);
  }

  return formatter;
}

export function format(value: number, type: string): string {
  const f = formatter(type);
  return f(value);
}
