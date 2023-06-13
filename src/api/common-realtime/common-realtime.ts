import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });
const queryStatisticalAverageTime = (params:any) => {
  return api.post('/fzQueue/queryStatisticalAverageTime', params)
}

const queryNurseWorkload = (params:any) => {
  return api.post('/fzQueue/queryNurseWorkload', params)
}
export const commonRealtime = {
  queryStatisticalAverageTime,
  queryNurseWorkload
}
