import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 查询配置 */
const selectScene = (params:any) => {
  return api.post('/configureBoot/selectScene', params);
}

/* 修改配置 */
const changeModel = (params:any) => {
  return api.post('/configureBoot/changeModel', params);
}
/* 查询修改状态 */
const findByPage = (params:any) => {
  return api.post('/configureBoot/findByPage', params);
}
const findByPageList = (params: any) => {
  return api.post('/fzConfig/findListByCodeList', params)
}

export const guidanceApi = {
  selectScene,
  changeModel,
  findByPage,
  findByPageList
};
