import axios from "axios";
import { GetLotteryResultGame, GetLotteryResultResponse, LoginRequestData, LoginResponseData } from "./@types/api";

const BASE_URL_FEZINHA = "https://shark-app-5k78i.ondigitalocean.app"

export const apiLoteria = axios.create({
  baseURL: "https://apiloterias.com.br/app/v2",
  params: {
    token: 'fkCRUwH0AysZ3Jn'
  }
})
export const apiFezinhaOnline = axios.create({
  baseURL: BASE_URL_FEZINHA + "/api",
})

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