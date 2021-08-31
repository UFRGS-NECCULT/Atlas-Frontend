export interface ISelection {
  uf: number;
  cad: number;
  deg: number;
  ocp: number;
  mec: number;
  pfj: number;
  tpo: number;
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
  // Eixo 1
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
    },
    6: {
      1: {
        1: (s) => !s.deg,
        2: (s) => !s.deg,
        3: (s) => s.uf && s.cad && !s.deg
      }
    },
    7: {
      1: {
        1: (s) => !s.deg,
        2: (s) => !s.deg,
        3: (s) => s.uf && s.cad && !s.deg
      }
    },
    8: {
      1: {
        1: (s) => !s.deg,
        2: (s) => !s.deg,
        3: (s) => s.uf && s.cad
      }
    },
    9: {
      1: {
        1: (s) => !s.deg
      }
    },
    10: {
      1: {
        1: (s) => !s.uf && !s.cad && !s.uf,
        2: (s) => !s.uf && !s.cad && !s.uf
      }
    },
    11: {
      1: {
        1: (s) => !s.uf && !s.cad && !s.uf,
        2: (s) => !s.uf && !s.cad && !s.uf
      }
    },
    12: {
      1: {
        1: (s) => !s.uf && !s.cad && !s.uf,
        2: (s) => !s.uf && !s.cad && !s.uf
      }
    },
    13: {
      1: {
        1: (s) => !s.uf && !s.cad && !s.uf,
        2: (s) => !s.uf && !s.cad && !s.uf
      }
    }
  },
  // Eixo 2
  2: {
    1: {
      1: {
        3: (s) => s.uf && (s.deg || s.cad)
      },
      2: {
        3: (s) => s.uf && s.ocp
      }
    },
    4: {
      2: {
        1: (s) => s.deg || s.ocp
      }
    },
    5: {
      2: {
        1: (s) => (s.uf && s.deg) || s.ocp
      }
    },
    6: {
      2: {
        1: (s) => s.ocp
      }
    },
    9: {
      1: {
        1: (s) => !s.deg
      }
    },
    11: {
      1: {
        1: (s) => !s.deg
      }
    },
    12: {
      1: {
        1: (s) => !s.deg && !s.uf && !s.cad,
        2: (s) => !s.deg && !s.uf && !s.cad
      },
      2: {
        1: (s) => !s.deg && !s.uf && !s.ocp,
        2: (s) => !s.deg && !s.uf && !s.ocp
      }
    },
    13: {
      1: {
        1: (s) => !s.deg && !s.uf && !s.cad,
        2: (s) => !s.deg && !s.uf && !s.cad
      },
      2: {
        1: (s) => !s.deg && !s.uf && !s.ocp,
        2: (s) => !s.deg && !s.uf && !s.ocp
      }
    },
    14: {
      1: {
        1: (s) => !s.deg && !s.uf && !s.cad,
        2: (s) => !s.deg && !s.uf && !s.cad
      },
      2: {
        1: (s) => !s.deg && !s.uf && !s.ocp,
        2: (s) => !s.deg && !s.uf && !s.ocp
      }
    },
    15: {
      1: {
        1: (s) => !s.deg && !s.uf && !s.cad,
        2: (s) => !s.deg && !s.uf && !s.cad
      },
      2: {
        1: (s) => !s.deg && !s.uf && !s.ocp,
        2: (s) => !s.deg && !s.uf && !s.ocp
      }
    }
  },
  // Eixo 3
  3: {
    5: {
      1: {
        1: (s) => !s.pfj,
        2: (s) => !s.pfj
      }
    },
    7: {
      1: {
        1: (s) => s.mec
      }
    },
    10: {
      1: {
        1: (s) => !s.uf && !s.cad && !s.mec,
        2: (s) => !s.uf && !s.cad && !s.mec
      }
    },
    11: {
      1: {
        1: (s) => s.mec,
        2: (s) => s.mec
      }
    },
    12: {
      1: {
        1: (s) => s.mec,
        2: (s) => s.mec
      }
    },
    13: {
      1: {
        1: (s) => s.mec
      }
    },
    14: {
      1: {
        1: (s) => s.mec
      }
    },
    15: {
      1: {
        1: (s) => !s.uf && !s.cad,
        2: (s) => !s.uf && !s.cad
      }
    },
    16: {
      1: {
        1: (s) => !s.uf && !s.cad,
        2: (s) => !s.uf && !s.cad
      }
    },
    18: {
      1: {
        1: (s) => !s.mec,
        2: (s) => !s.mec
      },
      2: {
        1: (s) => !s.mec,
        2: (s) => !s.mec
      }
    },
    19: {
      1: {
        1: (s) => !s.mec,
        2: (s) => !s.mec
      },
      2: {
        1: (s) => !s.mec && !s.cad,
        2: (s) => !s.mec && !s.cad
      }
    }
  },
  // Eixo 4
  4: {
    1: {
      1: {
        2: (s) => s.tpo !== 3
      },
      2: {
        2: (s) => s.tpo !== 3
      }
    },
    2: {
      1: {
        1: (s) => s.tpo !== 3
      },
      2: {
        1: (s) => s.tpo !== 3
      }
    },
    3: {
      1: {
        1: (s) => s.tpo !== 3
      },
      2: {
        1: (s) => s.tpo !== 3
      }
    },
    11: {
      1: {
        1: (s) => s.tpo === 1 || s.tpo === 2
      },
      2: {
        1: (s) => s.tpo === 1 || s.tpo === 2
      }
    },
    12: {
      1: {
        1: (s) => s.tpo === 1 || s.tpo === 2
      },
      2: {
        1: (s) => s.tpo === 1 || s.tpo === 2
      }
    },
    13: {
      1: {
        2: (s) => s.tpo !== 3
      },
      2: {
        2: (s) => s.tpo !== 3
      }
    },
    14: {
      1: {
        1: (s) => s.tpo === 1
      },
      2: {
        1: (s) => s.tpo === 1
      }
    }
  }
};
