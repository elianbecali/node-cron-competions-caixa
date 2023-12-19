import cron from 'node-cron';
import { adminLogin, apiFezinhaOnline, getLotteryResult, updateGameFezinhaOnline } from './services/api';

const ADM_EMAIL = process.env.ADM_EMAIL as string
const ADM_PASSWORD = process.env.ADM_PASSWORD as string

cron.schedule('5 * * * *', async () => {
  try {
    const data = await getLotteryResult('lotofacil')

    const  { token } = await adminLogin({
      email: ADM_EMAIL,
      password: ADM_PASSWORD
    })

    apiFezinhaOnline.defaults.headers.common.Authorization = `Bearer ${token}`
    
    const updatedGameFezinha = await updateGameFezinhaOnline(data)
    console.log(updatedGameFezinha)
  } catch (error) {
    console.error(error)
  }


}, { runOnInit: true, timezone: 'America/Sao_Paulo' })

