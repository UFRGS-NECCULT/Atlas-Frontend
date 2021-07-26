import React, { useEffect } from "react";

const disable = () => {
  const VLibras = (window as any).VLibras;

  if (VLibras && VLibras.element) {
    VLibras.element.classList.remove("enabled");
  }
};

const enable = () => {
  const VLibras = (window as any).VLibras;

  if (VLibras && VLibras.element) {
    VLibras.element.classList.add("enabled");
  }
};

const onDocumentReadyStateChange = () => {
  if (document.readyState === "complete") {
    // HACK: Esperar 200 ms para desabilitar
    setTimeout(disable, 200);
  }
};

export const LibrasDisabler: React.FC = ({ children }) => {
  // Rodar quando este componente for montado
  useEffect(() => {
    document.addEventListener("readystatechange", onDocumentReadyStateChange);
    disable();
  }, []);

  // Rodar quando este componente for desmontado
  useEffect(
    () => () => {
      document.removeEventListener("readystatechange", onDocumentReadyStateChange);
      enable();
    },
    []
  );

  return <>{children}</>;
};
