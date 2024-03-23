import { apiFezinhaOnline } from "./api";

type FindCompetitionsProps = {
  gameMode: 'lotofacil' | 'megaSena';
  competition: number
}

export type PostFindCompetitionsResponse = Competition[]

export interface Competition {
  id: string
  gameMode: string
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
