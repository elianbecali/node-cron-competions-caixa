import { apiFezinhaOnline } from "./api";

type GameCreateCompetitionData = {
  gameMode: string;
  isCurrent: boolean;
  isNext: boolean;
  competition?: number;
  awardDate: string;
  closeDate: string;
  openDate: string;
  prizeEstimative: number;
};

type BodyDataCreateCompetition = {
  nextLotofacil?: GameCreateCompetitionData;
};

type CreateCompetitionProps = {
  gameMode: 'lotofacil'
  competition?: number
  awardDate?: string // yyyy-mm-dd
  closeDate?: string // yyyy-mm-dd
  openDate?: string // yyyy-mm-dd
}

export async function createCompetition({ gameMode, competition, awardDate, closeDate, openDate }: CreateCompetitionProps) {
  const body: BodyDataCreateCompetition = {};

  if (gameMode === 'lotofacil') {
    body.nextLotofacil = {
      gameMode: "lotofacil",
      isCurrent: false,
      isNext: true,
      competition,
      awardDate: `${awardDate}T20:00:00.000-03:00`,
      closeDate: `${closeDate}T19:00:00.000-03:00`,
      openDate: `${openDate}T21:00:00.000-03:00`,
      prizeEstimative: 0,
    };
  }

  return {
    success: true,
    data: body
  }

  // const response = await apiFezinhaOnline.post(
  //   "/currentCompetitions/manual",
  //   body
  // );

  // return response.data;
}
