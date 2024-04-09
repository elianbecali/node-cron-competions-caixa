import { EnumGameMode } from "./@types/gameMode";
import { apiFezinhaOnline } from "./api";

type FindCompetitionsProps = {
  gameMode: 'lotofacil' | 'megaSena';
  competition: number
}

export type PostFindCompetitionsResponse = Competition[]

type CurrentGameModes = {
  megaSena: boolean
  lotofacil: boolean
  lotofacilDeIndependencia: boolean
  megaDaVirada: boolean
}

export type GetCurrentCompetitionsResponse = {
  currentGameModes: CurrentGameModes
  nextCompetitions: Competition<EnumGameMode>[]
  lotofacil: Competition<EnumGameMode.lotofacil>
  megaDaVirada: Competition<EnumGameMode.megaDaVirada>
  megaSena: Competition<EnumGameMode.megaSena>
  lotofacilDeIndependencia: Competition<EnumGameMode.lotofacilDeIndependencia>
}

export interface Competition<T = string> {
  id: string
  gameMode: T
  isCurrent: boolean
  competition: number
  prizeEstimative: number
  awardDate: string
  openDate: string
  closeDate: string
  isNext: boolean
  drawnNumbers: number[]
  award: Award[]
}

export interface Award {
  prize: number
  quantityOfWinners: number
  quantityOfCorrectNumbers: number
}

export async function findCompetitions(competition: FindCompetitionsProps) {
  const body = {
    competitionsToFind: [competition]
  }

  const response = await apiFezinhaOnline.post<PostFindCompetitionsResponse>('/findCompetitions', body)

  return response.data[0]
}

export async function getCurrentCompetitions() {
  const response = await apiFezinhaOnline.get<GetCurrentCompetitionsResponse>('/currentCompetitions')

  return response.data
}