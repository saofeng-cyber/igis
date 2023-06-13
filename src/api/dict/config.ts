import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/** 获取配置中心数据 */
const getConfig = (params: any) => {
  return api.post('/api/config/getStringConfig', params);
}

export const config = {
  getConfig
};
