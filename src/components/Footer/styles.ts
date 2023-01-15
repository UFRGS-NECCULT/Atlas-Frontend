import styled from "styled-components";

import ufrgs from "../../assets/images/ufrgs.png";
import neccult from "../../assets/images/neccult.png";
import minc from "../../assets/images/minc.png";
import ecoCultura from "../../assets/images/ecoCultura.png";

export const Content = styled.div`
  position: absolute;
  background: none repeat scroll 0% 0% #6dbfc9;
  padding: 50px 0px;
  max-width: 100%;
  width: 100%;

  .logo-acesso-footer {
    url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20117%2049%22%20height%3D%2249%22%20width%3D%22117%22%20shape-rendering%3D%22geometricPrecision%22%20text-rendering%3D%22geometricPrecision%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%3C!%5BCDATA%5B.a%20%7Bfont%3A%20normal%20bold%2011px%20Open%20Sans%2C%20sans-serif%3B%7D%5D%5D%3E%3C%2Fstyle%3E%3C%2Fdefs%3E%3Ccircle%20cx%3D%2222%22%20cy%3D%2223%22%20r%3D%2222%22%20fill%3D%22%23f6a800%22%2F%3E%3Cpath%20style%3D%22stroke%3A%23f6a800%3Bstroke-width%3A4%3Bstroke-linejoin%3Around%3B%22%20d%3D%22m%204%2C43%203%2C-6%204%2C3%20z%22%2F%3E%3Ccircle%20r%3D%224.5%22%20cy%3D%2211%22%20cx%3D%2222%22%20fill%3D%22%2300692c%22%2F%3E%3Cg%20fill%3D%22%23fff%22%3E%3Ctext%20x%3D%2248%22%20y%3D%2222%22%3E%3Ctspan%20class%3D%22a%22%20y%3D%2218%22%3EAcesso%20%C3%A0%3C%2Ftspan%3E%3Ctspan%20class%3D%22a%22%20x%3D%2248%22%20y%3D%2231%22%3EInforma%C3%A7%C3%A3o%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3Cpath%20style%3D%22stroke%3A%2300692c%3Bstroke-width%3A9%3Bstroke-linecap%3Around%3B%22%20d%3D%22m%2022%2C23%20v%2013%22%2F%3E%3C%2Fsvg%3E") center no-repeat;
  }

  .logo-ufrgs-footer {
    width: 65px;
    height: 50px;
    background-image: url(${ufrgs});
  }
  .logo-neccult-footer {
    width: 110px;
    height: 50px;
    background-image: url(${neccult});
  }
  .logo-minc-footer {
    width: 110px;
    height: 50px;
    background-image: url(${minc});
  }
  .logo-ecocultura-footer {
    width: 175px;
    height: 55px;
    background-image: url(${ecoCultura});
  }

  .logo-footer {
    float: right;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
    margin: 0px 25px;
  }
`;
