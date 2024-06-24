import { adminLogin, apiFezinhaOnline } from '../services/api';
import {getLotteryResult, updateGameAwardFezinhaOnline, updateGameEstimativeFezinhaOnline, updateGameFezinhaOnline, verifyAwardFezinhaOnline} from "../services/updateResults"
import { findCompetitions } from '../services/competitions';

const ADM_EMAIL = process.env.ADM_EMAIL as string
const ADM_PASSWORD = process.env.ADM_PASSWORD as string

type RunLotofacilResultsProps = {
  findCompetition?: number;
}

export async function cronRunLotofacilResults(props?: RunLotofacilResultsProps) {
  const data = await getLotteryResult('lotofacil', props?.findCompetition)

  const competitionNumber = Number(data.numero_concurso)

  const findedCompetition = await findCompetitions({
    gameMode: 'lotofacil',
    competition: competitionNumber
  })
  
  if (findedCompetition.drawnNumbers?.length) {
    return { gameMode: 'lotofacil', competitionNumber, message: 'Os resultados desta competição já foram cadastrados!' }
  }

  const { token } = await adminLogin({
    email: ADM_EMAIL,
    password: ADM_PASSWORD
  })

  apiFezinhaOnline.defaults.headers.common.Authorization = `Bearer ${token}`
  
  await updateGameFezinhaOnline(data)
  await updateGameEstimativeFezinhaOnline(data)
  await updateGameAwardFezinhaOnline(data)
  const awards = await verifyAwardFezinhaOnline(data)

  return { gameMode: 'lotofacil', competitionNumber, awards }
}