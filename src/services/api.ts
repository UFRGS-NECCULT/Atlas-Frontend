import axios from "axios";
import qs from "query-string";

// let flag = false;
// export const getData = async (): Promise<{ Ano: number; Valor: number; ID: number }[]> => {
//   const data1 = [
//     { Ano: 2007, Valor: 123, ID: 1 },
//     { Ano: 2008, Valor: 231, ID: 1 },
//     { Ano: 2009, Valor: 312, ID: 1 },
//     { Ano: 2010, Valor: 420, ID: 1 },
//     { Ano: 2011, Valor: 230, ID: 1 },
//     { Ano: 2008, Valor: 149, ID: 2 },
//     { Ano: 2009, Valor: 321, ID: 2 },
//     { Ano: 2010, Valor: 650, ID: 2 },
//     { Ano: 2011, Valor: 700, ID: 2 },
//     { Ano: 2012, Valor: 630, ID: 2 },
//     { Ano: 2013, Valor: 650, ID: 2 },
//     { Ano: 2013, Valor: 650, ID: 2 },
//     { Ano: 2013, Valor: 650, ID: 2 },
//     { Ano: 2013, Valor: 650, ID: 2 },
//     { Ano: 2009, Valor: 156, ID: 3 },
//     { Ano: 2010, Valor: 162, ID: 3 },
//     { Ano: 2011, Valor: 186, ID: 3 },
//     { Ano: 2012, Valor: 195, ID: 3 },
//     { Ano: 2013, Valor: 196, ID: 3 },
//     { Ano: 2014, Valor: 215, ID: 3 },
//     { Ano: 2015, Valor: 215, ID: 1 },
//     { Ano: 2016, Valor: 198, ID: 1 }
//   ];

const api = axios.create({
  baseURL: process.env.REACT_APP_API_HOST || "http://localhost:8080/api"
  // baseURL: "http://ec2-18-231-176-22.sa-east-1.compute.amazonaws.com:3333/api"
});

export const getBars = async (eixo = 1, params) => {
  return await api.get(`/eixo/${eixo}/bars?${qs.stringify(params)}`);
};
