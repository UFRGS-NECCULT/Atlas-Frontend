import React, { useRef, useEffect } from "react";

interface IProps {
  data?: { Ano: number; Valor: number; ID: number }[];
}

const LineChart = ({ data }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (data && data.length && d3Container.current) {
      const marginLeft = 30;
      const marginTop = 20;
      const marginBottom = 20;

      const width = d3Container.current.clientWidth - marginLeft;
      const height = d3Container.current.clientHeight - marginTop - marginBottom;

      /*
        Implementação do gráfico de Linhas com d3.js
      */

      const keys: string[] = data.map((d) => d.Ano.toString());
      const values = data.map((d) => d.Valor);
      const ids = data.map((d) => d.ID);
    }
  }, [data, d3Container.current]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
};

export default LineChart;
