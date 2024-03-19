require("dotenv").config();
import express, { Router, Response } from "express";
import cron from "node-cron";
import { cronRunLotofacilResults } from "./crons/lotofacil";
import { cronRunMegasenaResults } from "./crons/megasena";

const SERVER_PORT = process.env.PORT ?? 3000;

const app = express();
const route = Router();

app.use(express.json());

route.get("/", (req, res: Response) => {
  res.json({ message: "Service Cron Job Results Competitions ON LIVE" });
});

route.get("/run/results/lotofacil", () => cronRunLotofacilResults(true));
route.get("/run/results/megasena", () => cronRunMegasenaResults(true));

route

app.use(route);

// Segunda á sábado
cron.schedule('58 23 * * 1-6', () => cronRunLotofacilResults(), { timezone: 'America/Sao_Paulo' })

// Terça, Quinta e Sábado
cron.schedule('59 23 * * 2,4,6', () => cronRunMegasenaResults(), { timezone: 'America/Sao_Paulo' })

app.listen(SERVER_PORT, () => {
  console.log(`🔥 Server Running on port ${SERVER_PORT}`);
});
