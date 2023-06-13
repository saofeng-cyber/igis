import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

interface CallParam {
  diagFlag: string; // 是否已检验（0 未检验 1已检验），默认：0
  callStatus: string; // 叫号状态（1:正在检验；2：等候检验；3:过号；0：全部状态）
  docId: string; // 医生id，系统中的userSysId
  searchMode: string; // 查询模式（1: 按照当前医生；2：按照当前窗口）默认：2
  callerCode: string; // 调用方渠道标识=>lis
  hospitalId: 0;
  orgId: 0;
  roomId: 0;
}

/* 查询 诊区 分页列表 */
const getQueueByCallStatus = (params: any) => {
  return api.post('fzCallPat/selectQueueByCallStatus', params);
};
const findTimeSync = () => {
  return api.get('fzTimeSync/findTimeSync')
};
const selectClinicAreaAndRoomByMac = (params: any) => {
  return api.post('fzScreenOut/selectClinicAreaAndRoomByMac', params);
};

// 队列
const selectScreenQueue = (params:any) => {
  return api.post('fzScreenOut/selectScreenQueue', params)
}
export const fzCallPatApi = {
  getQueueByCallStatus,
  findTimeSync,
  selectClinicAreaAndRoomByMac,
  selectScreenQueue
}
