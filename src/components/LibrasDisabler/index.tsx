import React, { useEffect } from "react";

export const LibrasDisabler: React.FC = ({ children }) => {
  const VLibras = (window as any).VLibras;

  // Rodar quando este componente for montado
  useEffect(() => {
    if (VLibras && VLibras.element) {
      VLibras.element.classList.remove("enabled");
    }
  }, []);

  // Rodar quando este componente for desmontado
  useEffect(() => {
    return () => {
      if (VLibras && VLibras.element) {
          VLibras.element.classList.add("enabled");
      }
    };
  }, []);

  return <>{children}</>;
};
