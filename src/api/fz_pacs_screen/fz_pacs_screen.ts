import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API })

const selectScreenQueueNotHaveDoctor = (params: any) => {
  return api.post('/fzScreenOut/selectScreenQueueNotHaveDoctor', params);
};

const selectQueueNotDoctorOfMin = (params: any) => {
  return api.post('/fzScreenOut/selectQueueNotDoctorOfMin', params);
};

export const fzPacsScreen = {
  selectScreenQueueNotHaveDoctor,
  selectQueueNotDoctorOfMin
}
