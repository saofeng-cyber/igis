import { http } from 'msun-lib-ui';
const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

const ConfirmCheckInTriage = (params: any) => {
  return api.post('fzLisCheckout/ConfirmCheckInTriage', params);
};
const FzLisSignInTriage = (params: any) => {
  return api.post('fzLisCheckout/fzLisSignInTriage', params);
};
/* lis打印获取数据 */
const getLisPatApplyInfo = (param: any) => {
  return api.post('fzLisCheckout/getLisPatApplyInfo', param)
}
const FzPacsSignInTriage = (params: any) => {
  return api.post('/fzPacsCallNumber/pacsQueryMtAppointmentList', params);
};

const getPacsBarcodeNumber = (params: any) => {
  return api.post('/fzPacsCallNumber/getPacsBarcodeNumber', params);
};
export const fzReportingApi = {
  ConfirmCheckInTriage,
  FzLisSignInTriage,
  getLisPatApplyInfo,
  FzPacsSignInTriage,
  getPacsBarcodeNumber
}
