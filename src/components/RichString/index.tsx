import assert from "assert";
import { useSelection } from "hooks/SelectionContext";
import React from "react";
import { richString } from "utils";

export const RichString: React.FC = ({ children: text }) => {
  if (!text) {
    return <span></span>;
  }
  assert(typeof text === "string", "O filho de RichString deve ser um texto");

  // TODO: ocp no useSelection()
  const selection = { ...useSelection(), ocp: 0 };

  return <span>{richString(text, selection).string}</span>;
};
