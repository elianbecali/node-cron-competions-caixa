import { EnumGameMode } from "./gameMode"

export type PostStoreCompetition = CreatedCompetition[]

interface CreatedCompetition {
  gameMode: EnumGameMode
  isCurrent: boolean
  isNext: boolean
  competition: number
  awardDate: string
  closeDate: string
  openDate: string
  prizeEstimative: number
  id: string
}
