import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API })

// 根据小屏Mac获取诊室信息
const selectClinicAreaAndRoomByMac = (params:any) => {
  return api.post('fzScreenOut/selectClinicAreaAndRoomByMac', params)
}
// 根据诊室id获取医生和患者信息
const selectScreenQueue = (params:any) => {
  return api.post('fzScreenOut/selectScreenQueue', params)
}

// 获取logo
const selectLogoByScreenId = (params:any) => {
  return api.post('fzScreenOut/selectLogoByScreenId', params)
}

// 获取医生照片
const selectDocPicsByDocId = (params:any) => {
  return api.post('fzScreenOut/selectDocPicsByDocId', params)
}

// 根据mac地址修改ip地址
const updateScreenIpByMac = (params:any) => {
  return api.post('fzScreenOut/selectDocPicsByDocId', params)
}

const findTimeSync = () => {
  return api.get('fzTimeSync/findTimeSync')
};

export const fzRoomScreen = {
  selectClinicAreaAndRoomByMac,
  selectScreenQueue,
  selectLogoByScreenId,
  selectDocPicsByDocId,
  updateScreenIpByMac,
  findTimeSync
}
