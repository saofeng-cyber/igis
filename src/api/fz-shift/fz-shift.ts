import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 分页查询列表 */
const getFzShiftList = (params: any) => {
  return api.post('fzShift/findByPage', params);
};

/* 同步数据 */
const syncFzShift = (params: any) => {
  return api.post('fzShift/syncRooms', params);
};

/* 更新 */
const updateFzShift = (params: any) => {
  return api.post('fzShift/update', params);
};

/* 删除 */
const deleteFzShift = (params: any) => {
  return api.post('fzShift/delete', params);
};

export const fzShift = {
  getFzShiftList,
  syncFzShift,
  updateFzShift,
  deleteFzShift
}
