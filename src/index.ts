require('dotenv').config()
import cron from 'node-cron';
import { cronRunLotofacilResults } from './crons/lotofacil';
import { cronRunMegasenaResults } from './crons/megasena';

// Segunda á sábado
cron.schedule('00 22 * * 1-6', cronRunLotofacilResults, { timezone: 'America/Sao_Paulo' })

// Terça, Quinta e Sábado
cron.schedule('00 22 * * 2,4,6', cronRunMegasenaResults, { timezone: 'America/Sao_Paulo' })

