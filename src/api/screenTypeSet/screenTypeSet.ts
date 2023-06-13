import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 查询 系统配置 分页列表 */
const findMacList = (params: any) => {
  return api.post('/fzScreenMac/findList', params);
};

const findList = (params: any) => {
  return api.post('/fzScreenStyle/findList', params);
};

/* 查询 系统配置 列表查询 */
const findListForMap = (params: any) => {
  return api.post('/fzScreenStyle/findListForMap', params);
};

const updateMac = (params: any) => {
  return api.post('/fzScreenMac/save', params);
};

// 更新屏信息

const update = (params: any) => {
  return api.post('/fzScreenStyle/update', params);
};

export const screenTypeSet = {
  findList,
  update,
  findListForMap,
  findMacList,
  updateMac
}
