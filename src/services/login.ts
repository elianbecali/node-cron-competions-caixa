import { adminLogin, apiFezinhaOnline } from "./api"

const ADM_EMAIL = process.env.ADM_EMAIL as string
const ADM_PASSWORD = process.env.ADM_PASSWORD as string

export async function login() {
  const { token } = await adminLogin({
    email: ADM_EMAIL,
    password: ADM_PASSWORD
  })

  apiFezinhaOnline.defaults.headers.common.Authorization = `Bearer ${token}`
}