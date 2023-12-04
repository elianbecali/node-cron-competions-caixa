import axios from "axios";

export const apiLoteria = axios.create({
  baseURL: "https://apiloterias.com.br/app/v2",
  params: {
    token: 'fkCRUwH0AysZ3Jn'
  }
})