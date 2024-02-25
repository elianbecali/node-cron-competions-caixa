require('dotenv').config()
import express from 'express'
import cron from 'node-cron';
import { cronRunLotofacilResults } from './crons/lotofacil';
import { cronRunMegasenaResults } from './crons/megasena';

const app = express()
const SERVER_PORT = process.env.PORT ?? 3000

// Segunda á sábado
cron.schedule('20 22 * * 1-6', cronRunLotofacilResults, { timezone: 'America/Sao_Paulo' })

// Terça, Quinta e Sábado
cron.schedule('20 22 * * 2,4,6', cronRunMegasenaResults, { timezone: 'America/Sao_Paulo' })

app.listen(SERVER_PORT, () => {
  console.log('Server Running on port 3333')
})
