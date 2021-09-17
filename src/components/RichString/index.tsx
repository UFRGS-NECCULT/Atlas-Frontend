import assert from "assert";
import { useSelection } from "hooks/SelectionContext";
import React from "react";
import { richString } from "utils";

export const RichString: React.FC = ({ children: text }) => {
  if (!text) {
    return <span></span>;
  }
  assert(typeof text === "string", "O filho de RichString deve ser um texto");

  return <span>{richString(text, useSelection()).string}</span>;
};
