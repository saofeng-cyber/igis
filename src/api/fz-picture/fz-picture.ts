import { http } from 'msun-lib-ui';
const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 图片窗口 下拉列表 */
const getFzPictureList = (params: any) => {
  return api.post('/fzPicture/findList', params);
};

/* 查询 图片窗口 分页列表 */
const getFzPictureListByPage = (params: any) => {
  return api.post('fzPicture/findByPage', params);
};

/* 更新 图片窗口 */
const updateFzPicture = (params: any) => {
  return api.post('fzPicture/update', params);
};

/* 新增 图片窗口 */
const saveFzPicture = (params: any) => {
  return api.post('fzPicture/save', params);
};

/* 新增 图片窗口 */
const deleteFzPicture = (params: any) => {
  return api.post('fzPicture/delete', params);
};

export const fzPicture = {
  getFzPictureList,
  getFzPictureListByPage,
  updateFzPicture,
  saveFzPicture,
  deleteFzPicture
}
