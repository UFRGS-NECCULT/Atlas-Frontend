import assert from "assert";
import { useSelection } from "hooks/SelectionContext";
import React from "react";

const description = (desc: string, context): string => {
  return desc
    .replace(/\[uf\]/gi, context.uf || "")
    .replace(/\[cad\]/gi, context.cad || "")
    .replace(/\[ano\]/gi, context.ano || "")
    .replace(/\[deg\]/gi, context.deg || "")
    .replace(/\[ocp]/gi, context.ocp || "")
    .replace(/\[prc\]/gi, context.prc || "")
    .replace(/ {2,}/, " "); // Remover espaços consecutivos
};

export const RichString: React.FC = ({ children: text }) => {
  const { config, uf, cad, ano, deg, prc } = useSelection();
  // TODO: ocp no useSelection()
  const ocp = 0;

  if (!text) {
    return <span></span>;
  }
  assert(typeof text === "string", "O filho de RichString deve ser um texto");

  const ufData = config.breadcrumbs.find((b) => b.id === "uf")?.options.find((o) => o.id === uf);
  const cadData = config.breadcrumbs.find((b) => b.id === "cad")?.options.find((o) => o.id === cad);
  const anoData = config.breadcrumbs.find((b) => b.id === "ano")?.options.find((o) => o.id === ano);
  const degData = config.breadcrumbs.find((b) => b.id === "deg")?.options.find((o) => o.id === deg);
  const ocpData = config.breadcrumbs.find((b) => b.id === "ocp")?.options.find((o) => o.id === ocp);
  const prcData = config.breadcrumbs.find((b) => b.id === "prc")?.options.find((o) => o.id === prc);

  const context: any = {};

  if (ufData && ufData.id !== 0) {
    context.uf = ufData.display ? ufData.display : ufData.nome;
  }
  if (cadData && cadData.id !== 0) {
    context.cad = "no setor " + (cadData.display ? cadData.display : cadData.nome);
  }
  if (anoData) {
    context.ano = anoData.display ? anoData.display : anoData.nome;
  }
  if (degData && degData.id !== 0) {
    context.deg = degData.display ? degData.display : degData.nome;
  }
  if (ocpData) {
    context.ocp = ocpData.display ? ocpData.display : ocpData.nome;
  }
  if (prcData) {
    context.prc = prcData.display ? prcData.display : prcData.nome;
  }

  return <span>{description(text, context)}</span>;
};
