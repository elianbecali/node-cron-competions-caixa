import { GetLotteryResultGame, GetLotteryResultResponse } from "./@types/api"
import { apiFezinhaOnline, apiLoteria } from "./api"

export async function getLotteryResult(lottery: GetLotteryResultGame) {
  const response = await apiLoteria.get<GetLotteryResultResponse>(
    '/resultado',
    { 
      params: {
        loteria: lottery
      }
    }
  )

  return response.data
}

export async function updateGameFezinhaOnline(data: GetLotteryResultResponse) {
  const body = {
    lotofacil: {
      gameMode: "lotofacil",
      competition: Number(data.numero_concurso),
      drawnNumbers: data.dezenas.map(Number),
    }
  }
  
  const response = await apiFezinhaOnline.put('/currentCompetitions/manual', body)
  
  return response.data
}
export async function updateGameEstimativeFezinhaOnline(data: GetLotteryResultResponse) {
  const body = {
    lotofacil: {
      gameMode: "lotofacil",
      competition: Number(data.numero_concurso) + 1,
      prizeEstimative: data.valor_estimado_proximo_concurso,
    }
  }
  
  const response = await apiFezinhaOnline.put('/currentCompetitions/manual', body)
  
  return response.data
}

export async function updateGameAwardFezinhaOnline(data: GetLotteryResultResponse) {
  const award = data.premiacao.map(premio => {
    const acertos = Number(premio.quantidade_acertos.split(' ')[0])

    return {
      quantityOfCorrectNumbers: acertos,
      prize: premio.valor_premio,
      quantityOfWinners: premio.numero_ganhadores,
    }
  })

  const body = {
    gameMode: 'lotofacil',
    competition: data.numero_concurso,
    award
  }

  const response = await apiFezinhaOnline.patch('/competititions/award', body)

  return response.data
}

export async function verifyAwardFezinhaOnline(competition: number) {
  const body = {
    gameMode: 'lotofacil',
    competition,
    sendEmail: true
  }

  const response = await apiFezinhaOnline.post('/prizes/verifyPrizes', body)

  return response.data
}
