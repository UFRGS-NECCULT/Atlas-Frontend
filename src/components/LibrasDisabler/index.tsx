import React, { useEffect } from "react";

export const LibrasDisabler: React.FC = ({ children }) => {

  // Rodar quando este componente for montado
  useEffect(() => {
    const VLibras = (window as any).VLibras;

    if (VLibras && VLibras.element) {
      VLibras.element.classList.remove("enabled");
    }
  }, []);

  // Rodar quando este componente for desmontado
  useEffect(() => {
    return () => {
      const VLibras = (window as any).VLibras;

      if (VLibras && VLibras.element) {
          VLibras.element.classList.add("enabled");
      }
    };
  }, []);

  return <>{children}</>;
};
