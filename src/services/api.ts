let flag = true;
export const getData = async (): Promise<{ Ano: number; Valor: number }[]> => {
  const data1 = [
    { Ano: 2007, Valor: 123, ID: 1 },
    { Ano: 2008, Valor: 149, ID: 2 },
    { Ano: 2009, Valor: 156, ID: 3 },
    { Ano: 2010, Valor: 162, ID: 4 },
    { Ano: 2011, Valor: 186, ID: 5 },
    { Ano: 2012, Valor: 195, ID: 6 },
    { Ano: 2013, Valor: 196, ID: 7 },
    { Ano: 2014, Valor: 215, ID: 8 },
    { Ano: 2015, Valor: 215, ID: 9 },
    { Ano: 2016, Valor: 198, ID: 10 }
  ];

  const data2 = [
    { Ano: 2007, Valor: 33, ID: 1 },
    { Ano: 2008, Valor: 155, ID: 2 },
    { Ano: 2009, Valor: 223, ID: 3 },
    { Ano: 2010, Valor: 153, ID: 4 },
    { Ano: 2011, Valor: 666, ID: 5 },
    { Ano: 2012, Valor: 433, ID: 6 },
    { Ano: 2013, Valor: 132, ID: 7 },
    { Ano: 2014, Valor: 215, ID: 8 },
    { Ano: 2015, Valor: 155, ID: 9 },
    { Ano: 2016, Valor: 22, ID: 10 }
  ];

  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      flag = !flag;
      resolve(flag ? data1 : data2);
    }, 2000);
  });
};
