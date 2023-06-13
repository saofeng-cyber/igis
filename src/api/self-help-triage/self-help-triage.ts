import { http } from 'msun-lib-ui'

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 查询当前院内所有的诊区信息 */
const getFzClinicAreas = (params:any) => {
  return api.post('/fzSelfHelpOut/getFzClinicAreas', params);
}

/* 根据诊区id查询诊室信息 */
const getRoomByClinicAreaId = (params: any) => {
  return api.post('/fzSelfHelpOut/getRoomByClinicAreaId', params);
}

/* 根据诊区id和诊室id查询在线医生 */
const getDocByAreaIdRoomId = (params: any) => {
  return api.post('/fzSelfHelpOut/getDocByAreaIdRoomId', params);
}

/* 查询分诊队列类型，非预约挂号模式下 */
const getDefaultQueueTypeCode = (params: any) => {
  return api.post('fzSelfHelpOut/getDefaultQueueTypeCode', params);
}

/* 查询分诊队列类,预约挂号模式下 */
const getDefaultQueueTypeCodeForAppointment = (params: any) => {
  return api.post('fzQueue/getDefaultQueueTypeCodeForAppointment', params);
}

/* 确认分诊 */
const triage = (params: any) => {
  return api.post('/fzSelfHelpOut/triage', params)
}

/* 查询患者预约挂号记录 */
const getBusinessData = (params: any) => {
  return api.post('/fzSelfHelpOut/getStayQueueByOutpatid', params)
}

/* 心电自助机分诊签到 */
const zzjconfirmTriageForEcg = (params: any) => {
  return api.post('/fzQueue/zzjconfirmTriageForEcg', params)
}

export const selfServiceTriage = {
  getFzClinicAreas,
  getRoomByClinicAreaId,
  getDocByAreaIdRoomId,
  getDefaultQueueTypeCode,
  getDefaultQueueTypeCodeForAppointment,
  triage,
  getBusinessData,
  zzjconfirmTriageForEcg
}
