import cron from 'node-cron';
import { apiLoteria } from './services/api';

cron.schedule('5 * * * *', async () => {
  const response = await apiLoteria.get(
    '/resultado',
    { 
      params: {
        loteria: 'lotofacil'
      }
    }
  )

  console.log('response', response.data)
}, { runOnInit: true, timezone: 'America/Sao_Paulo' })

