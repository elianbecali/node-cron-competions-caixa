import { adminLogin, apiFezinhaOnline } from '../services/api';
import {getLotteryResult, updateGameAwardFezinhaOnline, updateGameEstimativeFezinhaOnline, updateGameFezinhaOnline, verifyAwardFezinhaOnline} from "../services/updateResults"
import { findCompetitions } from '../services/competitions';

const ADM_EMAIL = process.env.ADM_EMAIL as string
const ADM_PASSWORD = process.env.ADM_PASSWORD as string

export async function cronRunMegasenaResults() {
  const data = await getLotteryResult('megasena')
  const competitionNumber = Number(data.numero_concurso)

  const findedCompetition = await findCompetitions({
    gameMode: 'megaSena',
    competition: competitionNumber
  })
  
  if (findedCompetition.drawnNumbers?.length) {
    return { gameMode: 'megaSena', competitionNumber, message: 'Os resultados desta competição já foram cadastrados!' }
  }

  const  { token } = await adminLogin({
    email: ADM_EMAIL,
    password: ADM_PASSWORD
  })

  apiFezinhaOnline.defaults.headers.common.Authorization = `Bearer ${token}`
  
  await updateGameFezinhaOnline(data)
  await updateGameEstimativeFezinhaOnline(data)
  await updateGameAwardFezinhaOnline(data)
  const awards = await verifyAwardFezinhaOnline(data)

  return { gameMode: 'megaSena', competitionNumber, awards }
}