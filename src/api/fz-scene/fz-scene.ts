import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 分页查询场景类型列表 */
const getFzSceneTypeList = (params: any) => {
  return api.post('/fzSceneSubType/findByPage', params);
};

/* 更新开通/关闭状态 */
const update = (params: any) => {
  return api.post('/fzSceneSubType/update', params);
};

export const fzScene = {
  getFzSceneTypeList,
  update
}
