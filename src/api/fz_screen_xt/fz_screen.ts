import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

interface ClinicAreaAndRoomByMac {
  macAddr: string;
}

interface SelectScreenQueue {
  roomIds: string;
}

interface HdPatPreorderIno {
  hospitalId: string;
  pageNum: number;
  pageSize: number;
  screenMac: string;
}

export const findTimeSync = () => {
  return api.get('/fzTimeSync/findTimeSync');
};

export const getMacAddr = (params: ClinicAreaAndRoomByMac) => {
  return api.post('/fzScreenOut/selectClinicAreaAndRoomByMac', params);
};

export const getScreenQueue = (params: SelectScreenQueue) => {
  return api.post('/fzScreenOut/selectScreenQueue', params);
};

export const getHdPatPreorderIno = (params: HdPatPreorderIno) => {
  return api.post('/fzScreenOut/getHdPatPreorderIno', params);
};
