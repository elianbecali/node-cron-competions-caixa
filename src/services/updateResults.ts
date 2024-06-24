import { GetLotteryResultGame, GetLotteryResultResponse } from "./@types/api"
import { apiFezinhaOnline, apiLoteria } from "./api"

export async function getLotteryResult(lottery: GetLotteryResultGame, findCompetition?: number) {
  const response = await apiLoteria.get<GetLotteryResultResponse>(
    '/resultado',
    { 
      params: {
        loteria: lottery,
        concurso: findCompetition
      }
    }
  )

  return response.data
}

export async function updateGameFezinhaOnline(data: GetLotteryResultResponse) {
  const body: any = {}

  if (data.nome === 'LOTOFÁCIL') {
    body.lotofacil = {
      gameMode: "lotofacil",
      competition: Number(data.numero_concurso),
      drawnNumbers: data.dezenas.map(Number),
    }
  }
  
  if (data.nome === 'MEGA-SENA') {
    body.megaSena = {
      gameMode: "megaSena",
      competition: Number(data.numero_concurso),
      drawnNumbers: data.dezenas.map(Number),
    }
  }
  
  const response = await apiFezinhaOnline.put('/currentCompetitions/manual', body)
  
  return response.data
}
export async function updateGameEstimativeFezinhaOnline(data: GetLotteryResultResponse) {
  const body: any = {}

  if (data.nome === 'LOTOFÁCIL') {
    body.lotofacil = {
      gameMode: "lotofacil",
      competition: Number(data.numero_concurso) + 1,
      prizeEstimative: data.valor_estimado_proximo_concurso,
    }
  }
  
  if (data.nome === 'MEGA-SENA') {
    body.megaSena = {
      gameMode: "megaSena",
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

  const body: any = {
    competition: data.numero_concurso,
    award
  }

  if (data.nome === 'LOTOFÁCIL') {
    body.gameMode = 'lotofacil'
  }

  if (data.nome === 'MEGA-SENA') {
    body.gameMode = 'megaSena'
  }

  const response = await apiFezinhaOnline.patch('/competititions/award', body)

  return response.data
}

export async function verifyAwardFezinhaOnline(data: GetLotteryResultResponse) {
  const body: any = {
    competition: Number(data.numero_concurso),
    sendEmail: true
  }

  if (data.nome === 'LOTOFÁCIL') {
    body.gameMode = 'lotofacil'
  }

  if (data.nome === 'MEGA-SENA') {
    body.gameMode = 'megaSena'
  }

  const response = await apiFezinhaOnline.post('/prizes/verifyPrizes', body)

  return response.data
}
