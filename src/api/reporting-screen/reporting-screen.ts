import { http } from 'msun-lib-ui';
import { CardContent } from './reporting-screen.d'

const api = http.create({ baseURL: process.env.VUE_APP_SWIPE_API });
// 读取记录
const readingCard = (params: CardContent) => {
  return api.get('readCard/findPatientsByCard', { params });
}

export const reportingApi = { readingCard }
