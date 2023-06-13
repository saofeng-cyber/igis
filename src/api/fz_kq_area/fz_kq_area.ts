import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

const selectClinicAreaAndRoomByMac = (params: any) => {
  return api.post('fzScreenOut/selectClinicAreaAndRoomByMac', params);
};

const selectScreenQueue = (params: any) => {
  return api.post('fzScreenOut/selectScreenQueue', params);
};

const getFzScreenByMac = (params: any) => {
  return api.get('fzScreen/getFzScreenByMac', { params });
};

const findTimeSync = () => {
  return api.get('fzTimeSync/findTimeSync');
};

// 获取logo
const selectLogoByScreenId = (params: any) => {
  return api.post('fzScreenOut/selectLogoByScreenId', params);
};

export const fzKqScreen = {
  selectClinicAreaAndRoomByMac,
  selectScreenQueue,
  getFzScreenByMac,
  findTimeSync,
  selectLogoByScreenId
};
