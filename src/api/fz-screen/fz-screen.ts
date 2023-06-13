import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 屏幕管理 下拉列表 */
const getFzScreenList = (params: any) => {
  return api.post('/fzScreen/findList', params);
};

/* 查询 屏幕管理 分页列表 */
const getFzScreenListByPage = (params: any) => {
  return api.post('fzScreen/findByPage', params);
};

/* 更新 屏幕管理 */
const updateFzScreen = (params: any) => {
  return api.post('fzScreen/update', params);
};

/* 新增 屏幕管理 */
const saveFzScreen = (params: any) => {
  return api.post('fzScreen/save', params);
};

/* 删除 屏幕管理 */
const deleteFzScreen = (params: any) => {
  return api.post('fzScreen/delete', params);
};

/* 查询 屏幕信息 by id */
const getFzScreenById = (screenId: any) => {
  return api.get('fzScreen/getFzScreenById?screenId=' + screenId);
};

/* 屏幕导入 */
const export2Excel = (params:any) => {
  return api.request({
    url: '/fzScreen/batchImport',
    method: 'post',
    data: params
  })
}

export const fzScreen = {
  getFzScreenList,
  getFzScreenListByPage,
  updateFzScreen,
  saveFzScreen,
  deleteFzScreen,
  getFzScreenById,
  export2Excel
}
