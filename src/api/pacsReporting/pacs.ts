import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_PACS_API });

/* 分诊报道接口 */
const selfCheckIn = (params: any) => {
  return api.post('/triageQueue/selfCheckIn', params);
};

export const pacsApi = {
  selfCheckIn
};
