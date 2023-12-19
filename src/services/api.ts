import axios from "axios";
import { GetLotteryResultGame, GetLotteryResultResponse, LoginRequestData, LoginResponseData } from "./@types/api";

export const apiLoteria = axios.create({
  baseURL: "https://apiloterias.com.br/app/v2",
  params: {
    token: 'fkCRUwH0AysZ3Jn'
  }
})
export const apiFezinhaOnline = axios.create({
  baseURL: "https://shark-app-5k78i.ondigitalocean.app/api",
})

export async function getLotteryResult(lottery: GetLotteryResultGame) {
  const response = await apiLoteria.get<GetLotteryResultResponse>(
    '/resultado',
    { 
      params: {
        loteria: lottery
      }
    }
  )

  return response.data
}

export async function updateGameFezinhaOnline(data: GetLotteryResultResponse) {
  const body = {
    lotofacil: {
      gameMode: "lotofacil",
      competion: data.numero_concurso,
      prizeEstimative: data.valor_acumulado_proximo_concurso,
      drawnNumbers: data.dezenas.map(Number),
    }
  }

  const response = await apiFezinhaOnline.post('/currentCompetitions/manual', body)

  return response.data
}

export const adminLogin = async (
  params: LoginRequestData
): Promise<LoginResponseData> => {
  try {
    const { data } = await apiFezinhaOnline.post<LoginResponseData>(
      "/auth/admin/login",
      params
    );

    return data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};