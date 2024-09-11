import { GetLotteryResultGame, GetLotteryResultResponse } from "./@types/api"
import { EnumGameMode } from "./@types/gameMode"
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

export async function updateGameFezinhaOnline(data: GetLotteryResultResponse, game: EnumGameMode) {
  const body: any = {}

  if (game === EnumGameMode.lotofacil) {
    body.lotofacil = {
      gameMode: "lotofacil",
      competition: Number(data.numero_concurso),
      drawnNumbers: data.dezenas.map(Number),
    }
  }
  
  if (game === EnumGameMode.megaSena) {
    body.megaSena = {
      gameMode: "megaSena",
      competition: Number(data.numero_concurso),
      drawnNumbers: data.dezenas.map(Number),
    }
  }

  if (game === EnumGameMode.lotofacilDeIndependencia) {
    body.lotofacilDeIndependencia = {
      gameMode: "lotofacilDeIndependencia",
      competition: Number(data.numero_concurso),
      drawnNumbers: data.dezenas.map(Number),
    }
  }

  if (game === EnumGameMode.megaDaVirada) {
    body.megaDaVirada = {
      gameMode: "megaDaVirada",
      competition: Number(data.numero_concurso),
      drawnNumbers: data.dezenas.map(Number),
    }
  }
  
  const response = await apiFezinhaOnline.put('/currentCompetitions/manual', body)
  
  return response.data
}
export async function updateGameEstimativeFezinhaOnline(data: GetLotteryResultResponse, game: EnumGameMode) {
  const body: any = {}

  if (game === EnumGameMode.lotofacil) {
    body.lotofacil = {
      gameMode: EnumGameMode.lotofacil,
      competition: Number(data.numero_concurso) + 1,
      prizeEstimative: data.valor_estimado_proximo_concurso,
    }
  }
  
  if (game === EnumGameMode.megaSena) {
    body.megaSena = {
      gameMode: EnumGameMode.megaSena,
      competition: Number(data.numero_concurso) + 1,
      prizeEstimative: data.valor_estimado_proximo_concurso,
    }
  }
  if (game === EnumGameMode.lotofacilDeIndependencia) {
    body.lotofacilDeIndependencia = {
      gameMode: EnumGameMode.lotofacilDeIndependencia,
      competition: Number(data.numero_concurso) + 1,
      prizeEstimative: data.valor_estimado_proximo_concurso,
    }
  }
  if (game === EnumGameMode.megaDaVirada) {
    body.megaDaVirada = {
      gameMode: EnumGameMode.megaDaVirada,
      competition: Number(data.numero_concurso) + 1,
      prizeEstimative: data.valor_estimado_proximo_concurso,
    }
  }
  
  const response = await apiFezinhaOnline.put('/currentCompetitions/manual', body)
  
  return response.data
}

export async function updateGameAwardFezinhaOnline(data: GetLotteryResultResponse, game: EnumGameMode) {
  const award = data.premiacao.map(premio => {
    const acertos = Number(premio.quantidade_acertos.split(' ')[0])

    return {
      quantityOfCorrectNumbers: acertos,
      prize: premio.valor_premio,
      quantityOfWinners: premio.numero_ganhadores,
    }
  })

  const body: any = {
    gameMode: game,
    competition: data.numero_concurso,
    award
  }

  const response = await apiFezinhaOnline.patch('/competititions/award', body)

  return response.data
}

export async function verifyAwardFezinhaOnline(data: GetLotteryResultResponse, game: EnumGameMode) {
  const body: any = {
    gameMode: game,
    competition: Number(data.numero_concurso),
    sendEmail: true
  }

  const response = await apiFezinhaOnline.post('/prizes/verifyPrizes', body)

  return response.data
}
