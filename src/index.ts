require('dotenv').config()
import cron from 'node-cron';
import { adminLogin, apiFezinhaOnline, getLotteryResult, updateGameAwardFezinhaOnline, updateGameEstimativeFezinhaOnline, updateGameFezinhaOnline, verifyAwardFezinhaOnline } from './services/api';

const ADM_EMAIL = process.env.ADM_EMAIL as string
const ADM_PASSWORD = process.env.ADM_PASSWORD as string

cron.schedule('05 22 * * 1-6', async (date) => {
  console.log('Running at', date.toLocaleString())

  try {
    const data = await getLotteryResult('lotofacil')

    const  { token } = await adminLogin({
      email: ADM_EMAIL,
      password: ADM_PASSWORD
    })

    apiFezinhaOnline.defaults.headers.common.Authorization = `Bearer ${token}`
    
    await updateGameFezinhaOnline(data)
    await updateGameEstimativeFezinhaOnline(data)
    await updateGameAwardFezinhaOnline(data)
    await verifyAwardFezinhaOnline(Number(data.numero_concurso))
    console.log(data)
    console.log('success')
  } catch (error) {
    console.error(error)
  }


}, { timezone: 'America/Sao_Paulo' })

