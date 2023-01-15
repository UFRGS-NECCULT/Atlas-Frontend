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
    // HACK: Esperar 1 ms para desabilitar (para dar tempo pro script do VLibras acabar de rodar)
    setTimeout(disable, 1);
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

export default LibrasDisabler;
