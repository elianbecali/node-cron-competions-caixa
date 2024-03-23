require("dotenv").config();
import express, { Router, Response } from "express";
import cron from "node-cron";
import { cronRunLotofacilResults } from "./crons/lotofacil";
import { cronRunMegasenaResults } from "./crons/megasena";
import { getJogosCaixaInfo } from "./services/api-caixa";
import { createCompetition } from "./services/createCompetion";

const SERVER_PORT = process.env.PORT ?? 3000;

const app = express();
const route = Router();

app.use(express.json());

route.get("/", (req, res: Response) => {
  res.json({ message: "Service Cron Job Results Competitions ON LIVE" });
});

route.get("/run/results/lotofacil", async (req, res) => {
  try {
    const response = await cronRunLotofacilResults()
  
    res.json(response)
  } catch (error) {
    res.status(400).json({ error, message: 'Houve um erro inesperado!' })
  }
});

route.get("/run/competitions/create-by-caixa/lotofacil", async (req, res) => {
  try {
    const dataResponseCaixa = await getJogosCaixaInfo()
  
    const nextLotofacilConcurse = dataResponseCaixa.payload.parametros.find(parametro => parametro.proximoConcurso?.concurso.modalidade === 'LOTOFACIL')?.proximoConcurso
  
    const awardDate = nextLotofacilConcurse?.concurso.dataHoraSorteio.split(' ')[0].split('/').reverse().join('-')
    const openDate = nextLotofacilConcurse?.concurso.dataAbertura.split(' ')[0].split('/').reverse().join('-')
    const closeDate = nextLotofacilConcurse?.concurso.dataFechamento.split(' ')[0].split('/').reverse().join('-')
  
    const responseCreateConcurse = await createCompetition({
      gameMode: 'lotofacil',
      competition: nextLotofacilConcurse?.concurso.numero,
      awardDate,
      openDate,
      closeDate
    })

    return res.json(responseCreateConcurse)
  } catch (error) {
    res.status(400).json({ error, message: 'Houve um erro inesperado!' })
  }
});

route.get("/run/results/megasena", async (req, res) => {
  try {
    const response = await cronRunMegasenaResults()
    
    res.json(response)
  } catch (error) {
    res.status(400).json({ error, message: 'Houve um erro inesperado!' })
  }
});

route.get("/run/competitions/create-by-caixa/megaSena", async (req, res) => {
  try {
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

    return res.json(responseCreateConcurse)
  } catch (error) {
    res.status(400).json({ error, message: 'Houve um erro inesperado!' })
  }
});

app.use(route);

// Segunda á sábado
cron.schedule('58 23 * * 1-6', () => cronRunLotofacilResults(), { timezone: 'America/Sao_Paulo' })

// Terça, Quinta e Sábado
cron.schedule('59 23 * * 2,4,6', () => cronRunMegasenaResults(), { timezone: 'America/Sao_Paulo' })

app.listen(SERVER_PORT, () => {
  console.log(`🔥 Server Running on port ${SERVER_PORT}`);
});
