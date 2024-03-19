import { adminLogin, apiFezinhaOnline } from '../services/api';
import {getLotteryResult, updateGameAwardFezinhaOnline, updateGameEstimativeFezinhaOnline, updateGameFezinhaOnline, verifyAwardFezinhaOnline} from "../services/updateResults"
import { getJogosCaixaInfo } from '../services/api-caixa';
import { createCompetition } from '../services/createCompetion';

const ADM_EMAIL = process.env.ADM_EMAIL as string
const ADM_PASSWORD = process.env.ADM_PASSWORD as string


export async function cronRunMegasenaResults(disableDateValidate?: boolean) {
  try {
    const data = await getLotteryResult('megasena')
    const today = new Intl.DateTimeFormat('pt-br').format(new Date())

    const isResultDrawnToday = data.data_concurso === today
    
    if (!isResultDrawnToday && !disableDateValidate) {
      return console.warn(`Não há resultado da megasena hoje! ${today}`)
    }

    const  { token } = await adminLogin({
      email: ADM_EMAIL,
      password: ADM_PASSWORD
    })

    apiFezinhaOnline.defaults.headers.common.Authorization = `Bearer ${token}`
    
    await updateGameFezinhaOnline(data)
    await updateGameEstimativeFezinhaOnline(data)
    await updateGameAwardFezinhaOnline(data)
    await verifyAwardFezinhaOnline(data)

    const dataResponseCaixa = await getJogosCaixaInfo()
    
    const nextConcurse = dataResponseCaixa.payload.parametros.find(parametro => parametro.proximoConcurso?.concurso.modalidade === 'MEGA_SENA')?.proximoConcurso

    const awardDate = nextConcurse?.concurso.dataHoraSorteio.split(' ')[0].split('/').reverse().join('-')
    const openDate = nextConcurse?.concurso.dataAbertura.split(' ')[0].split('/').reverse().join('-')
    const closeDate = nextConcurse?.concurso.dataFechamento.split(' ')[0].split('/').reverse().join('-')

    const responseCreateConcurse = await createCompetition({
      gameMode: 'megaSena',
      competition: nextConcurse?.concurso.numero,
      awardDate,
      openDate,
      closeDate
    })

    console.log({ createdConcourse: responseCreateConcurse })
  } catch (error) {
    console.log('Deu erro man!')
    console.error(JSON.stringify(error, null, 2))
  }


}