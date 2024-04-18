import { EnumGameMode } from "./gameMode"

export interface GetSweepstakesResponse {
  data: Sweepstake[]
}

interface Sweepstake {
  id: string
  gameMode: EnumGameMode
  competition: number
  totalPrice: number
  amountOfShares: number
  amountOfSharesBought: number
  priceByShare: number
  oddsMultiplier: number
  createdAt: string
  updatedAt: string
  isCurrent: boolean
  hasPaid: boolean
  megaDaViradaGamesInSweepstake: GamesInSweepstake<EnumGameMode.megaDaVirada>[]
  lotofacilDeIndependenciaGamesInSweepstake: GamesInSweepstake<EnumGameMode.lotofacilDeIndependencia>[]
  megaSenaGamesInSweepstake: GamesInSweepstake<EnumGameMode.megaSena>[]
  lotofacilGamesInSweepstake: GamesInSweepstake<EnumGameMode.lotofacil>[]
  // selectedCompetition: SelectedCompetition
}

type GamesInSweepstake<GameMode> = {
  id: string
  sweepstakeId: string
  gameMode: GameMode
  competition: number
  numbersQuantity: number
  numbersSelected: number[]
  price: number
  createdAt: string
  updatedAt: string
  printStatus: string
  prize: any
  hitsQuantity: any
}

type SelectedCompetition = {
  id: string
  gameMode: string
  isCurrent: boolean
  competition: number
  prizeEstimative: number
  awardDate: string
  openDate: string
  closeDate: string
  isNext: boolean
  drawnNumbers: any
  award: any
}
