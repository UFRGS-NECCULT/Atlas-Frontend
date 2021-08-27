import * as d3 from "d3";
import { useSelection } from 'hooks/SelectionContext';
import nunjucks from "nunjucks";

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

/**
 *
 * @param template Template para substituição
 * @returns Objeto contendo a string resultante e um vetor informando quais strings variáveis foram inseridas
 * @example richString("Dados {{ uf if uf else 'do Brasil' }}")
 */
 export function richString(template: string) {
  const { config, uf, cad, ano, deg, prc } = useSelection();
  // TODO: ocp no useSelection()
  const ocp = 0;

  // Mapa de variáveis no formato "nomeVar" => valorVar
  const variables = {
    uf,
    cad,
    ano,
    deg,
    prc,
    ocp
  };

  // Pegar os dados das variáveis selecionadas para construir o contexto
  const context: any = {};
  for (const varName in variables) {
    const data = config.breadcrumbs.find((b) => b.id === varName)?.options.find((o) => o.id === variables[varName]);

    if (data && data.id !== 0) {
      context[varName] = data;
    }
  }

  // Modificar o contexto para registrar quais variáveis foram acessadas
  const accessed: any = {};
  const renderContext: any = {};
  for (const key in context) {
    accessed[key] = false;

    if (context[key]) {
      renderContext[key] = {
        get nome() {
          accessed[key] = true;
          return context[key].nome;
        },
        // Converter para string indica que esse objeto foi inserido no template
        toString() {
          const data = context[key];
          accessed[key] = true;
          return (data.display ? data.display : data.nome).toString();
        }
      };
    }
  }

  const str = nunjucks.renderString(template, renderContext);

  // Guarde o nome das variáveis utilizadas
  const used: string[] = [];
  for (const key in accessed) {
    if (accessed[key]) {
      used.push(key);
    }
  }

  const res = {
    string: str,
    used
  };

  return res;
}
