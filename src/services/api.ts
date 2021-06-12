let flag = true;
export const getData = async (): Promise<{ Ano: number; Valor: number }[]> => {
  const data1 = [
    { Ano: 2007, Valor: 123 },
    { Ano: 2008, Valor: 149 },
    { Ano: 2009, Valor: 156 },
    { Ano: 2010, Valor: 162 },
    { Ano: 2011, Valor: 186 },
    { Ano: 2012, Valor: 195 },
    { Ano: 2013, Valor: 196 },
    { Ano: 2014, Valor: 215 },
    { Ano: 2015, Valor: 215 },
    { Ano: 2016, Valor: 198 }
  ];

  const data2 = [
    { Ano: 2007, Valor: 33 },
    { Ano: 2008, Valor: 155 },
    { Ano: 2009, Valor: 223 },
    { Ano: 2010, Valor: 153 },
    { Ano: 2011, Valor: 666 },
    { Ano: 2012, Valor: 433 },
    { Ano: 2013, Valor: 132 },
    { Ano: 2014, Valor: 215 },
    { Ano: 2015, Valor: 155 },
    { Ano: 2016, Valor: 22 }
  ];

  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      flag = !flag;
      resolve(flag ? data1 : data2);
    }, 2000);
  });
};
