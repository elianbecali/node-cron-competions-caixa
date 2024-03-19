import axios from "axios";
import { GETJogosInfoCaixaResponse } from "./@types/api-caixa";

const API_LOTERIA_ONLINE_CAIXA_URL = "https://www.loteriasonline.caixa.gov.br/silce-servico-rest/rest/v1/cGFyYW1ldHJvcy1zaW11bGFjYW8v/"

export const getJogosCaixaInfo = async (
): Promise<GETJogosInfoCaixaResponse> => {
  try {
    const { data } = await axios.get(API_LOTERIA_ONLINE_CAIXA_URL);

    return data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};