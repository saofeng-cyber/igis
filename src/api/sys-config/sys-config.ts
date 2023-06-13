import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 查询 系统配置 分页列表 */
const getAppointConfigByPage = (params: any) => {
  return api.post('fzConfig/findListByPage', params);
};

/* 更新 系统配置 */
const upDateConfig = (params: any) => {
  return api.post('fzConfig/updateConfig', params);
};

/* 新增 系统配置 */
const addConfig = (params: any) => {
  return api.post('fzConfig/addConfig', params);
};

export const SysConfigApi = {
  getAppointConfigByPage,
  upDateConfig,
  addConfig
}
