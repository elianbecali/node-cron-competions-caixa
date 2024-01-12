import { adminLogin, apiFezinhaOnline } from '../services/api';
import {getLotteryResult, updateGameAwardFezinhaOnline, updateGameEstimativeFezinhaOnline, updateGameFezinhaOnline, verifyAwardFezinhaOnline} from "../services/updateResults"
import { getJogosCaixaInfo } from '../services/api-caixa';
import { createCompetition } from '../services/createCompetion';

const ADM_EMAIL = process.env.ADM_EMAIL as string
const ADM_PASSWORD = process.env.ADM_PASSWORD as string


export async function cronRunLotofacilResults(now: Date | "manual" | "init") {
  console.log('Lotofácil - Running at', now.toLocaleString())

  try {
    const data = await getLotteryResult('lotofacil')
    const today = new Intl.DateTimeFormat('pt-br').format(new Date())

    const isResultDrawnToday = data.data_concurso === today
    
    if (!isResultDrawnToday) {
      console.log({ dataRealizadoConcurso: data.data_concurso, dataDeHoje: today })
      return console.warn('Não foi realizado um sorteio hoje!')
    }

    console.log({ concurso: data.numero_concurso, dezenas: data.dezenas })

    const  { token } = await adminLogin({
      email: ADM_EMAIL,
      password: ADM_PASSWORD
    })

    apiFezinhaOnline.defaults.headers.common.Authorization = `Bearer ${token}`
    
    await updateGameFezinhaOnline(data)
    await updateGameEstimativeFezinhaOnline(data)
    await updateGameAwardFezinhaOnline(data)
    await verifyAwardFezinhaOnline(data)

    // const dataResponseCaixa = await getJogosCaixaInfo()
    
    // const nextLotofacilConcurse = dataResponseCaixa.payload.parametros.find(parametro => parametro.proximoConcurso?.concurso.modalidade === 'LOTOFACIL')?.proximoConcurso

    // const awardDate = nextLotofacilConcurse?.concurso.dataHoraSorteio.split(' ')[0].split('/').reverse().join('-')
    // const openDate = nextLotofacilConcurse?.concurso.dataAbertura.split(' ')[0].split('/').reverse().join('-')
    // const closeDate = nextLotofacilConcurse?.concurso.dataFechamento.split(' ')[0].split('/').reverse().join('-')

    // const responseCreateConcurse = await createCompetition({
    //   gameMode: 'lotofacil',
    //   competition: nextLotofacilConcurse?.concurso.numero,
    //   awardDate,
    //   openDate,
    //   closeDate
    // })

    // console.log(responseCreateConcurse)
  } catch (error) {
    console.log('Deu erro man!')
    console.error(JSON.stringify(error, null, 2))
  }


}