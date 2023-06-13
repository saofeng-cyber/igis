import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_OUTPATIENT_API });

/* 查询 医院配置 列表分页  */
export const findOutPresTradeOrder = (params: any) => {
  return api.post('/outSettle/findOutTradeOrder', params);
};
