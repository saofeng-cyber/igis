import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 分页查询分诊模板列表 */
const queryTriageTemplate = (params: any) => {
  return api.post('/fzSignalTemplate/findByPage', params);
};

export const tmTriageTemplate = {
  queryTriageTemplate
}
