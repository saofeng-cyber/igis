import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });
const findDrugClinic = (params: any) => {
  return api.post('/fzDrugQueue/findDrugClinic', params);
};
const zzjconfirmTriageForDrug = (params: any) => {
  return api.post('/fzDrugQueue/zzjconfirmTriageForDrug', params);
};
export const fzYfReporter = {
  findDrugClinic,
  zzjconfirmTriageForDrug
}
