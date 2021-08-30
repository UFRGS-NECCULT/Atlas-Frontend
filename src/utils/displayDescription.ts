export interface ISelection {
  uf: number;
  cad: number;
  deg: number;
}

// Conjunto de funções que diz se um valor deve ser mostrado no DataInfo
// Primeiro índice é o eixo, o segundo a variável, o terceiro a aba do DataInfo (1 ou 2),
// e o quarto é 1, 2 ou 3, para representar cada um dos 3 números mostrados no DataInfo.
// Um retorno de false ou 0 indica que o número deve ser escondido.
interface IDisplayDescriptions {
  [eixo: number]: {
    [variable: number]: {
      [tab: number]: {
        [number: number]: (s: ISelection) => boolean | number;
      };
    };
  };
}

export const displayDescriptions: IDisplayDescriptions = {
  1: {
    1: {
      1: {
        3: (s) => s.uf && (s.cad || s.deg)
      }
    },
    4: {
      1: {
        1: (s) => !s.deg,
        2: (s) => !s.deg,
        3: (s) => s.uf && s.cad && !s.deg
      }
    },
    5: {
      1: {
        1: (s) => !s.deg,
        2: (s) => !s.deg,
        3: (s) => s.uf && s.cad && !s.deg
      }
    }
  }
};
