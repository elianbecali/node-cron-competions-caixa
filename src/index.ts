require("dotenv").config();
import express, { Router, Response } from "express";
import cron from "node-cron";
import { cronRunLotofacilResults } from "./crons/lotofacil";
import { cronRunMegasenaResults } from "./crons/megasena";
import { runCreateCompetition } from "./crons/competition";
import { EnumGameMode } from "./services/@types/gameMode";
import { runCreateSweepstakes } from "./crons/sweepstakes";
import { login } from "./services/login";

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

route.get("/run/results/megasena", async (req, res) => {
  try {
    const response = await cronRunMegasenaResults()
    
    res.json(response)
  } catch (error) {
    res.status(400).json({ error, message: 'Houve um erro inesperado!' })
  }
});

route.get("/run/sweepstakes/create", async (req, res) => {
  const competition = req.query.competition as string
  const gameMode = req.query.gameMode as EnumGameMode

  if (!competition || !gameMode) {
   return res.status(400).json({ message: 'You need send competition and gameMode params!', params: req.query })
  }

  const competitionNumber = Number(competition)

  if (isNaN(competitionNumber)) {
    return res.status(400).json({ message: 'You need send competition as number valid!', params: req.query })
  }

  const availableGameModes = Object.keys(EnumGameMode)
  const gameModeIsAvailable = availableGameModes.includes(gameMode)

  if (!gameModeIsAvailable) {
    return res.status(400).json({ message: `Only this games is available ${availableGameModes.join(', ')}!`, params: req.query })
  }

  await login()

  const response = await runCreateSweepstakes({ gameMode, competition: competitionNumber })

  res.json(response)
})


app.use(route);

// Segunda á sábado
cron.schedule('58 23 * * 1-6', async () => {
  await cronRunLotofacilResults()
 const { nextCompetition } = await runCreateCompetition(EnumGameMode.lotofacil)

  if (nextCompetition) {
    await runCreateSweepstakes({ gameMode: EnumGameMode.lotofacil, competition: nextCompetition[0].competition })
  }
}, { timezone: 'America/Sao_Paulo' })

// Terça, Quinta e Sábado
cron.schedule('59 23 * * 2,4,6', async () => {
  await cronRunMegasenaResults()
  const { nextCompetition } = await runCreateCompetition(EnumGameMode.megaSena)

  if (nextCompetition) {
    await runCreateSweepstakes({ gameMode: EnumGameMode.megaSena, competition: nextCompetition[0].competition })
  }
}, { timezone: 'America/Sao_Paulo' })

app.listen(SERVER_PORT, () => {
  console.log(`🔥 Server Running on port ${SERVER_PORT}`);
});
