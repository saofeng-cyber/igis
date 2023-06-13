import { http } from 'msun-lib-ui';
const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });
const situationToday = (params: any) => {
  return api.post('censusController/situationToday', params);
};

// censusController/situationTodayArea
const situationTodayArea = (params: any) => {
  return api.post('censusController/situationTodayArea', params);
};

export const fzLisRealTime = {
  situationToday,
  situationTodayArea
}
