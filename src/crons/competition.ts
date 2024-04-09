import { addDays, format, setHours } from "date-fns";
import { EnumGameMode } from "../services/@types/gameMode";
import { getCurrentCompetitions } from "../services/competitions";
import { apiFezinhaOnline } from "../services/api";

function isNotValidDay(day: number, gameMode: EnumGameMode) {
  const sunday = 0;
  const monday = 1;
  const tuesday = 2;
  const wednesday = 3;
  const thursday = 4;
  const friday = 5;
  const saturday = 6;

  if (
    [EnumGameMode.lotofacil, EnumGameMode.lotofacilDeIndependencia].includes(
      gameMode
    )
  ) {
    return day === sunday;
  }

  if (gameMode === EnumGameMode.megaSena) {
    return ![tuesday, thursday, saturday].includes(day);
  }
}

type CalculateNextDrawDateProps = {
  drawDate: Date;
  gameMode: EnumGameMode;
};

async function calculateNextDrawDate({
  drawDate,
  gameMode,
}: CalculateNextDrawDateProps): Promise<Date> {
  let nextDate = addDays(drawDate, 1);

  while (isNotValidDay(nextDate.getDay(), gameMode)) {
    nextDate = addDays(nextDate, 1);
  }

  return nextDate;
}

export async function runCreateCompetition(gameMode: EnumGameMode) {
  const currentCompetitions = await getCurrentCompetitions();

  const currentCompetition = currentCompetitions[gameMode];
  const hasNextCompetition = currentCompetitions.nextCompetitions.find(
    (competition) => competition.gameMode === gameMode
  );

  if (hasNextCompetition) {
    return {
      error: "competition.already.registred",
      message: `Já existe a próxima competição da ${gameMode} ${hasNextCompetition.competition} cadastrado!`,
    };
  }

  const nextDrawDate = await calculateNextDrawDate({
    drawDate: new Date(currentCompetition.awardDate),
    gameMode: currentCompetition.gameMode,
  });

  const payload = {
    [gameMode]: {
      gameMode: gameMode,
      isCurrent: false,
      isNext: true,
      competition: currentCompetition.competition + 1,
      prizeEstimative: 0,
      awardDate:
        format(new Date(nextDrawDate), "yyyy-MM-dd") + "T20:00:00.000-03:00",
      closeDate:
        format(new Date(nextDrawDate), "yyyy-MM-dd") + "T19:00:00.000-03:00",
      openDate:
        format(new Date(currentCompetition.awardDate), "yyyy-MM-dd") +
        "T21:00:00.000-03:00",
    },
  };

  const createdNextCompetition = await apiFezinhaOnline.post(
    "/currentCompetitions/manual",
    payload
  );

  return { currentCompetition, payload, createdNextCompetition };
}
