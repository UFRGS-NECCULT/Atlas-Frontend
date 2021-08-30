import { IDescriptions } from "hooks/DataContext";

export const descriptions: IDescriptions = [
  {
    1: [
      [
        "EMPRESAS {{ 'DO SETOR ' + cad if cad else 'CULTURAIS E CRIATIVAS' }} {{ 'DE PORTE ' + deg.nome if deg }} {{ uf or 'NO BRASIL' }}",
        "DO TOTAL DE EMPRESAS DOS SETORES CULTURAIS E CRIATIVOS {{ 'DE PORTE ' + deg.nome if (deg and cad) }} {{ uf if (uf and (cad or deg)) else 'DO BRASIL' }}",
        "DO TOTAL DE EMPRESAS {{ 'DO SETOR ' + cad if cad else 'DOS SETORES CULTURAIS E CRIATIVOS' }} {{ 'DE PORTE ' + deg.nome if deg }} DO BRASIL"
      ]
    ],
    2: [["DO TOTAL DE EMPRESAS {{ uf or 'DO BRASIL' }}"]],
    3: [
      [
        "DE VARIAÇÃO NO TOTAL DE EMPRESAS {{ 'DO SETOR ' + cad if cad else 'CULTURAIS E CRIATIVAS' }} {{ 'DE PORTE ' + deg.nome if deg }} {{ uf or 'DO BRASIL' }} EM {{ ano }}"
      ]
    ],
    4: [
      [
        "DE RECEITA TOTAL BRUTA DAS EMPRESAS {{ 'DO SETOR ' + cad if cad else 'CULTURAIS E CRIATIVAS' }} {{ uf or 'NO BRASIL' }}",
        "DO TOTAL DE RECEITA BRUTA DAS EMPRESAS CULTURAIS E CRIATIVAS {{ uf if (uf and cad) else 'DO BRASIL' }}",
        "DO TOTAL DE RECEITA BRUTA DAS EMPRESAS {{ 'DO SETOR ' + cad if cad }} DO BRASIL"
      ]
    ],
    5: [
      [
        "DE RECEITA OPERACIONAL LÍQUIDA DAS EMPRESAS {{ 'DO SETOR ' + cad if cad else 'CULTURAIS E CRIATIVAS' }} {{ uf or 'NO BRASIL' }}",
        "DO TOTAL DE RECEITA OPERACIONAL LÍQUIDA DAS EMPRESAS CULTURAIS E CRIATIVAS {{ uf if (uf and cad) else 'DO BRASIL' }}",
        "DO TOTAL DE RECEITA OPERACIONAL LÍQUIDA DAS EMPRESAS {{ 'DO SETOR ' + cad if cad }} DO BRASIL"
      ]
    ],
    6: [
      [
        "DE CUSTO DAS EMPRESAS {{ 'DO SETOR ' + cad if cad else 'CULTURAIS E CRIATIVAS' }} {{ uf or 'NO BRASIL' }}",
        "DO TOTAL DE CUSTO DAS EMPRESAS CULTURAIS E CRIATIVAS {{ uf if (uf and cad) else 'DO BRASIL' }}",
        "DO TOTAL DE CUSTO DAS EMPRESAS {{ 'DO SETOR ' + cad if cad }} DO BRASIL"
      ]
    ],
    7: [
      [
        "DE LUCRO DAS EMPRESAS {{ 'DO SETOR ' + cad if cad else 'CULTURAIS E CRIATIVAS' }} {{ uf or 'NO BRASIL' }}",
        "DO TOTAL DE LUCRO DAS EMPRESAS CULTURAIS E CRIATIVAS {{ uf if (uf and cad) else 'DO BRASIL' }}",
        "DO TOTAL DE LUCRO DAS EMPRESAS {{ 'DO SETOR ' + cad if cad }} DO BRASIL"
      ]
    ],
    8: [
      [
        "VALOR ADICIONADO PELAS EMPRESAS {{ 'DO SETOR ' + cad if cad else 'CULTURAIS E CRIATIVAS' }} {{ uf or 'NO BRASIL' }}",
        "DO TOTAL DE VALOR ADICIONADO DAS EMPRESAS CULTURAIS E CRIATIVAS {{ uf if (uf and cad) else 'DO BRASIL'}}",
        "DO TOTAL DE VALOR ADICIONADO DAS EMPRESAS {{ 'DO SETOR ' + cad if cad }} DO BRASIL"
      ]
    ],
    9: [
      [
        "DE VALOR ADICIONADO/PIB {{ uf or 'DO BRASIL' }} PELAS EMPRESAS {{ 'DO SETOR ' + cad if cad else 'CULTURAIS E CRIATIVAS' }} {{ uf or 'DO BRASIL' }}"
      ]
    ],
    10: [["IHH DO TOTAL DE EMPRESAS POR UF", "IHH DO TOTAL DE EMPRESAS POR SETOR"]],
    11: [["IHH DO VALOR ADICIONADO POR UF", "IHH DO VALOR ADICIONADO POR SETOR"]],
    12: [["C4 DE CONCENTRAÇÃO DO TOTAL DE EMPRESAS POR UF", "C4 DE CONCENTRAÇÃO DO TOTAL DE EMPRESAS POR SETOR"]],
    13: [["C4 DE CONCENTRAÇÃO DO VALOR ADICIONADO POR UF", "C4 DE CONCENTRAÇÃO DO VALOR ADICIONADO POR SETOR"]]
  },
  {
    1: [
      [
        "TRABALHADORES {{ 'NO SETOR ' + cad if cad else 'NOS SETORES CULTURAIS E CRIATIVOS' }} {{ deg }} {{ uf or 'DO BRASIL'}}",
        "DO TOTAL DE TRABALHADORES {{ 'DO SETOR ' + cad if (cad and deg) else 'DOS SETORES CULTURAIS E CRIATIVOS' }} {{ uf if (uf and (cad or deg)) else 'DO BRASIL' }}",
        "DO TOTAL DE TRABALHADORES {{ 'DO SETOR ' + cad if cad else 'DOS SETORES CULTURAIS E CRIATIVOS' }} {{ uf if (uf and cad and deg) else 'DO BRASIL' }}"
      ],
      [
        "OCUPADOS {{ ocp if ocp else 'EM ATIVIDADES CULTURAIS E CRIATIVAS' }} {{ deg }} {{ uf if (uf and (not deg or ocp)) 'DO BRASIL' }}",
        "DO TOTAL DE OCUPADOS {{ ocp if (ocp and not(uf and deg)) else 'EM ATIVIDADES CULTURAIS E CRIATIVAS' }} {{ uf if (uf and deg and ocp) else 'DO BRASIL'}}",
        "DO TOTAL DE OCUPADOS EM ATIVIDADES CULTURAIS E CRIATIVAS DO BRASIL"
      ]
    ],
    2: [
      [
        "DE PARTICIPAÇÃO DO EMPREGO {{ 'NO SETOR ' + cad if cad else 'NOS SETORES CULTURAIS E CRIATIVOS' }} NO EMPREGO TOTAL"
      ],
      ["DE PARTICIPAÇÃO DOS OCUPADOS {{ ocp if ocp else 'EM ATIVIDADES CULTURAIS E CRIATIVAS' }} NO EMPREGO TOTAL"]
    ],
    4: [
      [
        "DE REMUNERAÇÃO MÉDIA DOS TRABALHADORES {{ deg }} {{ 'DO SETOR ' + cad if cad else 'DOS SETORES CULTURAIS E CRIATIVOS' }} {{ uf or 'DO BRASIL' }}"
      ],
      ["DE REMUNERAÇÃO MÉDIA DOS OCUPADOS {{deg }} {{ ocp }} {{ uf or 'DO BRASIL' }}"]
    ],
    5: [
      [
        "POR HORA TRABALHADA {{ 'NO SETOR ' + cad if cad else 'NOS SETORES CULTURAIS E CRIATIVOS' }} {{ deg }} {{ uf or 'DO BRASIL' }}"
      ],
      ["POR HORA TRABALHADA [ocp] {{ deg }} {{ uf if (uf and (not deg or ocp)) else 'DO BRASIL' }}"]
    ],
    6: [
      [
        "HORAS SEMANAIS MÉDIAS DE TRABALHO {{ deg }} {{ 'NO SETOR ' + cad if cad else 'NOS SETORES CULTURAIS E CRIATIVOS' }} {{ uf or 'DO BRASIL' }}"
      ],
      ["HORAS SEMANAIS MÉDIAS DE TRABALHO {{ deg }} {{ ocp }} {{ uf or 'NO BRASIL' }}"]
    ],
    7: [
      [
        "",
        "DA SOMA DE REMUNERAÇÕES PAGAS AOS TRABALHADORES {{ 'DO SETOR ' + cad if (cad and uf and deg) else 'DOS SETORES CULTURAIS E CRIATIVOS' }} {{ uf if (uf and (cad or deg)) else 'DO BRASIL' }}"
      ],
      [
        "",
        "DA SOMA DE REMUNERAÇÕES PAGAS AOS OCUPADOS {{ ocp if ocp else 'EM ATIVIDADES CULTURAIS E CRIATIVAS' }} {{ uf if (uf and (cad or deg)) else 'DO BRASIL' }}"
      ]
    ],
    9: [
      [
        "DE RAZÃO ENTRE MASSA SALARIAL E VALOR ADICIONADO {{ 'NO SETOR ' + cad if cad else 'EM SETORES CULTURAIS E CRIATIVOS' }} {{ uf }}"
      ]
    ],
    11: [
      [
        "DE INCIDÊNCIA DOS SALÁRIOS SOBRE OS CUSTOS DOS EMPREENDIMENTOS {{ 'NO SETOR ' + cad if cad else 'NOS SETORES CULTURAIS' }} E CRIATIVOS {{ uf or 'DO BRASIL' }}"
      ]
    ],
    12: [
      ["CONCENTRAÇÃO DO EMPREGO POR UF", "CONCENTRAÇÃO DO EMPREGO POR SETOR"],
      ["CONCENTRAÇÃO DO EMPREGO POR ATIVIDADES RELACIONADAS", "CONCENTRAÇÃO DO EMPREGO POR ATIVIDADES CULTURAIS"]
    ],
    13: [
      ["CONCENTRAÇÃO DE MASSA SALARIAL POR UF", "CONCENTRAÇÃO DE MASSA SALARIAL POR SETOR"],
      [
        "CONCENTRAÇÃO DE MASSA SALARIAL POR ATIVIDADES RELACIONADAS",
        "CONCENTRAÇÃO DE MASSA SALARIAL POR ATIVIDADES CULTURAIS"
      ]
    ],
    14: [
      ["IHH DE NÚMERO DOS TRABALHADORES POR UF", "IHH DE NÚMERO DOS TRABALHADORES POR SETOR"],
      [
        "IHH DE NÚMERO DOS TRABALHADORES POR ATIVIDADES RELACIONADAS",
        "IHH DE NÚMERO DOS TRABALHADORES POR ATIVIDADES CULTURAIS"
      ]
    ],
    15: [
      ["IHH DA MASSA DE RENDIMENTOS POR UF", "IHH DA MASSA DE RENDIMENTOS POR SETOR"],
      [
        "IHH DA MASSA DE RENDIMENTOS POR ATIVIDADES RELACIONADAS",
        "IHH DA MASSA DE RENDIMENTOS POR ATIVIDADES CULTURAIS"
      ]
    ]
  },
  {
    1: [
      [
        "FINANCIAMENTO À CULTURA {{ mec }} {{ 'AO SETOR ' + cad if cad }} {{ uf or 'NO BRASIL' }}",
        "DO TOTAL DO FINANCIAMENTO À CULTURA {{ mec }} {{ uf if (uf and cad) else 'NO BRASIL' }}"
      ]
    ],
    18: [
      [
        "CONSUMIDOS COM CARTÃO VALE-CULTURA {{ 'NO SETOR ' + cad if cad }} {{ uf or 'NO BRASIL' }}",
        "TOTAL CONSUMIDO {{ 'NO SETOR ' + cad if cad }} DESDE O INÍCIO DO PROGRAMA (2013-2017) {{ uf or 'NO BRASIL' }}"
      ],
      [
        "CONSUMIDOS VIA CARTÃO VALE-CULTURA {{ 'EM LOJAS DO SETOR ' + cad + ' POR TRABALHADORES CADASTRADOS' if cad }} {{ uf or 'NO BRASIL' }}",
        "TOTAL CONSUMIDO {{ 'EM LOJAS DO SETOR ' + cad + ' POR TRABALHADORES CADASTRADOS' if cad }} DESDE O INÍCIO DO PROGRAMA (2013-2017) {{ uf or 'NO BRASIL' }}"
      ]
    ],
    19: [
      [
        "RECEBEDORAS HABILITADAS {{ 'DO SETOR ' + cad if cad }} NO VALE-CULTURA {{ ano }} {{ uf or 'NO BRASIL' }}",
        "RECEBEDORAS HABILITADAS {{ 'DO SETOR ' + cad + ' CADASTRADAS' if cad }} DESDE O INÍCIO DO PROGRAMA (2013-2017) {{ uf or 'NO BRASIL' }}"
      ],
      [
        "TRABALHADORES CADASTRADOS NO PROGRAMA VALE-CULTURA {{ uf or 'NO BRASIL' }}",
        "TRABALHADORES CADASTRADOS DESDE O INÍCIO DO PROGRAMA (2013-2017) {{ uf or 'NO BRASIL' }}"
      ]
    ],
    3: [
      [
        "FINANCIAMENTO {{ 'AO SETOR ' + cad if (cad and (mec or uf or mod) and not(uf and mod)) else 'À CULTURA' }} {{ mec if mec else 'VIA' }} BNDES {{ 'POR MODALIDADE ' + mod if mod }} {{ uf or 'NO BRASIL' }}",
        "DO TOTAL DO FINANCIAMENTO {{ 'AO SETOR ' + cad if cad else 'À CULTURA' }} {{ mec if mec else 'VIA' }} {{ 'POR MODADALIDADE ' + mod if mod }} BNDES {{ uf if (uf and (mod or cad)) else 'NO BRASIL' }}"
      ]
    ],
    4: [
      [
        "FINANCIAMENTO {{ 'AO SETOR ' + cad if cad else 'À CULTURA' }} VIA MECENATO ADVINDO {{ 'DE ' + pfj if pfj else 'DA ESFERA PRIVADA' }} {{ uf or 'NO BRASIL' }}",
        "DO TOTAL DO FINANCIAMENTO À CULTURA VIA MECENATO ADVINDO {{ 'DE ' + pfj if pfj else 'DA ESFERA PRIVADA' }} {{ uf if (uf and (cad or pfj)) else 'NO BRASIL' }}"
      ]
    ],
    5: [
      [
        "FINANCIAMENTO {{ 'AO SETOR ' + cad if cad else 'À CULTURA' }} VIA MECENATO ADVINDO DE EMPRESA ESTATAL {{ uf or 'NO BRASIL' }}",
        "DO TOTAL DO FINANCIAMENTO À CULTURA VIA MECENATO DE PARA EMPRESA ESTATAL {{ uf if (uf and cad) else 'NO BRASIL' }}"
      ]
    ],
    7: [["DE APOIO PRIVADO NO TOTAL APOIADO VIA MECENATO {{ uf or 'NO BRASIL' }}"]],
    8: [
      [
        "RAZÃO ENTRE FINANCIAMENTO {{ mec }} {{ uf or 'NO BRASIL' }} {{ 'PARA O SETOR ' + uf if (uf and mec and cad) }} E VALOR ADICIONADO {{ 'PELO SETOR ' + cad else 'PELOS SETORES CULTURAIS E CRIATIVOS' }} {{ uf or 'NO BRASIL' }}"
      ]
    ],
    9: [
      [
        "RAZÃO ENTRE FINANCIAMENTO {{ mec }} {{ uf or 'NO BRASIL' }} E MASSA SALARIAL DOS TRABALHADORES CULTURAIS {{ 'PELO SETOR ' + cad if cad }} {{ uf if (uf and (cad or not mec)) else 'NO BRASIL' }}"
      ]
    ],
    10: [
      [
        "DE DESPESA DO MINISTÉRIO DA CULTURA EM RELAÇÃO AO TOTAL DE ARRECADAÇÃO FEDERAL",
        "DO TOTAL DE FINANCIAMENTO FEDERAL VIA FNC E MECENATO EM RELAÇÃO AO TOTAL DE ARREDACAÇÃO FEDERAL"
      ]
    ],
    11: [
      [
        "PROJETOS PROPOSTOS PARA CAPTAÇÃO VIA MECENATO {{ 'DO SETOR ' + cad if cad }} {{ uf or 'NO BRASIL' }}",
        "DO TOTAL DE PROJETOS PROPOSTOS PARA CAPTAÇÃO {{ 'DO SETOR ' + cad if (cad and not uf) }} VIA MECENATO {{ uf if (uf and cad and mec) else 'NO BRASIL' }}"
      ]
    ],
    12: [
      [
        "PROJETOS APROVADOS PARA CAPTAÇÃO VIA MECENATO {{ 'DO SETOR ' + cad if cad }} {{ uf or 'NO BRASIL' }}",
        "DO TOTAL DE PROJETOS APROVADOS PARA CAPTAÇÃO VIA MECENATO NO {{ uf if (uf and mec and cad) else 'NO BRASIL' }}"
      ]
    ],
    13: [["DIAS PARA APROVAÇÃO DE PROJETOS {{ 'DO SETOR ' + cad if cad }} VIA MECENATO {{ uf or 'NO BRASIL'}}"]],
    14: [
      [
        "RAZÃO ENTRE VALOR SOLICITADO E VALOR APROVADO DOS PROJETOS APOIADOS {{ 'DO SETOR ' + cad if cad }} VIA MECENATO {{ uf or 'NO BRASIL' }}"
      ]
    ],
    15: [["CONCENTRAÇÃO DO FINANCIAMENTO {{ mec }} POR UF", "CONCENTRAÇÃO DO FINANCIAMENTO {{ mec }} POR SETOR"]],
    16: [["IHH DOS PROJETOS FOMENTADOS {{ mec }} POR UF", "IHH DOS PROJETOS FOMENTADOS {{ mec }} POR SETOR"]],
    17: [["FINANCIADOS POR MEIO DE {{ 'EDITAIS ESTADUAIS' if mec else 'MECENATO ESTADUAL' }} {{ uf or 'NO BRASIL' }}"]]
  },
  {
    1: [
      [
        `{% if tpo.id === 1 %}    DE VALOR EXPORTADO {{ uf or 'DO BRASIL' }} PARA {{ prc }} {{ cad }}
        {% elseif tpo.id === 2 %} DE VALOR IMPORTADO {{ prc }} PARA {{ uf.nome if uf else 'BRASIL' }} {{ cad }}
        {% elseif tpo.id === 3 %} DE SALDO COMERCIAL ENTRE {{ uf.nome if uf else 'BRASIL' }} E {{ prc }}
        {% elseif tpo.id === 4 %} DE CORRENTE DE COMÉRCIO ENTRE {{ uf.nome if uf else 'BRASIL' }} E {{ prc }}
        {% endif %}`,

        `{% if tpo.id === 1 %}    DO VALOR EXPORTADO {{ uf }}
        {% elseif tpo.id === 2 %} DO VALOR IMPORTADO PARA {{ uf.nome if uf else 'BRASIL' }}
        {% elseif tpo.id === 4 %} DA CORRENTE DE COMÉRCIO DO BRASIL
        {% endif %}`
      ],
      [
        `{% if tpo.id === 1 %}    DE VALOR EXPORTADO {{ uf or 'DO BRASIL' }} PARA {{ prc }} {{ cad }}
        {% elseif tpo.id === 2 %} DE VALOR IMPORTADO {{ prc }} PARA O BRASIL {{ cad }}
        {% elseif tpo.id === 3 %} DE SALDO COMERCIAL ENTRE {{ uf.nome }} E {{ prc }}
        {% elseif tpo.id === 4%}  DE CORRENTE DE COMÉRCIO {{ uf }} E {{ prc }}
        {% endif %}`,

        `{% if tpo.id === 1 %}    DO VALOR EXPORTADO PELO BRASIL PARA {{ prc }}
        {% elseif tpo.id === 2 %} DO VALOR IMPORTADO PELO BRASIL {{ prc }}
        {% elseif tpo.id === 4 %} DA CORRENTE DE COMÉRCIO ENTRE BRASIL E {{ prc }}
        {% endif %}`
      ]
    ],
    2: [
      [
        `DE PARTICIPAÇÃO
        {% if tpo.id === 1 %}     NO VALOR IMPORTADO {{ uf }} PARA {{ prc }} {{ cad }}
        {% elseif tpo.id === 2 %} NO VALOR EXPORTADO {{ prc }} PARA {{ uf.nome if uf else 'BRASIL' }} {{ cad }}
        {% elseif tpo.id === 4 %} NA CORRENTE DE COMÉRCIO ENTRE {{ uf.nome if uf else 'BRASIL' }} E {{ prc }} {{ cad }}
        {% endif %}`
      ],
      [
        `DE PARTICIPAÇÃO
        {% if tpo.id === 1 %}     NO VALOR IMPORTADO {{ uf }} PARA {{ prc }} {{ cad }}
        {% elseif tpo.id === 2 %} NO VALOR EXPORTADO {{ prc }} PARA {{ uf.nome if uf else 'BRASIL' }} {{ cad }}
        {% elseif tpo.id === 4 %} NA CORRENTE DE COMÉRCIO ENTRE ENTRE {{ uf.nome if uf else 'BRASIL' }} E {{ prc }} {{ cad }}
        {% endif %}`
      ]
    ],
    3: [
      [
        `{% if tpo.id === 1 %} DE PARTICIPAÇÃO DO VALOR EXPORTADO {{ prc }} PARA {{ uf.nome }}
        {% if tpo.id === 2 %}  DE PARTICIPAÇÃO DO VALOR IMPORTADO {{ prc }} PARA {{ uf.nome }}
        {% if tpo.id === 4 %}  DA CORRENTE DE COMÉRCIO ENTRE {{ uf.nome }} E {{ prc }}
        {% endif %}
        {{ cad }} NO VALOR ADICIONADO`
      ],
      [
        `{% if tpo.id === 1 %} DE PARTICIPAÇÃO DO VALOR EXPORTADO {{ prc }} PARA {{ uf.nome }}
        {% if tpo.id === 2 %}  DE PARTICIPAÇÃO DO VALOR IMPORTADO {{ prc }} PARA {{ uf.nome }}
        {% if tpo.id === 4 %}  DA CORRENTE DE COMÉRCIO ENTRE {{ uf.nome }} E {{ prc }}
        {% endif %}
        {{ cad }} NO VALOR ADICIONADO`
      ]
    ],
    5: [["C2 VALOR ABSOLUTO POR PARCEIROS", "C4 VALOR ABSOLUTO POR UF", "C4 VALOR ABSOLUTO POR SETORES"]],
    8: [
      ["IHH VALOR ABSOLUTO POR PARCEIROS", "IHH VALOR ABSOLUTO POR UF", "IHH VALOR ABSOLUTO POR SETOR"],
      ["IHH VALOR ABSOLUTO POR PARCEIROS", "IHH VALOR ABSOLUTO POR UF", "IHH VALOR ABSOLUTO POR SETOR"]
    ],
    11: [["ÍNDICE DE QUANTUM DO VALOR ABSOLUTO DAS {{ tpo }}"], ["ÍNDICE DE QUANTUM DO VALOR ABSOLUTO DAS {{ tpo }}"]],
    12: [["ÍNDICE DE PREÇOS DO VALOR ABSOLUTO DAS {{ tpo }}"], ["ÍNDICE DE PREÇOS DO VALOR ABSOLUTO DAS {{ tpo }}"]],
    13: [
      [
        `{% if tpo.id === 1 %}    EXPORTADOS {{ uf }} PARA {{ prc }} {{ cad }}
        {% elseif tpo.id === 2 %} IMPORTADOS {{ prc }} PARA {{ uf.nome if uf else 'BRASIL' }} {{ cad }}
        {% elseif tpo.id === 3 %} DE SALDO COMERCIAL ENTRE {{ uf.nome if uf else 'BRASIL' }} {{ cad }}
        {% elseif tpo.id === 4 %} {{ uf }} E {{ prc }} {{ cad }}
        {% endif %}`,

        `DOS KG
        {% if tpo.id === 1 %} EXPORTADOS {{ uf }}
        {% if tpo.id === 2 %} IMPORTADOS PARA {{ uf.nome if uf else 'BRASIL' }}
        {% if tpo.id === 4 %} TRANSACIONADOS ENTRE {{ uf.nome if uf else 'BRASIL' }} E O MUNDO
        {% endif %}`
      ],
      [
        `{% if tpo.id === 1 %} EXPORTADOS {{ uf }} PARA {{ prc }} {{ cad }}
        {% if tpo.id === 2 %}  IMPORTDADOS {{ prc }} PARA {{ uf.nome if uf else 'BRASIL' }} {{ cad }}
        {% if tpo.id === 3 %}  DE SALDO COMERCIAL ENTRE {{ uf.nome uf uf else 'BRASIL' }} e {{ prc }} {{ cad }}
        {% if tpo.id === 4 %}  {{ uf or 'DO BRASIL' }} com {{ prc }} {{ cad }}
        {% endif %}
        `,
        `DOS KG
        {% if tpo.id === 1 %} EXPORTADOS PELO BRASIL PARA {{ prc }}
        {% if tpo.id === 2 %} IMPORTADOS PELO BRASIL {{ prc }}
        {% if tpo.id === 4 %} TRANSACIONADOS ENTRE BRASIL E {{ prc }} {{ cad }}
        {% endif %}`
      ]
    ],
    14: [["DE RENTABILIDADE DAS EXPORTAÇÕES {{ cad }}"], ["DE RENTABILIDADE DAS EXPORTAÇÕES {{ cad }}"]]
  }
];
