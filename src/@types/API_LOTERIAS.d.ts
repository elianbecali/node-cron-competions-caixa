declare interface GetResultadoLoteria {
  nome: string
  numero_concurso: string
  data_concurso: string
  local_realizacao: string
  acumulou: boolean
  dezenas: string[]
  premiacao: Premiacao[]
  ganhadores: Ganhadore[]
  arrecadacao_total: number
  rateio_processamento: boolean
  data_proximo_concurso: string
  valor_estimado_proximo_concurso: number
  valor_acumulado_especial: number
  valor_acumulado_proximo_concurso: number
  valor_acumulado_proximo_concurso_final_zero_cinco: number
}

export interface Premiacao {
  faixa: number
  numero_ganhadores: number
  valor_premio: number
  quantidade_acertos: string
}

export interface Ganhadore {
  posicao: number
  ganhadores: number
  municipio: string
  uf: string
}
