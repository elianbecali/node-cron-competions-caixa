export type GetLotteryResultGame = "lotofacil" | "megasena"

export interface GetLotteryResultResponse {
  nome: string
  numero_concurso: string
  data_concurso: string
  local_realizacao: string
  acumulou: boolean
  dezenas: string[]
  premiacao: Award[]
  ganhadores: Winner[]
  arrecadacao_total: number
  rateio_processamento: boolean
  data_proximo_concurso: string
  valor_estimado_proximo_concurso: number
  valor_acumulado_especial: number
  valor_acumulado_proximo_concurso: number
  valor_acumulado_proximo_concurso_final_zero_cinco: number
}

export type Award = AwardBase & (AwardRangeOne | AwardRangeTwo | AwardRangeThree | AwardRangeFour | AwardRangeFive)

export interface Winner {
  posicao: number
  ganhadores: number
  municipio: string
  uf: string
}

type AwardBase = {
  numero_ganhadores: number
  valor_premio: number
} 

type AwardRangeOne = {
  faixa: 1
  quantidade_acertos: "15 acertos"
}
type AwardRangeTwo = {
  faixa: 2
  quantidade_acertos: "14 acertos"
}
type AwardRangeThree = {
  faixa: 3
  quantidade_acertos: "13 acertos"
}
type AwardRangeFour = {
  faixa: 4
  quantidade_acertos: "12 acertos"
}
type AwardRangeFive = {
  faixa: 5
  quantidade_acertos: "11 acertos"
}

export type LoginRequestData = {
  email: string
  password: string
}

export type LoginResponseData = {
  token: string
  user: {
    id: string
    name: string
    email: string
    cpf: string
    gender: string
    phone: string
    receiveWhatsapp: boolean
    surname: string
    areaCode: string
    balance: number
    blockedBalance: number
  }
}