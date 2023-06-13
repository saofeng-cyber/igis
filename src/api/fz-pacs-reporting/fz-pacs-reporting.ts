import { http } from 'msun-lib-ui';
const api = http.create({ baseURL: process.env.VUE_APP_PACS_API });

const FzPacsSelfCheckIn = (params: any) => {
  return api.post('/triageQueue/selfCheckIn', params);
};
export const fzPacsReporting = {
  FzPacsSelfCheckIn
}
