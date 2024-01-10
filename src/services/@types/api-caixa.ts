export interface GETJogosInfoCaixaResponse {
  versao: string
  payload: Payload
}

type Modalidade = "LOTOFACIL" | "MEGA_SENA"

interface Payload {
  valorMinimoCarrinho: number
  quantidadeMaximaApostasCarrinho: number
  parametros: Parametro[]
}

export interface Parametro {
  parametroJogo: ParametroJogo
  proximoConcurso?: ProximoConcurso
}

export interface ParametroJogo {
  concurso: Concurso
  situacaoConcursoCanal: string
  probabilidadeDeGanhar: number
  aceitaEspelho?: boolean
  prognosticoMaximo?: number
  quantidadeMinima?: number
  quantidadeMaxima?: number
  teimosinhas?: number[]
  quantidadeSurpresinhas?: number
  valoresAposta: ValoresAposum[]
  trevos?: Trevos
  concursoDisponivelSimulacao: boolean
  concursoCanalAberto: boolean
  equipes?: Equipe[]
  partidas?: Partida[]
  legendas?: any[]
  valorApostaMinima?: number
  meses?: Mese[]
}

export interface Concurso {
  modalidade: Modalidade
  modalidadeDetalhada: ModalidadeDetalhada
  tipoConcurso: string
  numero: number
  dataFechamento: string
  dataAbertura: string
  dataHoraSorteio: string
  dataSorteio: string
  valorApostaMinima: number
  situacao: string
  bloqueado: boolean
  estimativa: number
  aberto: boolean
  naoInicializado: boolean
  dataFinalBloqueio?: string
}

export interface ModalidadeDetalhada {
  valor: number
  descricao: string
  descricaoEspecial: string
}

export interface ValoresAposum {
  valor: number
  numeroPrognosticos?: number
  numeroTrevos?: number
  quantidadeDuplos?: number
  quantidadeTriplos?: number
}

export interface Trevos {
  prognosticoMaximoTrevo: number
  quantidadeMinimaTrevo: number
  quantidadeMaximaTrevo: number
}

export interface Equipe {
  indicadorSelecao: boolean
  nome: string
  numero: number
  numeroPais: number
  descricaoCurta: string
  uf: string
  nomeClass: string
}

export interface Partida {
  numero: number
  equipe1: Equipe1
  equipe2: Equipe2
}

export interface Equipe1 {
  indicadorSelecao: boolean
  nome: string
  numero: number
  pais: string
  uf: string
  nomeClass: string
}

export interface Equipe2 {
  indicadorSelecao: boolean
  nome: string
  numero: number
  pais: string
  uf: string
  nomeClass: string
}

export interface Mese {
  numero: number
  nome: string
  abreviacao: string
}

export interface ProximoConcurso {
  concurso: Concurso2
  situacaoConcursoCanal?: string
  probabilidadeDeGanhar: number
  prognosticoMaximo: number
  quantidadeMinima: number
  quantidadeMaxima: number
  teimosinhas: number[]
  valoresAposta: ValoresAposum2[]
  concursoDisponivelSimulacao: boolean
  concursoCanalAberto: boolean
  aceitaEspelho?: boolean
  meses?: Mese2[]
  quantidadeSurpresinhas?: number
  trevos?: Trevos2
  equipes?: Equipe3[]
}

export interface Concurso2 {
  modalidade: Modalidade
  modalidadeDetalhada: ModalidadeDetalhada2
  tipoConcurso: string
  numero: number
  dataFechamento: string
  dataAbertura: string
  dataHoraSorteio: string
  dataSorteio: string
  valorApostaMinima: number
  situacao: string
  bloqueado: boolean
  estimativa: number
  aberto: boolean
  naoInicializado: boolean
  dataFinalBloqueio?: string
}

export interface ModalidadeDetalhada2 {
  valor: number
  descricao: string
  descricaoEspecial: string
}

export interface ValoresAposum2 {
  valor: number
  numeroPrognosticos: number
  numeroTrevos?: number
}

export interface Mese2 {
  numero: number
  nome: string
  abreviacao: string
}

export interface Trevos2 {
  prognosticoMaximoTrevo: number
  quantidadeMinimaTrevo: number
  quantidadeMaximaTrevo: number
}

export interface Equipe3 {
  indicadorSelecao: boolean
  nome: string
  numero: number
  numeroPais: number
  descricaoCurta: string
  uf: string
  nomeClass: string
}
