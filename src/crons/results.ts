import { adminLogin, apiFezinhaOnline } from '../services/api';
import {getLotteryResult, updateGameAwardFezinhaOnline, updateGameEstimativeFezinhaOnline, updateGameFezinhaOnline, verifyAwardFezinhaOnline} from "../services/updateResults"
import { findCompetitions } from '../services/competitions';
import { EnumGameMode } from '../services/@types/gameMode';

const ADM_EMAIL = process.env.ADM_EMAIL as string
const ADM_PASSWORD = process.env.ADM_PASSWORD as string

type RunLotofacilResultsProps = {
  findCompetition?: number;
  gameMode: EnumGameMode;
}

function mapperNameForSearchResult(gameMode: EnumGameMode) {
  if (gameMode === EnumGameMode.lotofacilDeIndependencia) return EnumGameMode.lotofacil

  if (gameMode === EnumGameMode.megaDaVirada) return EnumGameMode.megaSena

  return gameMode
}

export async function cronGetResults(props: RunLotofacilResultsProps) {
  const game = mapperNameForSearchResult(props.gameMode)
  const data = await getLotteryResult(game, props?.findCompetition)

  const competitionNumber = Number(data.numero_concurso)

  const findedCompetition = await findCompetitions({
    gameMode: props.gameMode,
    competition: competitionNumber
  })
  
  if (findedCompetition.drawnNumbers?.length) {
    return { gameMode: props.gameMode, competitionNumber, message: 'Os resultados desta competição já foram cadastrados!' }
  }

  const { token } = await adminLogin({
    email: ADM_EMAIL,
    password: ADM_PASSWORD
  })

  apiFezinhaOnline.defaults.headers.common.Authorization = `Bearer ${token}`
  
  await updateGameFezinhaOnline(data, props.gameMode)
  await updateGameEstimativeFezinhaOnline(data, props.gameMode)
  await updateGameAwardFezinhaOnline(data, props.gameMode)
  const awards = await verifyAwardFezinhaOnline(data, props.gameMode)

  return { gameMode: props.gameMode, competitionNumber, awards }
}