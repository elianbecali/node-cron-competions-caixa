import { EnumGameMode } from "./@types/gameMode";
import { GetSweepstakesResponse } from "./@types/sweepstakes";
import { apiFezinhaOnline } from "./api";

export async function getSweepstakes() {
  const response = await apiFezinhaOnline.get<GetSweepstakesResponse>('/sweepstakes/current')

  return response.data
}

type CreateSweepstakesProps = {
  gameMode: EnumGameMode;
  competition: number;
  totalPrice?: number;
  amountOfShares: number;
  oddsMultiplier: number
  amountOfSharesBought: number;
  generate: Array<{
    quantityOfNumbers: number;
    quantityOfGames: number;
  }>
}

export async function createSweepstakes(data: CreateSweepstakesProps) {
  const response = await apiFezinhaOnline.post('/sweepstakes', data) 

  return response.data
}