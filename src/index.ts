require("dotenv").config();
import express, { Router, Response } from "express";
import cron from "node-cron";
import { cronRunLotofacilResults } from "./crons/lotofacil";
import { cronRunMegasenaResults } from "./crons/megasena";
import { runCreateCompetition } from "./crons/competition";
import { EnumGameMode } from "./services/@types/gameMode";
import { adminLogin, apiFezinhaOnline } from "./services/api";

const SERVER_PORT = process.env.PORT ?? 3000;
const ADM_EMAIL = process.env.ADM_EMAIL as string
const ADM_PASSWORD = process.env.ADM_PASSWORD as string

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
    const { token } = await adminLogin({
      email: ADM_EMAIL,
      password: ADM_PASSWORD
    })
  
    apiFezinhaOnline.defaults.headers.common.Authorization = `Bearer ${token}`

    const nextCompetition = await runCreateCompetition(EnumGameMode.lotofacil)

    return res.json(nextCompetition)
  } catch (error) {
    console.log(error)
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
    const { token } = await adminLogin({
      email: ADM_EMAIL,
      password: ADM_PASSWORD
    })
  
    apiFezinhaOnline.defaults.headers.common.Authorization = `Bearer ${token}`

    const nextCompetition = await runCreateCompetition(EnumGameMode.megaSena)

    return res.json(nextCompetition)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error, message: 'Houve um erro inesperado!' })
  }
});

app.use(route);

// Segunda á sábado
cron.schedule('58 23 * * 1-6', async () => {
  await cronRunLotofacilResults()
  await runCreateCompetition(EnumGameMode.lotofacil)
}, { timezone: 'America/Sao_Paulo' })

// Terça, Quinta e Sábado
cron.schedule('59 23 * * 2,4,6', async () => {
  await cronRunMegasenaResults()
  await runCreateCompetition(EnumGameMode.megaSena)
}, { timezone: 'America/Sao_Paulo' })

app.listen(SERVER_PORT, () => {
  console.log(`🔥 Server Running on port ${SERVER_PORT}`);
});
