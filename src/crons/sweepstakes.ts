import { EnumGameMode } from "../services/@types/gameMode";
import { createSweepstakes, getSweepstakes } from "../services/sweepstakes";

type RunCreateSweepstakesProps = {
  gameMode: EnumGameMode;
  competition: number;
};

const sweepstakesToCreate = {
  lotofacil: [
    {
      totalPrice: 0,
      amountOfShares: 20,
      amountOfSharesBought: 1,
      oddsMultiplier: 0,
      generate: [
        {
          quantityOfGames: 50,
          quantityOfNumbers: 15,
        },
      ],
    },
    {
      totalPrice: 200,
      amountOfShares: 20,
      amountOfSharesBought: 1,
      oddsMultiplier: 0,
      generate: [
        {
          quantityOfGames: 30,
          quantityOfNumbers: 15,
        },
      ],
    },
    {
      totalPrice: 0,
      amountOfShares: 20,
      amountOfSharesBought: 1,
      oddsMultiplier: 0,
      generate: [
        {
          quantityOfGames: 100,
          quantityOfNumbers: 15,
        },
      ],
    },
    {
      totalPrice: 0,
      amountOfShares: 20,
      amountOfSharesBought: 1,
      oddsMultiplier: 0,
      generate: [
        {
          quantityOfGames: 5,
          quantityOfNumbers: 16,
        },
      ],
    },
  ],
  lotofacilDeIndependencia: [],
  megaSena: [
    {
      totalPrice: 0,
      amountOfShares: 20,
      amountOfSharesBought: 1,
      oddsMultiplier: 0,
      generate: [
        {
          quantityOfGames: 30,
          quantityOfNumbers: 6,
        },
      ],
    },
    // {
    //   totalPrice: 0,
    //   amountOfShares: 20,
    //   amountOfSharesBought: 1,
    //   oddsMultiplier: 0,
    //   generate: [
    //     {
    //       quantityOfGames: 60,
    //       quantityOfNumbers: 6,
    //     },
    //   ],
    // },
    // {
    //   totalPrice: 0,
    //   amountOfShares: 20,
    //   amountOfSharesBought: 1,
    //   oddsMultiplier: 0,
    //   generate: [
    //     {
    //       quantityOfGames: 90,
    //       quantityOfNumbers: 6,
    //     },
    //   ],
    // },
  ],
  megaDaVirada: [],
};

export async function runCreateSweepstakes({
  gameMode,
  competition,
}: RunCreateSweepstakesProps) {
  const allSweepstakes = await getSweepstakes();

  const currentSweepstakes = allSweepstakes.data.filter(
    (sweepstake) =>
      sweepstake.gameMode === gameMode && sweepstake.competition === competition
  );

  const sweepstakesPromises = sweepstakesToCreate[gameMode]
    .filter((sweepstakeToCreate) => {
      const amountOfShares = sweepstakeToCreate.amountOfShares;
      const quantityGames = sweepstakeToCreate.generate[0].quantityOfGames;
      const quantityOfNumbers =
        sweepstakeToCreate.generate[0].quantityOfNumbers;

      const hasSweepstakeCreated = currentSweepstakes.find((findSweepstake) => {
        const games =
          findSweepstake[`${findSweepstake.gameMode}GamesInSweepstake`];

        const hasSameAmountOfShares =
          findSweepstake.amountOfShares === amountOfShares;
        const hasSameQuantityOfGames = games.length === quantityGames;
        const hasSameQuantityOfNumbersInGames =
          games[0].numbersQuantity === quantityOfNumbers;

        return (
          hasSameAmountOfShares &&
          hasSameQuantityOfGames &&
          hasSameQuantityOfNumbersInGames
        );
      });

      return !hasSweepstakeCreated;
    })
    .map((sweepstake) =>
      createSweepstakes({ gameMode, competition, ...sweepstake })
    );

  if (sweepstakesPromises.length) {
    let responses = [];
    for await (const sweepstakeCreated of sweepstakesPromises) {
      responses.push(sweepstakeCreated);
    }

    return responses;
  }

  return { message: "Nenhum bolão criado!" };
}
