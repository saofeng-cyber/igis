import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });
interface ScreenQueueWithConfig {
  docQueue: number
  roomIds: string
  roomQueue: number
}

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

const selectScreenQueueWithConfig = (params: ScreenQueueWithConfig) => {
  return api.post('/fzScreenOut/selectScreenQueueWithConfig', params);
};

export const fzAreaScreen = {
  selectClinicAreaAndRoomByMac,
  selectScreenQueue,
  getFzScreenByMac,
  findTimeSync,
  selectScreenQueueWithConfig
};
