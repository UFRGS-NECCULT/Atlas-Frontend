import * as d3 from "d3";
import { IEixoConfig } from "hooks/SelectionContext";
import nunjucks from "nunjucks";
import { displayDescriptions, ISelection } from "./displayDescription";

// Local pt-BR
const locale = d3.formatLocale({
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["R$", ""]
});

// Uma formatação básica de números
const standard = locale.format(",.2~f"); // Separador de milhar e no máximo 2 casas decimais

const formatters = {
  none: standard,
  si: locale.format(",.2~s"), // Separador de milhar, duas casas decimais e prefixo do sistema internacional (https://en.wikipedia.org/wiki/Metric_prefix#List_of_SI_prefixes)
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

export function shouldDisplayDescription(
  eixo: number,
  variable: number,
  tab: number,
  value: 1 | 2 | 3,
  selection: ISelection
) {
  if (
    displayDescriptions[eixo] &&
    displayDescriptions[eixo][variable] &&
    displayDescriptions[eixo][variable][tab] &&
    displayDescriptions[eixo][variable][tab][value]
  ) {
    return displayDescriptions[eixo][variable][tab][value](selection) ? true : false;
  }

  return true;
}

interface Selection {
  config: IEixoConfig;
  ano: number;
  eixo: number;
  num: number;
  uf: number;
  cad: number;
  cns: number;
  prc: number;
  tpo: number;
  deg: number;
  ocp: number;
}

/**
 *
 * @param template Template para substituição
 * @returns Objeto contendo a string resultante e um vetor informando quais strings variáveis foram inseridas
 * @example richString("Dados {{ uf if uf else 'do Brasil' }}")
 */
export function richString(template: string, selection: Selection) {
  const { config, uf, cad, ano, deg, prc, tpo, ocp } = selection;

  // Mapa de variáveis no formato "nomeVar" => valorVar
  const variables = {
    uf,
    cad,
    ano,
    deg,
    prc,
    ocp,
    tpo
  };

  // Pegar os dados das variáveis selecionadas para construir o contexto
  const context: any = {};
  for (const varName in variables) {
    const data = config.breadcrumbs.find((b) => b.id === varName)?.options.find((o) => o.id === variables[varName]);

    if (data && data.id !== 0) {
      context[varName] = data;
    }
  }

  // Funções que os templates podem usar
  const renderContext: any = {
    // Recebe um objeto que tenha um pronome possessivo (de, do, da...) no campo 'preposicao',
    // converte esse pronome para indicativo (o, a, ...) e concatena com o campo 'nome'
    indicativo(arg) {
      if (!arg) {
        return null;
      }
      accessed[arg.key] = true;
      const obj = context[arg.key];

      switch (obj.preposicao) {
        case "do":
          return "o " + obj.nome;
        case "da":
          return "a " + obj.nome;
        case "de":
          return obj.nome;
        default:
          throw new Error(`Pronome possessivo "${obj.preposicao}" desconhecido!`);
      }
    }
  };

  // Modificar o contexto para registrar quais variáveis foram acessadas
  const accessed: any = {};
  for (const key in context) {
    accessed[key] = false;

    if (context[key]) {
      renderContext[key] = {
        // Chave para podermos acessar informações "privadas" do objeto
        // nas funções do template
        key,

        id: context[key].id,
        get nome() {
          accessed[key] = true;
          return context[key].nome;
        },
        // Converter para string indica que esse objeto foi inserido no template
        toString() {
          const data = context[key];
          accessed[key] = true;

          if (data.display) {
            return data.display.toString();
          }
          if (data.preposicao && data.nome) {
            return data.preposicao + " " + data.nome;
          }
          if (data.nome) {
            return data.nome.toString();
          }

          throw new Error("nenhum atributo adequado encontrado no objeto");
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
